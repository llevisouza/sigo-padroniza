import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Aluno } from "../types/Aluno";
import { ExportConfig } from "../types/Export";
import { AlunoInsight } from "../types/AlunoInsight";
import { AdjustmentHistoryEntry } from "../types/AdjustmentHistory";
import { AppStats, FilterMode, NotificationState, NotificationType, SearchField, TabKey } from "../types/AppUi";
import { AlunoAdjustment, applyAlunoAdjustments, getAlunoAdjustments } from "../utils/adjustments";
import {
  buildAdjustmentHistoryEntries,
  canRevertAdjustment,
  getAdjustmentHistoryStats,
} from "../utils/adjustmentHistory";
import { ExportReport, prepareAlunosForExport } from "../utils/exportPreparation";
import {
  getBatchAdjustmentLabel,
  getFieldDisplayName,
  getScopedAdjustments,
  getScopedErrorFields,
} from "../utils/adjustmentPresentation";
import { exportarTXT } from "../utils/generator";
import { paginateItems } from "../utils/pagination";
import { onlyDigits } from "../utils/stringUtils";
import { validateAluno } from "../utils/validator";

const NOTIFICATION_TIMEOUT_MS = 5000;

export function useAlunoWorkspace() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | undefined>(undefined);
  const [notification, setNotification] = useState<NotificationState>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("arquivo");
  const [exportReport, setExportReport] = useState<ExportReport | null>(null);
  const [adjustmentHistory, setAdjustmentHistory] = useState<AdjustmentHistoryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(25);
  const [issuesCurrentPage, setIssuesCurrentPage] = useState(1);
  const [issuesPageSize, setIssuesPageSize] = useState(25);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [errorFieldFilter, setErrorFieldFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("all");
  const [isPending, startTransition] = useTransition();
  const notificationTimeoutRef = useRef<number | null>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current !== null) {
        window.clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const showNotification = useCallback((type: NotificationType, message: string) => {
    if (notificationTimeoutRef.current !== null) {
      window.clearTimeout(notificationTimeoutRef.current);
    }

    setNotification({ type, message });
    notificationTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
      notificationTimeoutRef.current = null;
    }, NOTIFICATION_TIMEOUT_MS);
  }, []);

  const dismissNotification = useCallback(() => {
    if (notificationTimeoutRef.current !== null) {
      window.clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }

    setNotification(null);
  }, []);

  const recordAdjustments = useCallback((entries: AdjustmentHistoryEntry[]) => {
    if (entries.length === 0) {
      return;
    }

    setAdjustmentHistory((previous) => entries.concat(previous));
    setHistoryCurrentPage(1);
  }, []);

  const handleUpload = useCallback(
    (novosAlunos: Aluno[], importErrors: string[]) => {
      startTransition(() => {
        setAlunos((previous) => previous.concat(novosAlunos));
        setCurrentPage(1);
        setActiveTab("arquivo");
      });

      if (importErrors.length > 0) {
        showNotification(
          "info",
          `${novosAlunos.length} registro(s) importado(s). Alguns arquivos trouxeram avisos de layout.`
        );
        return;
      }

      showNotification("success", `${novosAlunos.length} registro(s) importado(s) com sucesso.`);
    },
    [showNotification, startTransition]
  );

  const handleAddAluno = useCallback(() => {
    setEditingAluno(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditAluno = useCallback((aluno: Aluno) => {
    setEditingAluno(aluno);
    setIsFormOpen(true);
  }, []);

  const handleDeleteAluno = useCallback(
    (id: string) => {
      if (!window.confirm("Tem certeza que deseja excluir este registro?")) {
        return;
      }

      startTransition(() => {
        setAlunos((previous) => previous.filter((aluno) => aluno.id !== id));
      });
      showNotification("info", "Registro removido da base atual.");
    },
    [showNotification, startTransition]
  );

  const { insightsById, searchIndexById, filterIndex, stats } = useMemo(() => {
    const map = new Map<string, AlunoInsight>();
    const searchIndex = new Map<string, Record<SearchField, string>>();
    const alunosPorFlag = {
      all: [] as Aluno[],
      invalid: [] as Aluno[],
      I: [] as Aluno[],
      A: [] as Aluno[],
      E: [] as Aluno[],
    };
    const adjustableRecordsByFlag = {
      all: 0,
      invalid: 0,
      I: 0,
      A: 0,
      E: 0,
    };
    const invalidByField = new Map<string, Aluno[]>();
    const adjustableRecordsByInvalidField = new Map<string, number>();
    const fieldErrors: Record<string, number> = {};
    let invalidCount = 0;
    let blockingCount = 0;
    let adjustableRecords = 0;
    let adjustableFields = 0;

    for (const aluno of alunos) {
      alunosPorFlag.all.push(aluno);
      alunosPorFlag[aluno.flag].push(aluno);

      const adjustments = getAlunoAdjustments(aluno);
      const adjustmentFields = new Set(adjustments.map((adjustment) => adjustment.field));
      const errors = validateAluno(aluno, adjustments);
      const blockingErrors = errors.filter((error) => error.severity === "error");
      const warnings = errors.filter((error) => error.severity === "warning");

      map.set(aluno.id, { adjustments, errors, blockingErrors, warnings });
      searchIndex.set(aluno.id, {
        all: [
          aluno.nome,
          aluno.matricula,
          aluno.cpf || "",
          aluno.rg || "",
          aluno.nomeMae,
          aluno.nomePai || "",
        ]
          .join(" ")
          .toLowerCase(),
        nome: aluno.nome.toLowerCase(),
        matricula: aluno.matricula.toLowerCase(),
        cpf: (aluno.cpf || "").toLowerCase(),
        rg: (aluno.rg || "").toLowerCase(),
        nomeMae: aluno.nomeMae.toLowerCase(),
      });

      if (adjustments.length > 0) {
        adjustableRecords++;
        adjustableFields += adjustments.length;
        adjustableRecordsByFlag.all++;
        adjustableRecordsByFlag[aluno.flag]++;
      }

      if (errors.length > 0) {
        invalidCount++;
        alunosPorFlag.invalid.push(aluno);
        if (adjustments.length > 0) {
          adjustableRecordsByFlag.invalid++;
        }
      }

      const seenFields = new Set<keyof Aluno>();
      for (const error of errors) {
        if (error.severity === "error") {
          blockingCount++;
        }
        fieldErrors[error.field] = (fieldErrors[error.field] || 0) + 1;

        if (!seenFields.has(error.field)) {
          const alunosForField = invalidByField.get(error.field) ?? [];
          alunosForField.push(aluno);
          invalidByField.set(error.field, alunosForField);
          seenFields.add(error.field);
        }
      }

      for (const field of seenFields) {
        if (!adjustmentFields.has(field)) {
          continue;
        }

        adjustableRecordsByInvalidField.set(field, (adjustableRecordsByInvalidField.get(field) ?? 0) + 1);
      }
    }

    const computedStats: AppStats = {
      total: alunos.length,
      invalid: invalidCount,
      valid: alunos.length - invalidCount,
      blocking: blockingCount,
      adjustableRecords,
      adjustableFields,
      isAllValid: alunos.length > 0 && blockingCount === 0,
      topErrors: Object.entries(fieldErrors).sort((left, right) => right[1] - left[1]),
    };

    return {
      insightsById: map,
      searchIndexById: searchIndex,
      filterIndex: {
        alunosPorFlag,
        invalidByField,
        adjustableRecordsByFlag,
        adjustableRecordsByInvalidField,
      },
      stats: computedStats,
    };
  }, [alunos]);

  const filteredAlunos = useMemo(() => {
    let result: Aluno[];

    if (filterMode === "invalid") {
      result = errorFieldFilter
        ? filterIndex.invalidByField.get(errorFieldFilter) ?? []
        : filterIndex.alunosPorFlag.invalid;
    } else if (filterMode === "all") {
      result = filterIndex.alunosPorFlag.all;
    } else {
      result = filterIndex.alunosPorFlag[filterMode];
    }

    if (!deferredSearchTerm.trim()) {
      return result;
    }

    const term = deferredSearchTerm.toLowerCase();
    return result.filter((aluno) => {
      const index = searchIndexById.get(aluno.id);
      if (!index) {
        return false;
      }

      return index[searchField].includes(term);
    });
  }, [deferredSearchTerm, errorFieldFilter, filterIndex, filterMode, searchField, searchIndexById]);

  const alunosPage = useMemo(
    () => paginateItems(filteredAlunos, currentPage, pageSize),
    [currentPage, filteredAlunos, pageSize]
  );

  useEffect(() => {
    if (currentPage !== alunosPage.currentPage) {
      setCurrentPage(alunosPage.currentPage);
    }
  }, [alunosPage.currentPage, currentPage]);

  const reportIssues = exportReport?.issues ?? [];
  const historyPage = useMemo(
    () => paginateItems(adjustmentHistory, historyCurrentPage, historyPageSize),
    [adjustmentHistory, historyCurrentPage, historyPageSize]
  );
  const issuesPage = useMemo(
    () => paginateItems(reportIssues, issuesCurrentPage, issuesPageSize),
    [issuesCurrentPage, issuesPageSize, reportIssues]
  );

  useEffect(() => {
    if (historyCurrentPage !== historyPage.currentPage) {
      setHistoryCurrentPage(historyPage.currentPage);
    }
  }, [historyCurrentPage, historyPage.currentPage]);

  useEffect(() => {
    if (issuesCurrentPage !== issuesPage.currentPage) {
      setIssuesCurrentPage(issuesPage.currentPage);
    }
  }, [issuesCurrentPage, issuesPage.currentPage]);

  const alunosById = useMemo(() => new Map(alunos.map((aluno) => [aluno.id, aluno])), [alunos]);
  const historyStats = useMemo(() => getAdjustmentHistoryStats(adjustmentHistory), [adjustmentHistory]);
  const initialInstitutionCode = useMemo(() => onlyDigits(alunos[0]?.codigoEscola), [alunos]);
  const preferredAdjustmentField = errorFieldFilter;
  const filteredAdjustableRecords = useMemo(() => {
    if (filterMode === "invalid") {
      return preferredAdjustmentField
        ? filterIndex.adjustableRecordsByInvalidField.get(preferredAdjustmentField) ?? 0
        : filterIndex.adjustableRecordsByFlag.invalid;
    }

    if (filterMode === "all") {
      return filterIndex.adjustableRecordsByFlag.all;
    }

    return filterIndex.adjustableRecordsByFlag[filterMode];
  }, [filterIndex, filterMode, preferredAdjustmentField]);
  const batchAdjustLabel = useMemo(
    () => getBatchAdjustmentLabel(preferredAdjustmentField, filteredAdjustableRecords, filteredAlunos.length),
    [filteredAdjustableRecords, filteredAlunos.length, preferredAdjustmentField]
  );

  const setSearchFieldAndReset = useCallback((field: SearchField) => {
    startTransition(() => {
      setSearchField(field);
      setCurrentPage(1);
    });
  }, [startTransition]);

  const setSearchTermAndReset = useCallback((term: string) => {
    startTransition(() => {
      setSearchTerm(term);
      setCurrentPage(1);
    });
  }, [startTransition]);

  const applyFilter = useCallback((mode: FilterMode, field?: string | null) => {
    startTransition(() => {
      setFilterMode(mode);
      setErrorFieldFilter(field ?? null);
      setCurrentPage(1);
    });
  }, [startTransition]);

  const clearErrorFieldFilter = useCallback(() => {
    startTransition(() => {
      setErrorFieldFilter(null);
      setCurrentPage(1);
    });
  }, [startTransition]);

  const setMainPageSize = useCallback((size: number) => {
    startTransition(() => {
      setPageSize(size);
      setCurrentPage(1);
    });
  }, [startTransition]);

  const setHistoryPageSizeAndReset = useCallback((size: number) => {
    startTransition(() => {
      setHistoryPageSize(size);
      setHistoryCurrentPage(1);
    });
  }, [startTransition]);

  const setIssuesPageSizeAndReset = useCallback((size: number) => {
    startTransition(() => {
      setIssuesPageSize(size);
      setIssuesCurrentPage(1);
    });
  }, [startTransition]);

  const handleAdjustAluno = useCallback(
    (aluno: Aluno, preferredField?: string | null) => {
      const insight = insightsById.get(aluno.id);
      const adjustments = insight?.adjustments ?? getAlunoAdjustments(aluno);
      const errors = insight?.errors ?? validateAluno(aluno, adjustments);
      const scopedAdjustments = getScopedAdjustments(adjustments, preferredField);
      const scopedErrorFields = getScopedErrorFields(errors, preferredField);

      if (scopedAdjustments.length === 0) {
        if (scopedErrorFields.length > 0) {
          setEditingAluno(aluno);
          setIsFormOpen(true);
          showNotification(
            "info",
            preferredField
              ? `${getFieldDisplayName(preferredField)} exige revisao manual neste registro.`
              : "Esse registro exige revisao manual."
          );
          return;
        }

        showNotification("info", "Esse registro ja esta padronizado para a pendencia selecionada.");
        return;
      }

      setAlunos((previous) =>
        previous.map((item) => (item.id === aluno.id ? applyAlunoAdjustments(item, scopedAdjustments) : item))
      );
      recordAdjustments(buildAdjustmentHistoryEntries(aluno, scopedAdjustments, "registro"));
      showNotification(
        "success",
        `${scopedAdjustments.length} ajuste(s) aplicado(s) em ${aluno.matricula || aluno.nome}.`
      );
    },
    [insightsById, recordAdjustments, showNotification]
  );

  const handleAdjustAll = useCallback((preferredField?: string | null) => {
    const updatedById = new Map<string, Aluno>();
    let affectedRecords = 0;
    let appliedFields = 0;
    const historyEntries: AdjustmentHistoryEntry[] = [];

    for (const aluno of filteredAlunos) {
      const adjustments = insightsById.get(aluno.id)?.adjustments ?? getAlunoAdjustments(aluno);
      const scopedAdjustments = getScopedAdjustments(adjustments, preferredField);

      if (scopedAdjustments.length === 0) {
        continue;
      }

      const updatedAluno = applyAlunoAdjustments(aluno, scopedAdjustments);
      updatedById.set(aluno.id, updatedAluno);
      affectedRecords++;
      appliedFields += scopedAdjustments.length;
      historyEntries.push(...buildAdjustmentHistoryEntries(aluno, scopedAdjustments, "lote"));
    }

    if (affectedRecords === 0) {
      showNotification("info", "Nenhum ajuste automatico disponivel no conjunto filtrado.");
      return;
    }

    startTransition(() => {
      setAlunos((previous) => previous.map((aluno) => updatedById.get(aluno.id) ?? aluno));
    });
    recordAdjustments(historyEntries);
    showNotification(
      "success",
      `${appliedFields} ajuste(s) aplicado(s) em ${affectedRecords} registro(s) do conjunto filtrado.`
    );
  }, [filteredAlunos, insightsById, recordAdjustments, showNotification, startTransition]);

  const handleSaveAluno = useCallback(
    (aluno: Aluno, appliedAdjustments: AlunoAdjustment[] = []) => {
      if (editingAluno) {
        startTransition(() => {
          setAlunos((previous) => previous.map((item) => (item.id === aluno.id ? aluno : item)));
        });
        showNotification("success", "Registro atualizado com sucesso.");
      } else {
        startTransition(() => {
          setAlunos((previous) => {
            if (previous.some((item) => item.id === aluno.id)) {
              return previous;
            }
            return previous.concat(aluno);
          });
        });
        showNotification("success", "Novo registro inserido na base atual.");
      }

      if (appliedAdjustments.length > 0) {
        recordAdjustments(buildAdjustmentHistoryEntries(aluno, appliedAdjustments, "formulario"));
        showNotification("success", `${appliedAdjustments.length} ajuste(s) aplicado(s) e salvos no registro.`);
      }

      startTransition(() => {
        setIsFormOpen(false);
      });
    },
    [editingAluno, recordAdjustments, showNotification, startTransition]
  );

  const handleRevertAdjustment = useCallback(
    (entry: AdjustmentHistoryEntry) => {
      if (entry.revertedAt) {
        showNotification("info", "Esse ajuste ja foi revertido.");
        return;
      }

      const aluno = alunosById.get(entry.alunoId);
      if (!aluno) {
        showNotification("error", "Nao foi possivel reverter: o registro nao existe mais.");
        return;
      }

      if (!canRevertAdjustment(entry, aluno)) {
        showNotification("error", "Nao foi possivel reverter automaticamente porque o valor atual ja foi alterado.");
        return;
      }

      startTransition(() => {
        setAlunos((previous) =>
          previous.map((item) => (item.id === entry.alunoId ? { ...item, [entry.field]: entry.before } : item))
        );
        setAdjustmentHistory((previous) =>
          previous.map((historyEntry) =>
            historyEntry.id === entry.id ? { ...historyEntry, revertedAt: new Date().toISOString() } : historyEntry
          )
        );
        setActiveTab("relatorio");
      });
      showNotification("success", `Ajuste revertido para o campo ${entry.field}.`);
    },
    [alunosById, showNotification, startTransition]
  );

  const handleExport = useCallback(() => {
    if (alunos.length === 0) {
      showNotification("error", "Nao ha dados para exportar.");
      return;
    }

    setIsExportModalOpen(true);
  }, [alunos.length, showNotification]);

  const handleConfirmExport = useCallback(
    (config: ExportConfig) => {
      try {
        const prepared = prepareAlunosForExport(alunos, config.exportFlag);
        exportarTXT(prepared.alunos, config);
        setExportReport(prepared.report);
        setIssuesCurrentPage(1);
        setActiveTab("relatorio");
        setIsExportModalOpen(false);

        if (prepared.report.pendingFields > 0) {
          showNotification(
            "info",
            `Arquivo gerado sem ajustes automaticos. Ainda existem ${prepared.report.pendingFields} pendencia(s) em ${prepared.report.pendingRecords} registro(s).`
          );
        } else {
          showNotification("success", "Arquivo gerado com sucesso.");
        }
      } catch {
        showNotification("error", "Erro ao gerar arquivo.");
      }
    },
    [alunos, showNotification]
  );

  const closeExportModal = useCallback(() => {
    setIsExportModalOpen(false);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleClearImportedData = useCallback(() => {
    if (!window.confirm("Deseja limpar todos os registros importados e o relatorio gerado?")) {
      return;
    }

    startTransition(() => {
      setAlunos([]);
      setExportReport(null);
      setAdjustmentHistory([]);
      setEditingAluno(undefined);
      setIsFormOpen(false);
      setIsExportModalOpen(false);
      setActiveTab("arquivo");
      setCurrentPage(1);
      setHistoryCurrentPage(1);
      setIssuesCurrentPage(1);
      setFilterMode("all");
      setErrorFieldFilter(null);
      setSearchTerm("");
      setSearchField("all");
    });
    showNotification("info", "Os dados importados e o relatorio foram removidos.");
  }, [showNotification, startTransition]);

  return {
    alunos,
    insightsById,
    stats,
    filteredAlunos,
    paginatedAlunos: alunosPage.items,
    currentPage: alunosPage.currentPage,
    totalPages: alunosPage.totalPages,
    pageSize,
    activeTab,
    filterMode,
    errorFieldFilter,
    searchTerm,
    searchField,
    reportIssues,
    exportReport,
    adjustmentHistory,
    paginatedAdjustmentHistory: historyPage.items,
    historyCurrentPage: historyPage.currentPage,
    totalHistoryPages: historyPage.totalPages,
    historyPageSize,
    paginatedReportIssues: issuesPage.items,
    issuesCurrentPage: issuesPage.currentPage,
    totalIssuePages: issuesPage.totalPages,
    issuesPageSize,
    historyStats,
    initialInstitutionCode,
    isPending,
    preferredAdjustmentField,
    filteredAdjustableFields: filteredAdjustableRecords,
    batchAdjustLabel,
    alunosById,
    editingAluno,
    isFormOpen,
    isExportModalOpen,
    notification,
    hasReportContent: adjustmentHistory.length > 0 || Boolean(exportReport),
    setActiveTab,
    setCurrentPage,
    setMainPageSize,
    setHistoryCurrentPage,
    setHistoryPageSizeAndReset,
    setIssuesCurrentPage,
    setIssuesPageSizeAndReset,
    setSearchFieldAndReset,
    setSearchTermAndReset,
    applyFilter,
    clearErrorFieldFilter,
    handleUpload,
    handleAddAluno,
    handleEditAluno,
    handleDeleteAluno,
    handleAdjustAluno,
    handleAdjustAll,
    handleSaveAluno,
    handleRevertAdjustment,
    handleExport,
    handleConfirmExport,
    handleClearImportedData,
    closeForm,
    closeExportModal,
    dismissNotification,
    showNotification,
  };
}
