import { Aluno } from "../types/Aluno";
import { onlyDigits } from "./stringUtils";
import { ExportFlag } from "./exportPreparation";

const DOWNLOAD_CLEANUP_DELAY_MS = 1000;

function pad(valor: string | undefined, tamanho: number): string {
  const s = (valor || "").slice(0, tamanho);
  return s.padEnd(tamanho, " ");
}

export function gerarLinha(a: Aluno): string {
  const linha = (
    pad(a.ano, 4) +
    pad(a.codigoEscola, 10) +
    pad(a.matricula, 10) +
    pad(a.codigoSetps, 10) +
    pad(a.nome, 90) +
    pad(a.sexo, 1) +
    pad(a.dataNascimento, 10) +
    pad(a.nomeMae, 60) +
    pad(a.nomePai, 60) +
    pad(a.rg, 14) +
    pad(a.orgaoExpedidor, 6) +
    pad(a.dataEmissaoRg, 10) +
    pad(a.cpf, 11) +
    pad(a.certidao, 7) +
    pad(a.livro, 4) +
    pad(a.folha, 5) +
    pad(a.endereco, 50) +
    pad(a.numero, 10) +
    pad(a.complemento, 30) +
    pad(a.bairro, 30) +
    pad("", 35) +
    pad(a.cep, 8) +
    pad(a.telefone, 15) +
    pad(a.email, 30) +
    pad(a.grau, 1) +
    pad(a.serie, 2) +
    pad(a.turno, 1) +
    pad(a.flag, 1)
  );

  if (linha.length !== 525) {
    console.error(`Erro critico: linha gerada com ${linha.length} caracteres. Ajustando para 525.`);
    return linha.padEnd(525, " ").slice(0, 525);
  }

  return linha;
}

export function gerarConteudoTXT(alunos: Aluno[], exportFlag?: ExportFlag): string {
  return alunos
    .map((aluno) =>
      gerarLinha({
        ...aluno,
        flag: exportFlag || aluno.flag,
      })
    )
    .join("\r\n");
}

export function exportarTXT(alunos: Aluno[], exportFlag?: ExportFlag) {
  const conteudo = gerarConteudoTXT(alunos, exportFlag);
  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const first = alunos[0];
  const escolaRaw = onlyDigits(first?.codigoEscola) || "0";
  const escola = escolaRaw.padStart(5, "0").slice(0, 5);
  const flag = exportFlag || first?.flag || "I";

  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear().toString();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const dateStr = `${day}${month}${year}`;
  const timeStr = `${hours}${minutes}${seconds}`;
  const filename = `${escola}_${dateStr}${timeStr}${flag}.txt`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  window.setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, DOWNLOAD_CLEANUP_DELAY_MS);
}
