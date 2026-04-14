import assert from "node:assert/strict";
import test from "node:test";
import { createAluno } from "./helpers/sampleAluno";
import { gerarConteudoTXT } from "../src/utils/generator";
import { layout, TOTAL_LENGTH } from "../src/utils/layout";
import { parseArquivo, parseArquivoFromBuffer } from "../src/utils/parser";

test("parser reimporta o layout exportado com 525 colunas", () => {
  const aluno = createAluno({
    nome: "JOSE DE ARIMATEIA",
    nomeMae: "MARIA DE LOURDES",
    email: "joao@example.com",
  });

  const conteudo = gerarConteudoTXT([aluno]);
  assert.equal(conteudo.length, TOTAL_LENGTH);

  const { alunos, errors } = parseArquivo(conteudo);
  assert.equal(errors.length, 0);
  assert.equal(alunos.length, 1);
  assert.equal(alunos[0].matricula, aluno.matricula);
  assert.equal(alunos[0].nome, aluno.nome);
  assert.equal(alunos[0].cep, aluno.cep);
  assert.equal(alunos[0].turno, aluno.turno);
});

test("parser recupera CEP mascarado e preserva UTF-8 valido no buffer", () => {
  const aluno = createAluno({
    nome: "JOSÉ ÁVILA",
    nomeMae: "MARIA ÂNGELA",
    cep: "41925157",
  });

  const linhaBase = gerarConteudoTXT([aluno]);
  const linhaComCepMascarado =
    linhaBase.slice(0, layout.cep.start) + "41925-157" + linhaBase.slice(layout.cep.end);
  const buffer = new TextEncoder().encode(linhaComCepMascarado).buffer;

  const { alunos, errors } = parseArquivoFromBuffer(buffer);
  assert.equal(errors.length, 0);
  assert.equal(alunos.length, 1);
  assert.equal(alunos[0].nome, "JOSÉ ÁVILA");
  assert.equal(alunos[0].nomeMae, "MARIA ÂNGELA");
  assert.equal(alunos[0].cep, "41925157");
});
