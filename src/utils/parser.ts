import { Aluno } from "../types/Aluno";
import { layout, TOTAL_LENGTH } from "./layout";
import { fixEncoding, onlyDigits } from "./stringUtils";

const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
const latin1Decoder = new TextDecoder("iso-8859-1");

function decodeImportBuffer(buffer: ArrayBuffer): string {
  try {
    // Prefer UTF-8 because the real-world files often contain accented
    // characters and keep the visual column layout when decoded correctly.
    return utf8Decoder.decode(buffer);
  } catch {
    // Fall back to a 1-byte decoder for legacy files that are not valid UTF-8.
    return latin1Decoder.decode(buffer);
  }
}

function getFieldSlice(linha: string, field: keyof typeof layout): string {
  return linha.substring(layout[field].start, layout[field].end);
}

function normalizeDigitsIfExact(value: string, expectedLength: number): string {
  const digits = onlyDigits(value);
  return digits.length === expectedLength ? digits : value.trim();
}

function recoverCep(linha: string): string {
  const start = layout.cep.start;
  const end = layout.cep.end;
  const directValue = getFieldSlice(linha, "cep");
  const directDigits = onlyDigits(directValue);

  if (directDigits.length === 8) {
    return directDigits;
  }

  // Small column shifts are common in dirty source files. Check nearby slices
  // before giving up and asking the user to correct the value manually.
  const shifts = [1, -1, 2, -2, 3, -3, 4, -4];
  for (const shift of shifts) {
    const shiftedStart = start + shift;
    const shiftedEnd = end + shift;
    if (shiftedStart < 0 || shiftedEnd > linha.length) continue;

    const shiftedDigits = onlyDigits(linha.substring(shiftedStart, shiftedEnd));
    if (shiftedDigits.length === 8) {
      return shiftedDigits;
    }
  }

  const windowStart = Math.max(0, start - 4);
  const windowEnd = Math.min(linha.length, end + 4);
  const nearbyWindow = linha.substring(windowStart, windowEnd);

  const maskedMatch = nearbyWindow.match(/\d{5}-\d{3}/);
  if (maskedMatch) {
    return maskedMatch[0].replace(/\D/g, "");
  }

  const plainMatch = nearbyWindow.match(/(?:^|\D)(\d{8})(?!\d)/);
  if (plainMatch?.[1]) {
    return plainMatch[1];
  }

  return directValue.trim();
}

/**
 * Parses a single line into an Aluno record using the visual column layout.
 *
 * The import step already picked the most suitable text decoding for the file,
 * so field extraction can safely use character positions from the layout.
 *
 * Each extracted field still passes through fixEncoding() because some legacy
 * files may arrive with mojibake even after the buffer-level decoding step.
 */
export function parseLinha(linha: string): Aluno {
  const id = crypto.randomUUID();

  const get = (field: keyof typeof layout) => {
    const val = getFieldSlice(linha, field).trim();
    return fixEncoding(val);
  };

  return {
    id,
    ano: normalizeDigitsIfExact(get("ano"), 4),
    codigoEscola: onlyDigits(get("codigoEscola")),
    matricula: get("matricula"),
    codigoSetps: onlyDigits(get("codigoSetps")),
    nome: get("nome"),
    sexo: (linha.substring(layout.sexo.start, layout.sexo.end) || "M") as "M" | "F",
    dataNascimento: get("dataNascimento"),
    nomeMae: get("nomeMae"),
    nomePai: get("nomePai"),
    rg: get("rg"),
    orgaoExpedidor: get("orgaoExpedidor"),
    dataEmissaoRg: get("dataEmissaoRg"),
    cpf: normalizeDigitsIfExact(get("cpf"), 11),
    certidao: normalizeDigitsIfExact(get("certidao"), 7),
    livro: get("livro"),
    folha: get("folha"),
    endereco: get("endereco"),
    numero: get("numero"),
    complemento: get("complemento"),
    bairro: get("bairro"),
    cep: recoverCep(linha),
    telefone: onlyDigits(get("telefone")),
    email: get("email"),
    grau: (get("grau") || "1") as "1" | "2" | "3",
    serie: get("serie"),
    turno: get("turno"),
    flag: (get("flag") || "I") as "I" | "A" | "E",
  };
}

/**
 * Parses the complete file content into an array of Aluno records.
 *
 * Imported files often contain extra trailing characters after the official
 * layout boundary, so any line with at least 525 characters is truncated to
 * the fixed-width layout used by the export routine.
 */
export function parseArquivo(conteudo: string): { alunos: Aluno[], errors: string[] } {
  const linhas = conteudo.split(/\r?\n/);
  const alunos: Aluno[] = [];
  const errors: string[] = [];

  for (let i = 0; i < linhas.length; i++) {
    let linha = linhas[i];
    
    // Skip completely empty lines (often at the end of file)
    if (linha.length === 0) continue;
    
    if (linha.length < 525 && linha.length >= 100) {
      errors.push(`Linha ${i + 1}: Tamanho incorreto (${linha.length} caracteres, esperado mín. 525). Tentando processar.`);
      linha = linha.padEnd(525, " ");
    } else if (linha.length > 600) {
      errors.push(`Linha ${i + 1}: Linha muito longa (${linha.length} caracteres).`);
      linha = linha.substring(0, 525);
    } else if (linha.length >= 525) {
      // Normal case: silently truncate to layout boundary
      linha = linha.substring(0, 525);
    } else if (linha.length < 100) {
      // Skip very short lines that are clearly not student records
      continue;
    }

    try {
      alunos.push(parseLinha(linha));
    } catch (e) {
      errors.push(`Linha ${i + 1}: Erro ao processar dados do aluno.`);
    }
  }

  return { alunos, errors };
}

/**
 * Parses the file from an ArrayBuffer (raw bytes) into an array of Aluno records.
 * 
 * The import path prefers UTF-8 because many real-world files contain accented
 * characters but still keep their field positions in character columns.
 * Legacy single-byte files fall back to ISO-8859-1.
 */
export function parseArquivoFromBuffer(buffer: ArrayBuffer): { alunos: Aluno[], errors: string[] } {
  const conteudo = decodeImportBuffer(buffer);
  return parseArquivo(conteudo);
}
