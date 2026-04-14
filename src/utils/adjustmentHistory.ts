import { Aluno } from "../types/Aluno";
import { AdjustmentHistoryEntry, AdjustmentSource } from "../types/AdjustmentHistory";
import { AlunoAdjustment } from "./adjustments";

export const adjustmentSourceLabel: Record<AdjustmentSource, string> = {
  formulario: "Formulario",
  lote: "Base inteira",
  registro: "Registro",
};

export function canRevertAdjustment(entry: AdjustmentHistoryEntry, aluno?: Aluno): boolean {
  if (!aluno || entry.revertedAt) {
    return false;
  }

  return String(aluno[entry.field] || "") === entry.after;
}

export function getAdjustmentHistoryStats(entries: AdjustmentHistoryEntry[]) {
  const adjustedRecords = new Set<string>();
  let reverted = 0;

  for (const entry of entries) {
    adjustedRecords.add(entry.alunoId);
    if (entry.revertedAt) {
      reverted++;
    }
  }

  return {
    total: entries.length,
    reverted,
    adjustedRecords: adjustedRecords.size,
    open: entries.length - reverted,
  };
}

export function buildAdjustmentHistoryEntries(
  aluno: Aluno,
  adjustments: AlunoAdjustment[],
  source: AdjustmentSource
): AdjustmentHistoryEntry[] {
  const appliedAt = new Date().toISOString();

  return adjustments.map((adjustment) => ({
    ...adjustment,
    id: crypto.randomUUID(),
    alunoId: aluno.id,
    matricula: aluno.matricula,
    nome: aluno.nome,
    source,
    appliedAt,
  }));
}
