import { Aluno } from "./Aluno";
import { AlunoAdjustment } from "../utils/adjustments";

export type AdjustmentSource = "registro" | "lote" | "formulario";

export type AdjustmentHistoryEntry = AlunoAdjustment & {
  id: string;
  alunoId: string;
  matricula: string;
  nome: string;
  source: AdjustmentSource;
  appliedAt: string;
  revertedAt?: string;
};
