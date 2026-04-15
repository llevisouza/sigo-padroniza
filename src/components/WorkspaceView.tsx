import { memo, type ReactNode } from "react";
import { Info, Plus, RotateCcw, Trash2, Wand2 } from "lucide-react";
import { TabelaAlunos } from "./TabelaAlunos";
import { Pagination } from "./Pagination";
import { AdjustmentHistoryEntry } from "../types/AdjustmentHistory";
import { TabKey, FilterMode } from "../types/AppUi";
import { ExportReport, ExportIssue } from "../utils/exportPreparation";
import { adjustmentSourceLabel, canRevertAdjustment } from "../utils/adjustmentHistory";
import { Aluno } from "../types/Aluno";
import { AlunoInsight } from "../types/AlunoInsight";
import { getFieldDisplayName } from "../utils/adjustmentPresentation";

type WorkspaceViewProps = {
  activeTab: TabKey;
  filterMode: FilterMode;
  preferredAdjustmentField: string | null;
  adjustAllLabel: string;
  exportReport: ExportReport | null;
  hasReportContent: boolean;
  alunos: Aluno[];
  filteredAlunos: Aluno[];
  paginatedAlunos: Aluno[];
  insightsById: Map<string, AlunoInsight>;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isBusy: boolean;
  onTabChange: (tab: TabKey) => void;
  onClearData: () => void;
  onAdjustAll: (preferredField?: string | null) => void;
  onAddAluno: () => void;
  onDeleteAluno: (id: string) => void;
  onEditAluno: (aluno: Aluno) => void;
  onAdjustAluno: (aluno: Aluno, preferredField?: string | null) => void;
  onMainPageChange: (page: number) => void;
  onMainPageSizeChange: (size: number) => void;
  statsAdjustableFields: number;
  adjustmentHistory: AdjustmentHistoryEntry[];
  paginatedAdjustmentHistory: AdjustmentHistoryEntry[];
  historyCurrentPage: number;
  totalHistoryPages: number;
  historyPageSize: number;
  onHistoryPageChange: (page: number) => void;
  onHistoryPageSizeChange: (size: number) => void;
  alunosById: Map<string, Aluno>;
  onRevertAdjustment: (entry: AdjustmentHistoryEntry) => void;
  historyStats: { total: number; reverted: number; adjustedRecords: number; open: number };
  reportIssues: ExportIssue[];
  paginatedReportIssues: ExportIssue[];
  issuesCurrentPage: number;
  totalIssuePages: number;
  issuesPageSize: number;
  onIssuesPageChange: (page: number) => void;
  onIssuesPageSizeChange: (size: number) => void;
};

export const WorkspaceView = memo(function WorkspaceView({
  activeTab,
  filterMode,
  preferredAdjustmentField,
  adjustAllLabel,
  exportReport,
  hasReportContent,
  alunos,
  filteredAlunos,
  paginatedAlunos,
  insightsById,
  currentPage,
  totalPages,
  pageSize,
  isBusy,
  onTabChange,
  onClearData,
  onAdjustAll,
  onAddAluno,
  onDeleteAluno,
  onEditAluno,
  onAdjustAluno,
  onMainPageChange,
  onMainPageSizeChange,
  statsAdjustableFields,
  adjustmentHistory,
  paginatedAdjustmentHistory,
  historyCurrentPage,
  totalHistoryPages,
  historyPageSize,
  onHistoryPageChange,
  onHistoryPageSizeChange,
  alunosById,
  onRevertAdjustment,
  historyStats,
  reportIssues,
  paginatedReportIssues,
  issuesCurrentPage,
  totalIssuePages,
  issuesPageSize,
  onIssuesPageChange,
  onIssuesPageSizeChange,
}: WorkspaceViewProps) {
  return (
    <section className="surface-card flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => onTabChange("arquivo")}
                className={`rounded px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  activeTab === "arquivo" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Arquivo
              </button>
              <button
                onClick={() => onTabChange("relatorio")}
                className={`rounded px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  activeTab === "relatorio" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Relatorio
              </button>
            </div>

            {isBusy && (
              <span className="inline-flex items-center gap-2 text-[12px] font-medium text-slate-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                Atualizando base
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2 xl:justify-end">
            <button
              onClick={onClearData}
              disabled={alunos.length === 0}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                alunos.length > 0
                  ? "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  : "cursor-not-allowed text-slate-400"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Limpar Dados
            </button>

            {activeTab === "arquivo" && (
              <>
                <div className="hidden h-4 w-px bg-slate-300 lg:block" />
                <button
                  onClick={() => onAdjustAll(preferredAdjustmentField)}
                  disabled={statsAdjustableFields === 0}
                  title={adjustAllLabel}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-medium shadow-sm transition-all duration-150 ${
                    statsAdjustableFields > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                      : "cursor-not-allowed text-slate-400"
                  }`}
                >
                  <Wand2 className="h-4 w-4" />
                  <span className="whitespace-nowrap">{adjustAllLabel}</span>
                </button>

                <button
                  onClick={onAddAluno}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950"
                >
                  <Plus className="h-4 w-4" />
                  Novo Aluno
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {activeTab === "arquivo" ? (
        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-950">
              {filterMode === "invalid" ? "Registros com pendencia" : "Registros de Alunos"}
            </h2>
          </div>

          <TabelaAlunos
            alunos={paginatedAlunos}
            insightsById={insightsById}
            onDelete={onDeleteAluno}
            onEdit={onEditAluno}
            onAdjust={onAdjustAluno}
            preferredAdjustmentField={preferredAdjustmentField}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onMainPageChange}
            pageSize={pageSize}
            onPageSizeChange={onMainPageSizeChange}
            totalItems={filteredAlunos.length}
          />
        </div>
      ) : (
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5">
          {!hasReportContent ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-8 text-center">
              <Info className="mb-4 h-10 w-10 text-slate-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Nenhum relatorio gerado</h3>
              <p className="max-w-md text-[13px] leading-relaxed text-slate-500">
                Exporte um arquivo ou aplique ajustes manuais para visualizar historico e pendencias nesta guia.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ReportStatCard label="Ajustes Aplicados" value={historyStats.total} />
                <ReportStatCard label="Ajustes Revertidos" value={historyStats.reverted} />
                <ReportStatCard label="Registros Ajustados" value={historyStats.adjustedRecords} />
                <ReportStatCard label="Abertos para Reversao" value={historyStats.open} />
              </div>

              <ReportTableShell
                title="Historico de Ajustes"
                subtitle="Cada ajuste manual aplicado aparece aqui com opcao de reversao."
                total={adjustmentHistory.length}
              >
                {adjustmentHistory.length === 0 ? (
                  <div className="px-6 py-12 text-center text-[13px] text-slate-500">
                    Nenhum ajuste manual foi aplicado ainda.
                  </div>
                ) : (
                  <>
                    <div className="custom-scrollbar overflow-x-auto">
                      <table className="w-full text-left text-[13px]">
                        <thead>
                          <tr className="border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Matricula</th>
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Campo</th>
                            <th className="px-4 py-3">Antes</th>
                            <th className="px-4 py-3">Depois</th>
                            <th className="px-4 py-3">Origem</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Acao</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-900">
                          {paginatedAdjustmentHistory.map((entry) => {
                            const alunoAtual = alunosById.get(entry.alunoId);
                            const reversible = canRevertAdjustment(entry, alunoAtual);

                            return (
                              <tr key={entry.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                                  {new Date(entry.appliedAt).toLocaleString("pt-BR")}
                                </td>
                                <td className="px-4 py-3 font-medium">{entry.matricula || "---"}</td>
                                <td className="max-w-[220px] truncate px-4 py-3">{entry.nome || "---"}</td>
                                <td className="px-4 py-3 font-medium capitalize">{getFieldDisplayName(entry.field)}</td>
                                <td className="max-w-[220px] truncate px-4 py-3 text-slate-500" title={entry.before}>
                                  {entry.before || "---"}
                                </td>
                                <td className="max-w-[220px] truncate px-4 py-3 font-medium" title={entry.after}>
                                  {entry.after || "---"}
                                </td>
                                <td className="px-4 py-3 text-slate-500">{adjustmentSourceLabel[entry.source]}</td>
                                <td className="px-4 py-3">
                                  {entry.revertedAt ? (
                                    <StatusPill label="Revertido" tone="slate" />
                                  ) : reversible ? (
                                    <StatusPill label="Reversivel" tone="emerald" />
                                  ) : (
                                    <StatusPill label="Bloqueado" tone="amber" />
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => onRevertAdjustment(entry)}
                                    disabled={!reversible}
                                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                                      reversible
                                        ? "bg-slate-900 text-white hover:bg-slate-800"
                                        : "cursor-not-allowed bg-slate-100 text-slate-400"
                                    }`}
                                  >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Reverter
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <Pagination
                      currentPage={historyCurrentPage}
                      totalPages={totalHistoryPages}
                      onPageChange={onHistoryPageChange}
                      pageSize={historyPageSize}
                      onPageSizeChange={onHistoryPageSizeChange}
                      totalItems={adjustmentHistory.length}
                    />
                  </>
                )}
              </ReportTableShell>

              {exportReport && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <ReportStatCard label="Tipo Exportado" value={exportReport.exportFlag} />
                  <ReportStatCard label="Total Exportado" value={exportReport.totalAlunos} />
                  <ReportStatCard label="Registros com Pendencia" value={exportReport.pendingRecords} />
                  <ReportStatCard label="Campos com Pendencia" value={exportReport.pendingFields} />
                </div>
              )}

              {exportReport && (
                <ReportTableShell
                  title="Pendencias no Momento da Exportacao"
                  subtitle={`Gerado em ${new Date(exportReport.generatedAt).toLocaleString("pt-BR")}`}
                  total={reportIssues.length}
                >
                  {reportIssues.length === 0 ? (
                    <div className="px-6 py-12 text-center text-[13px] text-slate-500">
                      Nenhuma pendencia encontrada no momento da exportacao.
                    </div>
                  ) : (
                    <>
                      <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                          <thead>
                            <tr className="border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                              <th className="px-4 py-3">Matricula</th>
                              <th className="px-4 py-3">Nome</th>
                              <th className="px-4 py-3">Campo</th>
                              <th className="px-4 py-3">Severidade</th>
                              <th className="px-4 py-3">Mensagem</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-900">
                            {paginatedReportIssues.map((issue, index) => (
                              <tr
                                key={`${issue.alunoId}-${issue.field}-${index}`}
                                className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                              >
                                <td className="px-4 py-3 font-medium">{issue.matricula || "---"}</td>
                                <td className="max-w-[260px] truncate px-4 py-3">{issue.nome || "---"}</td>
                                <td className="px-4 py-3 font-medium capitalize">{getFieldDisplayName(issue.field)}</td>
                                <td className="px-4 py-3">
                                  <StatusPill
                                    label={issue.severity === "error" ? "Pendencia" : "Aviso"}
                                    tone={issue.severity === "error" ? "amber" : "blue"}
                                  />
                                </td>
                                <td className="min-w-[260px] px-4 py-3 text-slate-500">{issue.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <Pagination
                        currentPage={issuesCurrentPage}
                        totalPages={totalIssuePages}
                        onPageChange={onIssuesPageChange}
                        pageSize={issuesPageSize}
                        onPageSizeChange={onIssuesPageSizeChange}
                        totalItems={reportIssues.length}
                      />
                    </>
                  )}
                </ReportTableShell>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
});

function ReportStatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="surface-card p-5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-slate-900">
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </p>
    </div>
  );
}

function ReportTableShell({
  title,
  subtitle,
  total,
  children,
}: {
  title: string;
  subtitle: string;
  total: number;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4">
        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-900">{title}</h3>
          <p className="mt-0.5 text-[12px] text-slate-500">{subtitle}</p>
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
          {total.toLocaleString("pt-BR")} itens
        </span>
      </div>
      {children}
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "emerald" | "amber" | "slate" | "blue";
}) {
  const className =
    tone === "emerald"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "border-amber-100 bg-amber-50 text-amber-700"
        : tone === "blue"
          ? "border-blue-100 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-100 text-slate-600";

  return <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-medium ${className}`}>{label}</span>;
}
