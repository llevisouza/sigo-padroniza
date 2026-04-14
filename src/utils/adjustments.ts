import { Aluno } from "../types/Aluno";
import { fixEncoding, normalizeEmail, normalizeString, onlyDigits } from "./stringUtils";

export type AlunoAdjustment = {
  field: keyof Aluno;
  before: string;
  after: string;
  reason: string;
};

const adjustmentCache = new WeakMap<Aluno, AlunoAdjustment[]>();

function registerAdjustment(
  adjustments: AlunoAdjustment[],
  field: keyof Aluno,
  before: string | undefined,
  after: string | undefined,
  reason: string
) {
  const beforeValue = before || "";
  const afterValue = after || "";

  if (beforeValue === afterValue) return;

  adjustments.push({
    field,
    before: beforeValue,
    after: afterValue,
    reason,
  });
}

function normalizeText(value: string | undefined): string {
  return normalizeString(fixEncoding(value));
}

function normalizeNumeric(value: string | undefined, expectedLength?: number): string {
  const digits = onlyDigits(value);

  if (expectedLength !== undefined) {
    return digits.length === expectedLength ? digits : value || "";
  }

  return digits.length > 0 ? digits : value || "";
}

function normalizePhone(value: string | undefined): string {
  const digits = onlyDigits(value);
  return digits.length > 0 && digits.length <= 15 ? digits : value || "";
}

function normalizeMail(value: string | undefined): string {
  return normalizeEmail(fixEncoding(value));
}

function trimValue(value: string | undefined): string {
  return (value || "").trim();
}

export function getAlunoAdjustments(aluno: Aluno): AlunoAdjustment[] {
  const cached = adjustmentCache.get(aluno);
  if (cached !== undefined) {
    return cached;
  }

  const adjustments: AlunoAdjustment[] = [];

  registerAdjustment(adjustments, "ano", aluno.ano, normalizeNumeric(aluno.ano, 4), "Manter o ano apenas com 4 digitos");
  registerAdjustment(adjustments, "codigoEscola", aluno.codigoEscola, normalizeNumeric(aluno.codigoEscola), "Remover mascara do codigo da escola");
  registerAdjustment(adjustments, "matricula", aluno.matricula, normalizeText(aluno.matricula), "Padronizar a matricula sem acentos e caracteres especiais");
  registerAdjustment(adjustments, "codigoSetps", aluno.codigoSetps, normalizeNumeric(aluno.codigoSetps), "Remover mascara do codigo SETPS");
  registerAdjustment(adjustments, "nome", aluno.nome, normalizeText(aluno.nome), "Remover acentos e caracteres especiais do nome");
  registerAdjustment(adjustments, "dataNascimento", aluno.dataNascimento, trimValue(aluno.dataNascimento), "Remover espacos extras da data de nascimento");
  registerAdjustment(adjustments, "nomeMae", aluno.nomeMae, normalizeText(aluno.nomeMae), "Remover acentos e caracteres especiais do nome da mae");
  registerAdjustment(adjustments, "nomePai", aluno.nomePai, normalizeText(aluno.nomePai), "Remover acentos e caracteres especiais do nome do pai");
  registerAdjustment(adjustments, "rg", aluno.rg, normalizeText(aluno.rg), "Padronizar o RG sem acentos e caracteres especiais");
  registerAdjustment(adjustments, "orgaoExpedidor", aluno.orgaoExpedidor, normalizeText(aluno.orgaoExpedidor), "Padronizar o orgao expedidor");
  registerAdjustment(adjustments, "dataEmissaoRg", aluno.dataEmissaoRg, trimValue(aluno.dataEmissaoRg), "Remover espacos extras da data de emissao do RG");
  registerAdjustment(adjustments, "cpf", aluno.cpf, normalizeNumeric(aluno.cpf, 11), "Remover mascara do CPF");
  registerAdjustment(adjustments, "certidao", aluno.certidao, normalizeNumeric(aluno.certidao, 7), "Remover mascara da certidao");
  registerAdjustment(adjustments, "livro", aluno.livro, normalizeText(aluno.livro), "Padronizar o livro sem acentos e caracteres especiais");
  registerAdjustment(adjustments, "folha", aluno.folha, normalizeText(aluno.folha), "Padronizar a folha sem acentos e caracteres especiais");
  registerAdjustment(adjustments, "endereco", aluno.endereco, normalizeText(aluno.endereco), "Remover acentos e caracteres especiais do endereco");
  registerAdjustment(adjustments, "numero", aluno.numero, normalizeText(aluno.numero), "Padronizar o numero sem acentos e caracteres especiais");
  registerAdjustment(adjustments, "complemento", aluno.complemento, normalizeText(aluno.complemento), "Padronizar o complemento sem acentos e caracteres especiais");
  registerAdjustment(adjustments, "bairro", aluno.bairro, normalizeText(aluno.bairro), "Remover acentos e caracteres especiais do bairro");
  registerAdjustment(adjustments, "cep", aluno.cep, normalizeNumeric(aluno.cep, 8), "Remover mascara do CEP");
  registerAdjustment(adjustments, "telefone", aluno.telefone, normalizePhone(aluno.telefone), "Remover mascara do telefone");
  registerAdjustment(adjustments, "email", aluno.email, normalizeMail(aluno.email), "Padronizar o e-mail");
  registerAdjustment(adjustments, "serie", aluno.serie, trimValue(aluno.serie), "Remover espacos extras da serie");
  registerAdjustment(adjustments, "turno", aluno.turno, trimValue(aluno.turno), "Remover espacos extras do turno");

  adjustmentCache.set(aluno, adjustments);
  return adjustments;
}

export function applyAlunoAdjustments(
  aluno: Aluno,
  adjustments: AlunoAdjustment[] = getAlunoAdjustments(aluno)
): Aluno {
  const nextAluno: Aluno = { ...aluno };

  for (const adjustment of adjustments) {
    nextAluno[adjustment.field] = adjustment.after as never;
  }

  return nextAluno;
}
