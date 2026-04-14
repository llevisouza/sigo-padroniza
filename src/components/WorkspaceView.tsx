import { Info, Plus, RotateCcw, Trash2, Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { TabelaAlunos } from "./TabelaAlunos";
import { Pagination } from "./Pagination";
import { AdjustmentHistoryEntry } from "../types/AdjustmentHistory";
import { TabKey, FilterMode } from "../types/AppUi";
import { ExportReport, ExportIssue } from "../utils/exportPreparation";
import { adjustmentSourceLabel, canRevertAdjustment } from "../utils/adjustmentHistory";
import { Aluno } from "../types/Aluno";
import { AlunoInsight } from "../types/AlunoInsight";

type WorkspaceViewProps = {
  activeTab: TabKey;
  filterMode: FilterMode;
  exportReport: ExportReport | null;
  hasReportContent: boolean;
  alunos: Aluno[];
  filteredAlunos: Aluno[];
  paginatedAlunos: Aluno[];
  insightsById: Map<string, AlunoInsight>;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onTabChange: (tab: TabKey) => void;
  onClearData: () => void;
  onAdjustAll: () => void;
  onAddAluno: () => void;
  onDeleteAluno: (id: string) => void;
  onEditAluno: (aluno: Aluno) => void;
  onAdjustAluno: (aluno: Aluno) => void;
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

export function WorkspaceView({
  activeTab,
  filterMode,
  exportReport,
  hasReportContent,
  alunos,
  filteredAlunos,
  paginatedAlunos,
  insightsById,
  currentPage,
  totalPages,
  pageSize,
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
    <div className="space-y-6 lg:col-span-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[600px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
                <button
                  onClick={() => onTabChange("arquivo")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                    activeTab === "arquivo" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Arquivo
                </button>
                <button
                  onClick={() => onTabChange("relatorio")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                    activeTab === "relatorio" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Relatorio
                </button>
              </div>

              {activeTab === "arquivo" && filterMode === "invalid" && (
                <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">
                  Apenas Pendencias
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={onClearData}
                disabled={alunos.length === 0}
                className={`flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  alunos.length > 0
                    ? "border border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:text-red-600"
                    : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Dados
              </button>

              {activeTab === "arquivo" && (
                <button
                  onClick={onAdjustAll}
                  disabled={statsAdjustableFields === 0}
                  className={`flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                    statsAdjustableFields > 0
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                      : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Ajustar Todos
                </button>
              )}

              {activeTab === "arquivo" && (
                <button
                  onClick={onAddAluno}
                  className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Aluno
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">
                {activeTab === "arquivo"
                  ? filterMode === "invalid"
                    ? "Pagina de Pendencias"
                    : "Registros de Alunos"
                  : "Relatorio"}
              </h2>
              {activeTab === "relatorio" && exportReport && (
                <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">
                  Tipo {exportReport.exportFlag}
                </span>
              )}
            </div>

            {activeTab === "relatorio" && exportReport && (
              <p className="text-sm text-slate-500">
                {exportReport.pendingFields.toLocaleString("pt-BR")} pendencias em{" "}
                {exportReport.pendingRecords.toLocaleString("pt-BR")} registros
              </p>
            )}
          </div>
        </div>

        {activeTab === "arquivo" ? (
          <>
            <div className="flex-1">
              <TabelaAlunos
                alunos={paginatedAlunos}
                insightsById={insightsById}
                onDelete={onDeleteAluno}
                onEdit={onEditAluno}
                onAdjust={onAdjustAluno}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onMainPageChange}
              pageSize={pageSize}
              onPageSizeChange={onMainPageSizeChange}
              totalItems={filteredAlunos.length}
            />
          </>
        ) : (
          <div className="flex-1 space-y-6 bg-slate-50 p-6">
            {!hasReportContent ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 text-center">
                <Info className="mb-4 h-10 w-10 text-slate-300" />
                <h3 className="mb-2 text-lg font-bold text-slate-800">Nenhum relatorio gerado</h3>
                <p className="max-w-md text-sm text-slate-500">
                  Aplique ajustes manuais ou exporte um arquivo para visualizar aqui o historico e o retrato das pendencias.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <ReportStatCard label="Ajustes Aplicados" value={historyStats.total} />
                  <ReportStatCard label="Ajustes Revertidos" value={historyStats.reverted} />
                  <ReportStatCard label="Registros Ajustados" value={historyStats.adjustedRecords} />
                  <ReportStatCard label="Abertos para Reversao" value={historyStats.open} />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Historico de Ajustes</h3>
                      <p className="text-sm text-slate-500">Cada ajuste manual aplicado aparece aqui com opcao de reversao.</p>
                    </div>
                    <span className="text-xs font-bold uppercase text-slate-400">
                      {adjustmentHistory.length.toLocaleString("pt-BR")} itens
                    </span>
                  </div>

                  {adjustmentHistory.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Nenhum ajuste manual foi aplicado ainda.</div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-[11px] uppercase text-slate-600">
                            <tr>
                              <th className="px-4 py-3 text-left">Data</th>
                              <th className="px-4 py-3 text-left">Matricula</th>
                              <th className="px-4 py-3 text-left">Nome</th>
                              <th className="px-4 py-3 text-left">Campo</th>
                              <th className="px-4 py-3 text-left">Antes</th>
                              <th className="px-4 py-3 text-left">Depois</th>
                              <th className="px-4 py-3 text-left">Origem</th>
                              <th className="px-4 py-3 text-left">Status</th>
                              <th className="px-4 py-3 text-left">Acao</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {paginatedAdjustmentHistory.map((entry) => {
                              const alunoAtual = alunosById.get(entry.alunoId);
                              const reversible = canRevertAdjustment(entry, alunoAtual);

                              return (
                                <tr key={entry.id} className="bg-white">
                                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                                    {new Date(entry.appliedAt).toLocaleString("pt-BR")}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-slate-700">{entry.matricula || "---"}</td>
                                  <td className="px-4 py-3 text-slate-800">{entry.nome || "---"}</td>
                                  <td className="px-4 py-3 font-semibold text-slate-700">{entry.field}</td>
                                  <td className="max-w-[220px] truncate px-4 py-3 text-slate-500" title={entry.before}>
                                    {entry.before || "---"}
                                  </td>
                                  <td className="max-w-[220px] truncate px-4 py-3 text-slate-900" title={entry.after}>
                                    {entry.after || "---"}
                                  </td>
                                  <td className="px-4 py-3 text-slate-500">{adjustmentSourceLabel[entry.source]}</td>
                                  <td className="px-4 py-3">
                                    {entry.revertedAt ? (
                                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">
                                        Revertido
                                      </span>
                                    ) : reversible ? (
                                      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                                        Reversivel
                                      </span>
                                    ) : (
                                      <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">
                                        Bloqueado
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <button
                                      onClick={() => onRevertAdjustment(entry)}
                                      disabled={!reversible}
                                      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                        reversible
                                          ? "bg-slate-900 text-white hover:bg-slate-800"
                                          : "cursor-not-allowed bg-slate-100 text-slate-400"
                                      }`}
                                    >
                                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
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
                </div>

                {exportReport && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <ReportStatCard label="Tipo Exportado" value={exportReport.exportFlag} />
                    <ReportStatCard label="Total Exportado" value={exportReport.totalAlunos} />
                    <ReportStatCard label="Registros com Pendencia" value={exportReport.pendingRecords} />
                    <ReportStatCard label="Campos com Pendencia" value={exportReport.pendingFields} />
                  </div>
                )}

                {exportReport && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">
                          Pendencias no Momento da Exportacao
                        </h3>
                        <p className="text-sm text-slate-500">
                          Gerado em {new Date(exportReport.generatedAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase text-slate-400">
                        {reportIssues.length.toLocaleString("pt-BR")} itens
                      </span>
                    </div>

                    {reportIssues.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        Nenhuma pendencia encontrada no momento da exportacao.
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-[11px] uppercase text-slate-600">
                              <tr>
                                <th className="px-4 py-3 text-left">Matricula</th>
                                <th className="px-4 py-3 text-left">Nome</th>
                                <th className="px-4 py-3 text-left">Campo</th>
                                <th className="px-4 py-3 text-left">Severidade</th>
                                <th className="px-4 py-3 text-left">Mensagem</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {paginatedReportIssues.map((issue, index) => (
                                <tr key={`${issue.alunoId}-${issue.field}-${index}`} className="bg-white">
                                  <td className="px-4 py-3 font-mono text-slate-700">{issue.matricula || "---"}</td>
                                  <td className="px-4 py-3 text-slate-800">{issue.nome || "---"}</td>
                                  <td className="px-4 py-3 font-semibold text-slate-700">{issue.field}</td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                                        issue.severity === "error"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {issue.severity}
                                    </span>
                                  </td>
                                  <td className="min-w-[240px] px-4 py-3 text-slate-500">{issue.message}</td>
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
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ReportStatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="text-xl font-black text-slate-900">
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </p>
    </div>
  );
}
