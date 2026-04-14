import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Aluno } from "../types/Aluno";
import { AlunoInsight } from "../types/AlunoInsight";
import { AdjustmentHistoryEntry } from "../types/AdjustmentHistory";
import { AppStats, FilterMode, NotificationState, NotificationType, SearchField, TabKey } from "../types/AppUi";
import { AlunoAdjustment, applyAlunoAdjustments, getAlunoAdjustments } from "../utils/adjustments";
import {
  buildAdjustmentHistoryEntries,
  canRevertAdjustment,
  getAdjustmentHistoryStats,
} from "../utils/adjustmentHistory";
import { ExportFlag, ExportReport, prepareAlunosForExport } from "../utils/exportPreparation";
import { exportarTXT } from "../utils/generator";
import { paginateItems } from "../utils/pagination";
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
  const notificationTimeoutRef = useRef<number | null>(null);

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
      setAlunos((previous) => previous.concat(novosAlunos));
      setCurrentPage(1);
      setActiveTab("arquivo");

      if (importErrors.length > 0) {
        showNotification(
          "info",
          `${novosAlunos.length} registro(s) importado(s). Alguns arquivos trouxeram avisos de layout.`
        );
        return;
      }

      showNotification("success", `${novosAlunos.length} registro(s) importado(s) com sucesso.`);
    },
    [showNotification]
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

      setAlunos((previous) => previous.filter((aluno) => aluno.id !== id));
      showNotification("info", "Registro removido da base atual.");
    },
    [showNotification]
  );

  const { insightsById, stats } = useMemo(() => {
    const map = new Map<string, AlunoInsight>();
    const fieldErrors: Record<string, number> = {};
    let invalidCount = 0;
    let blockingCount = 0;
    let adjustableRecords = 0;
    let adjustableFields = 0;

    for (const aluno of alunos) {
      const adjustments = getAlunoAdjustments(aluno);
      const errors = validateAluno(aluno, adjustments);
      const blockingErrors = errors.filter((error) => error.severity === "error");
      const warnings = errors.filter((error) => error.severity === "warning");

      map.set(aluno.id, { adjustments, errors, blockingErrors, warnings });

      if (adjustments.length > 0) {
        adjustableRecords++;
        adjustableFields += adjustments.length;
      }

      if (errors.length > 0) {
        invalidCount++;
      }

      for (const error of errors) {
        if (error.severity === "error") {
          blockingCount++;
        }
        fieldErrors[error.field] = (fieldErrors[error.field] || 0) + 1;
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

    return { insightsById: map, stats: computedStats };
  }, [alunos]);

  const filteredAlunos = useMemo(() => {
    let result = alunos;

    if (filterMode === "invalid") {
      result = result.filter((aluno) => {
        const insight = insightsById.get(aluno.id);
        if (!insight || insight.errors.length === 0) {
          return false;
        }

        if (errorFieldFilter) {
          return insight.errors.some((error) => error.field === errorFieldFilter);
        }

        return true;
      });
    } else if (filterMode !== "all") {
      result = result.filter((aluno) => aluno.flag === filterMode);
    }

    if (!searchTerm.trim()) {
      return result;
    }

    const term = searchTerm.toLowerCase();
    return result.filter((aluno) => {
      if (searchField === "all") {
        return (
          aluno.nome.toLowerCase().includes(term) ||
          aluno.matricula.toLowerCase().includes(term) ||
          (aluno.cpf && aluno.cpf.includes(term)) ||
          (aluno.rg && aluno.rg.toLowerCase().includes(term)) ||
          aluno.nomeMae.toLowerCase().includes(term) ||
          (aluno.nomePai && aluno.nomePai.toLowerCase().includes(term))
        );
      }

      const value = aluno[searchField] || "";
      return value.toLowerCase().includes(term);
    });
  }, [alunos, errorFieldFilter, filterMode, insightsById, searchField, searchTerm]);

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

  const setSearchFieldAndReset = useCallback((field: SearchField) => {
    setSearchField(field);
    setCurrentPage(1);
  }, []);

  const setSearchTermAndReset = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const applyFilter = useCallback((mode: FilterMode, field?: string | null) => {
    setFilterMode(mode);
    setErrorFieldFilter(field ?? null);
    setCurrentPage(1);
  }, []);

  const clearErrorFieldFilter = useCallback(() => {
    setErrorFieldFilter(null);
    setCurrentPage(1);
  }, []);

  const setMainPageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const setHistoryPageSizeAndReset = useCallback((size: number) => {
    setHistoryPageSize(size);
    setHistoryCurrentPage(1);
  }, []);

  const setIssuesPageSizeAndReset = useCallback((size: number) => {
    setIssuesPageSize(size);
    setIssuesCurrentPage(1);
  }, []);

  const handleAdjustAluno = useCallback(
    (aluno: Aluno) => {
      const adjustments = insightsById.get(aluno.id)?.adjustments ?? getAlunoAdjustments(aluno);

      if (adjustments.length === 0) {
        showNotification("info", "Esse registro ja esta padronizado.");
        return;
      }

      setAlunos((previous) =>
        previous.map((item) => (item.id === aluno.id ? applyAlunoAdjustments(item, adjustments) : item))
      );
      recordAdjustments(buildAdjustmentHistoryEntries(aluno, adjustments, "registro"));
      showNotification("success", `${adjustments.length} ajuste(s) aplicado(s) em ${aluno.matricula || aluno.nome}.`);
    },
    [insightsById, recordAdjustments, showNotification]
  );

  const handleAdjustAll = useCallback(() => {
    let affectedRecords = 0;
    let appliedFields = 0;
    const historyEntries: AdjustmentHistoryEntry[] = [];

    setAlunos((previous) =>
      previous.map((aluno) => {
        const adjustments = insightsById.get(aluno.id)?.adjustments ?? getAlunoAdjustments(aluno);
        if (adjustments.length === 0) {
          return aluno;
        }

        affectedRecords++;
        appliedFields += adjustments.length;
        historyEntries.push(...buildAdjustmentHistoryEntries(aluno, adjustments, "lote"));
        return applyAlunoAdjustments(aluno, adjustments);
      })
    );

    if (affectedRecords === 0) {
      showNotification("info", "Nenhum ajuste sugerido nos registros carregados.");
      return;
    }

    recordAdjustments(historyEntries);
    showNotification(
      "success",
      `${appliedFields} ajuste(s) aplicado(s) em ${affectedRecords} registro(s) da base carregada.`
    );
  }, [insightsById, recordAdjustments, showNotification]);

  const handleSaveAluno = useCallback(
    (aluno: Aluno, appliedAdjustments: AlunoAdjustment[] = []) => {
      if (editingAluno) {
        setAlunos((previous) => previous.map((item) => (item.id === aluno.id ? aluno : item)));
        showNotification("success", "Registro atualizado com sucesso.");
      } else {
        setAlunos((previous) => {
          if (previous.some((item) => item.id === aluno.id)) {
            return previous;
          }
          return previous.concat(aluno);
        });
        showNotification("success", "Novo registro inserido na base atual.");
      }

      if (appliedAdjustments.length > 0) {
        recordAdjustments(buildAdjustmentHistoryEntries(aluno, appliedAdjustments, "formulario"));
        showNotification("success", `${appliedAdjustments.length} ajuste(s) aplicado(s) e salvos no registro.`);
      }

      setIsFormOpen(false);
    },
    [editingAluno, recordAdjustments, showNotification]
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

      setAlunos((previous) =>
        previous.map((item) => (item.id === entry.alunoId ? { ...item, [entry.field]: entry.before } : item))
      );
      setAdjustmentHistory((previous) =>
        previous.map((historyEntry) =>
          historyEntry.id === entry.id ? { ...historyEntry, revertedAt: new Date().toISOString() } : historyEntry
        )
      );
      setActiveTab("relatorio");
      showNotification("success", `Ajuste revertido para o campo ${entry.field}.`);
    },
    [alunosById, showNotification]
  );

  const handleExport = useCallback(() => {
    if (alunos.length === 0) {
      showNotification("error", "Nao ha dados para exportar.");
      return;
    }

    setIsExportModalOpen(true);
  }, [alunos.length, showNotification]);

  const handleConfirmExport = useCallback(
    (exportFlag: ExportFlag) => {
      try {
        const prepared = prepareAlunosForExport(alunos, exportFlag);
        exportarTXT(prepared.alunos, exportFlag);
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
    showNotification("info", "Os dados importados e o relatorio foram removidos.");
  }, [showNotification]);

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
