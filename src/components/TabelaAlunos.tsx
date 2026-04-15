import React, { memo } from "react";
import { Edit, Trash2, AlertTriangle, Wand2 } from "lucide-react";
import { Aluno } from "../types/Aluno";
import { AlunoInsight } from "../types/AlunoInsight";
import { getAlunoAdjustments } from "../utils/adjustments";
import {
  getAdjustmentCallToAction,
  getFieldDisplayName,
  getScopedErrorFields,
} from "../utils/adjustmentPresentation";
import { validateAluno } from "../utils/validator";

interface TabelaAlunosProps {
  alunos: Aluno[];
  insightsById?: Map<string, AlunoInsight>;
  onDelete: (id: string) => void;
  onEdit: (aluno: Aluno) => void;
  onAdjust: (aluno: Aluno, preferredField?: string | null) => void;
  preferredAdjustmentField?: string | null;
}

export const TabelaAlunos: React.FC<TabelaAlunosProps> = memo(
  ({ alunos, insightsById, onDelete, onEdit, onAdjust, preferredAdjustmentField }) => {
    if (alunos.length === 0) {
      return (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-b-lg bg-white px-6 py-12 text-center">
          <AlertTriangle className="mb-4 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-900">Nenhum registro encontrado.</p>
          <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-slate-500">
            Ajuste os filtros ou importe um arquivo para preencher esta tabela.
          </p>
        </div>
      );
    }

    return (
      <div className="custom-scrollbar min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              <th className="sticky top-0 z-10 w-40 bg-slate-50 px-4 py-3">Status</th>
              <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3">Matricula</th>
              <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3">Nome</th>
              <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3">CPF</th>
              <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3">Serie/Turno</th>
              <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 text-right">Acoes</th>
            </tr>
          </thead>

          <tbody className="bg-white text-[12px] text-slate-900">
            {alunos.map((aluno) => {
              const insight = insightsById?.get(aluno.id);
              const errors = insight?.errors ?? validateAluno(aluno);
              const blockingErrors = insight?.blockingErrors ?? errors.filter((error) => error.severity === "error");
              const warnings = insight?.warnings ?? errors.filter((error) => error.severity === "warning");
              const adjustments = insight?.adjustments ?? getAlunoAdjustments(aluno);
              const adjustmentAction = getAdjustmentCallToAction(adjustments, errors, preferredAdjustmentField);
              const pendingFields = getScopedErrorFields(errors);
              const pendingSummary = buildPendingSummary(pendingFields);

              const primaryError = blockingErrors[0] ?? warnings[0] ?? null;
              const isValid = primaryError === null;
              const badgeLabel = isValid
                ? "Valido"
                : `${pendingFields.length} pendencia${pendingFields.length > 1 ? "s" : ""}`;
              const badgeClass = isValid
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-amber-100 bg-amber-50 text-amber-700";
              const dotClass = isValid ? "bg-emerald-500" : "bg-amber-500";
              const issuesTooltip = errors.map((error) => error.message).join("\n");
              const ActionIcon = adjustmentAction.mode === "manual" ? AlertTriangle : Wand2;
              const actionClass =
                adjustmentAction.mode === "none"
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : adjustmentAction.mode === "manual"
                    ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";

              return (
                <tr key={aluno.id} className="group border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeClass}`}
                        title={issuesTooltip || "Registro valido"}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                        {badgeLabel}
                      </span>

                      {!isValid && pendingSummary && (
                        <p
                          className="max-w-[170px] text-[10px] leading-[1.15rem] text-slate-500"
                          title={pendingFields.map(getFieldDisplayName).join(", ")}
                        >
                          {pendingSummary}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{aluno.matricula || "---"}</td>
                  <td className="max-w-[320px] truncate px-4 py-3 text-slate-950">{aluno.nome || "---"}</td>
                  <td className="px-4 py-3 text-slate-500">{aluno.cpf || "---"}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {aluno.serie || "---"} / {aluno.turno || "---"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => onAdjust(aluno, preferredAdjustmentField)}
                        disabled={adjustmentAction.mode === "none"}
                        className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[10px] font-medium transition-colors duration-150 ${actionClass}`}
                        title={adjustmentAction.title}
                      >
                        <ActionIcon className="h-3 w-3" />
                        {adjustmentAction.label}
                      </button>

                      <button
                        onClick={() => onEdit(aluno)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDelete(aluno.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
);

function toTitleCase(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildPendingSummary(fields: string[]) {
  if (fields.length === 0) {
    return "";
  }

  const labels = fields.map((field) => toTitleCase(getFieldDisplayName(field)));
  const visibleLabels = labels.slice(0, 2);
  const hiddenCount = labels.length - visibleLabels.length;

  if (hiddenCount <= 0) {
    return visibleLabels.join(", ");
  }

  return `${visibleLabels.join(", ")} e +${hiddenCount}`;
}
