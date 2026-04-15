import { Aluno } from "../types/Aluno";
import { ExportFlag } from "../types/Export";
import { getAlunoAdjustments } from "./adjustments";
import { ValidationError, validateAluno } from "./validator";

export type ExportIssue = ValidationError & {
  alunoId: string;
  matricula: string;
  nome: string;
};

export type ExportReport = {
  generatedAt: string;
  exportFlag: ExportFlag;
  totalAlunos: number;
  pendingRecords: number;
  pendingFields: number;
  issues: ExportIssue[];
};

export function prepareAlunosForExport(
  alunos: Aluno[],
  exportFlag: ExportFlag
): { alunos: Aluno[]; report: ExportReport } {
  const issues: ExportIssue[] = [];
  const pendingRecordIds = new Set<string>();

  for (const aluno of alunos) {
    const adjustments = getAlunoAdjustments(aluno);
    const validationErrors = validateAluno(aluno, adjustments);

    if (validationErrors.length > 0) {
      pendingRecordIds.add(aluno.id);
    }

    for (const error of validationErrors) {
      issues.push({
        alunoId: aluno.id,
        matricula: aluno.matricula,
        nome: aluno.nome,
        field: error.field,
        message: error.message,
        severity: error.severity,
      });
    }
  }

  return {
    alunos,
    report: {
      generatedAt: new Date().toISOString(),
      exportFlag,
      totalAlunos: alunos.length,
      pendingRecords: pendingRecordIds.size,
      pendingFields: issues.length,
      issues,
    },
  };
}
