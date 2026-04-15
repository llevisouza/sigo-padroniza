import type { ValidationError } from "./validator";
import { AlunoAdjustment } from "./adjustments";

const actionLabelByField: Record<string, string> = {
  ano: "Corrigir ano",
  codigoEscola: "Limpar cod. escola",
  matricula: "Padronizar matricula",
  codigoSetps: "Limpar cod. SETPS",
  nome: "Padronizar nome",
  dataNascimento: "Limpar data nasc.",
  nomeMae: "Padronizar nome da mae",
  nomePai: "Padronizar nome do pai",
  rg: "Padronizar RG",
  orgaoExpedidor: "Padronizar orgao",
  dataEmissaoRg: "Limpar emissao RG",
  cpf: "Limpar CPF",
  certidao: "Limpar certidao",
  livro: "Padronizar livro",
  folha: "Padronizar folha",
  endereco: "Padronizar endereco",
  numero: "Padronizar numero",
  complemento: "Padronizar complemento",
  bairro: "Padronizar bairro",
  cep: "Limpar CEP",
  telefone: "Limpar telefone",
  email: "Padronizar e-mail",
  serie: "Corrigir serie",
  turno: "Corrigir turno",
};

const fieldLabelByField: Record<string, string> = {
  ano: "ano",
  codigoEscola: "codigo da escola",
  matricula: "matricula",
  codigoSetps: "codigo SETPS",
  nome: "nome",
  dataNascimento: "data de nascimento",
  nomeMae: "nome da mae",
  nomePai: "nome do pai",
  rg: "RG",
  orgaoExpedidor: "orgao expedidor",
  dataEmissaoRg: "data de emissao do RG",
  cpf: "CPF",
  certidao: "certidao",
  livro: "livro",
  folha: "folha",
  endereco: "endereco",
  numero: "numero",
  complemento: "complemento",
  bairro: "bairro",
  cep: "CEP",
  telefone: "telefone",
  email: "e-mail",
  serie: "serie",
  turno: "turno",
};

export function getFieldDisplayName(field: string | null | undefined): string {
  if (!field) {
    return "registro";
  }

  return fieldLabelByField[field] ?? field;
}

function getCompactFieldActionLabel(field: string | null | undefined): string {
  if (!field) {
    return "Aplicar ajustes";
  }

  return actionLabelByField[field] ?? `Corrigir ${getFieldDisplayName(field)}`;
}

export function getScopedAdjustments(
  adjustments: AlunoAdjustment[],
  preferredField?: string | null
): AlunoAdjustment[] {
  if (!preferredField) {
    return adjustments;
  }

  return adjustments.filter((adjustment) => adjustment.field === preferredField);
}

export function getScopedErrorFields(errors: ValidationError[], preferredField?: string | null): string[] {
  const seenFields = new Set<string>();
  const fields: string[] = [];

  for (const error of errors) {
    const field = String(error.field);

    if (preferredField && field !== preferredField) {
      continue;
    }

    if (seenFields.has(field)) {
      continue;
    }

    seenFields.add(field);
    fields.push(field);
  }

  return fields;
}

export function getAdjustmentCallToAction(
  adjustments: AlunoAdjustment[],
  errors: ValidationError[] = [],
  preferredField?: string | null
) {
  const scopedAdjustments = getScopedAdjustments(adjustments, preferredField);
  const pendingFields = getScopedErrorFields(errors, preferredField);
  const automaticFields = new Set(scopedAdjustments.map((adjustment) => String(adjustment.field)));
  const manualFields = pendingFields.filter((field) => !automaticFields.has(field));

  if (pendingFields.length === 0) {
    return {
      adjustments: scopedAdjustments,
      pendingFields,
      manualFields,
      label: "Sem pendencia",
      title: "Registro padronizado",
      mode: "none" as const,
    };
  }

  if (scopedAdjustments.length === 0) {
    const manualLabel =
      preferredField || pendingFields.length === 1
        ? `Revisar ${getFieldDisplayName(preferredField ?? pendingFields[0])}`
        : `Revisar ${pendingFields.length} pendencias`;

    return {
      adjustments: scopedAdjustments,
      pendingFields,
      manualFields,
      label: manualLabel,
      title:
        preferredField || pendingFields.length === 1
          ? `${getFieldDisplayName(preferredField ?? pendingFields[0])} exige revisao manual`
          : `${pendingFields.length} pendencia(s) exigem revisao manual`,
      mode: "manual" as const,
    };
  }

  if (scopedAdjustments.length === 1) {
    const adjustment = scopedAdjustments[0];
    const titleParts = [adjustment.reason];

    if (manualFields.length > 0) {
      titleParts.push(
        `Pendencias manuais restantes: ${manualFields.map((field) => getFieldDisplayName(field)).join(", ")}`
      );
    }

    return {
      adjustments: scopedAdjustments,
      pendingFields,
      manualFields,
      label: actionLabelByField[adjustment.field] ?? "Aplicar ajuste",
      title: titleParts.join("\n"),
      mode: manualFields.length > 0 ? ("mixed" as const) : ("automatic" as const),
    };
  }

  const titleParts = [scopedAdjustments.map((adjustment) => adjustment.reason).join("\n")];
  if (manualFields.length > 0) {
    titleParts.push(
      `Pendencias manuais restantes: ${manualFields.map((field) => getFieldDisplayName(field)).join(", ")}`
    );
  }

  return {
    adjustments: scopedAdjustments,
    pendingFields,
    manualFields,
    label: `Aplicar ${scopedAdjustments.length} ajustes auto`,
    title: titleParts.join("\n\n"),
    mode: manualFields.length > 0 ? ("mixed" as const) : ("automatic" as const),
  };
}

export function getBatchAdjustmentLabel(
  preferredField: string | null,
  adjustableCount: number,
  filteredCount: number
) {
  if (preferredField) {
    if (adjustableCount === 0) {
      return `Revisar ${getFieldDisplayName(preferredField)}`;
    }

    return `${getCompactFieldActionLabel(preferredField)} (${adjustableCount.toLocaleString("pt-BR")})`;
  }

  if (adjustableCount === 0) {
    return filteredCount > 0 ? "Sem autoajustes" : "Aplicar ajustes";
  }

  return `Aplicar ${adjustableCount.toLocaleString("pt-BR")} ajustes`;
}
