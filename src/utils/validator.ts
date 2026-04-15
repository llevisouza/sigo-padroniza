import { Aluno } from "../types/Aluno";
import { AlunoAdjustment, getAlunoAdjustments } from "./adjustments";
import { isValidCPF, onlyDigits } from "./stringUtils";

export type ValidationError = {
  field: keyof Aluno;
  message: string;
  severity: "error" | "warning";
};

const blockingAdjustmentFields = new Set<keyof Aluno>([
  "ano",
  "codigoEscola",
  "matricula",
  "nome",
  "dataNascimento",
  "nomeMae",
  "endereco",
  "numero",
  "bairro",
  "cep",
  "serie",
  "turno",
]);

const validationCache = new WeakMap<Aluno, ValidationError[]>();

function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);
  const date = new Date(year, month, day);

  if (Number.isNaN(date.getTime())) return null;
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) return null;

  return date;
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function hasFieldMessage(errors: ValidationError[], field: keyof Aluno, message: string): boolean {
  return errors.some((error) => error.field === field && error.message === message);
}

function hasFieldValidation(errors: ValidationError[], field: keyof Aluno): boolean {
  return errors.some((error) => error.field === field);
}

export function validateAluno(
  aluno: Aluno,
  precomputedAdjustments?: AlunoAdjustment[]
): ValidationError[] {
  if (precomputedAdjustments === undefined) {
    const cached = validationCache.get(aluno);
    if (cached !== undefined) {
      return cached;
    }
  }

  const errors: ValidationError[] = [];

  if (!aluno.nome || aluno.nome.trim().length === 0) {
    errors.push({ field: "nome", message: "Nome e obrigatorio", severity: "error" });
  }

  if (!aluno.matricula || aluno.matricula.trim().length === 0) {
    errors.push({ field: "matricula", message: "Matricula e obrigatoria", severity: "error" });
  }

  if (!aluno.codigoEscola || aluno.codigoEscola.trim().length === 0) {
    errors.push({ field: "codigoEscola", message: "Codigo da escola e obrigatorio", severity: "error" });
  }

  if (!aluno.sexo || !["M", "F"].includes(aluno.sexo)) {
    errors.push({ field: "sexo", message: "Sexo e obrigatorio (M ou F)", severity: "error" });
  }

  if (!aluno.dataNascimento || !/^\d{2}\/\d{2}\/\d{4}$/.test(aluno.dataNascimento)) {
    errors.push({
      field: "dataNascimento",
      message: "Data de nascimento invalida. Use o formato DD/MM/YYYY",
      severity: "error",
    });
  }

  if (!aluno.nomeMae || aluno.nomeMae.trim().length === 0) {
    errors.push({ field: "nomeMae", message: "Nome da mae e obrigatorio", severity: "error" });
  }

  if (!aluno.endereco || aluno.endereco.trim().length === 0) {
    errors.push({ field: "endereco", message: "Endereco e obrigatorio", severity: "error" });
  }

  if (!aluno.numero || aluno.numero.trim().length === 0) {
    errors.push({ field: "numero", message: "Numero e obrigatorio", severity: "error" });
  }

  if (!aluno.bairro || aluno.bairro.trim().length === 0) {
    errors.push({ field: "bairro", message: "Bairro e obrigatorio", severity: "error" });
  }

  const birthDate = parseDate(aluno.dataNascimento);
  if (birthDate) {
    const age = calculateAge(birthDate);
    const hasRG = Boolean(aluno.rg && aluno.rg.trim().length > 0);
    const hasCertidao = Boolean(aluno.certidao && aluno.certidao.trim().length > 0);

    if (age >= 10) {
      if (!hasRG) {
        errors.push({ field: "rg", message: "RG e obrigatorio para alunos com 10 anos ou mais", severity: "error" });
      } else {
        if (!aluno.orgaoExpedidor || aluno.orgaoExpedidor.trim().length === 0) {
          errors.push({
            field: "orgaoExpedidor",
            message: "Orgao expedidor e obrigatorio quando o RG e informado",
            severity: "error",
          });
        }

        if (!aluno.dataEmissaoRg || !/^\d{2}\/\d{2}\/\d{4}$/.test(aluno.dataEmissaoRg)) {
          errors.push({
            field: "dataEmissaoRg",
            message: "Data de emissao do RG invalida. Use o formato DD/MM/YYYY",
            severity: "error",
          });
        }
      }
    } else if (!hasRG && !hasCertidao) {
      errors.push({
        field: "certidao",
        message: "Para menores de 10 anos, informe RG ou certidao de nascimento",
        severity: "error",
      });
    }
  }

  if (aluno.cpf && onlyDigits(aluno.cpf).length > 0 && onlyDigits(aluno.cpf).length !== 11) {
    errors.push({ field: "cpf", message: "CPF deve ter exatamente 11 digitos numericos", severity: "error" });
  }

  if (aluno.cpf && onlyDigits(aluno.cpf).length === 11 && !isValidCPF(aluno.cpf)) {
    errors.push({ field: "cpf", message: "CPF invalido", severity: "error" });
  }

  if (!aluno.cep || onlyDigits(aluno.cep).length !== 8) {
    errors.push({ field: "cep", message: "CEP deve ter 8 digitos numericos", severity: "warning" });
  }

  if (!["1", "2", "3"].includes(aluno.grau)) {
    errors.push({ field: "grau", message: "Grau invalido (1, 2 ou 3)", severity: "error" });
  }

  if (!aluno.serie || aluno.serie.trim().length === 0) {
    errors.push({ field: "serie", message: "Serie e obrigatoria", severity: "error" });
  }

  if (!["1", "2", "3", "4", "5", "6", "7"].includes(aluno.turno)) {
    errors.push({ field: "turno", message: "Turno invalido (1 a 7)", severity: "error" });
  }

  if (!["I", "A", "E"].includes(aluno.flag)) {
    errors.push({ field: "flag", message: "Flag invalida (I, A ou E)", severity: "error" });
  }

  const adjustments = precomputedAdjustments ?? getAlunoAdjustments(aluno);
  for (const adjustment of adjustments) {
    if (hasFieldValidation(errors, adjustment.field)) continue;

    const severity = blockingAdjustmentFields.has(adjustment.field) ? "error" : "warning";
    const message = `${adjustment.reason}. Use o botao Ajustar para aplicar.`;

    if (!hasFieldMessage(errors, adjustment.field, message)) {
      errors.push({
        field: adjustment.field,
        message,
        severity,
      });
    }
  }

  if (precomputedAdjustments === undefined) {
    validationCache.set(aluno, errors);
  }

  return errors;
}
