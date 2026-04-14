import type { AlunoAdjustment } from "../utils/adjustments";
import type { ValidationError } from "../utils/validator";

export type AlunoInsight = {
  adjustments: AlunoAdjustment[];
  errors: ValidationError[];
  blockingErrors: ValidationError[];
  warnings: ValidationError[];
};
