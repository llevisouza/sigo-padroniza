import assert from "node:assert/strict";
import test from "node:test";
import { createAluno } from "./helpers/sampleAluno";
import { gerarConteudoTXT } from "../src/utils/generator";
import { layout, TOTAL_LENGTH } from "../src/utils/layout";
import { parseArquivo, parseArquivoFromBuffer } from "../src/utils/parser";
import { validateAluno } from "../src/utils/validator";

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

test("parser recupera CEP mascarado apenas em linha com overflow", () => {
  const aluno = createAluno({
    nome: "JOS\u00c3\u2030 \u00c3\u0081VILA",
    nomeMae: "MARIA \u00c3\u201aNGELA",
    cep: "41925157",
  });

  const linhaBase = gerarConteudoTXT([aluno]);
  const linhaComCepMascarado =
    linhaBase.slice(0, layout.cep.start) + "41925-157" + linhaBase.slice(layout.cep.end);
  const buffer = new TextEncoder().encode(linhaComCepMascarado).buffer;

  const { alunos, errors } = parseArquivoFromBuffer(buffer);
  assert.equal(errors.length, 0);
  assert.equal(alunos.length, 1);
  assert.equal(alunos[0].nome, "JOS\u00c3\u2030 \u00c3\u0081VILA");
  assert.equal(alunos[0].nomeMae, "MARIA \u00c3\u201aNGELA");
  assert.equal(alunos[0].cep, "41925157");
});

test("reimportacao do arquivo exportado nao corrige CEP automaticamente", () => {
  const aluno = createAluno({
    cep: "41925-157",
    telefone: "71999999999",
  });

  const conteudo = gerarConteudoTXT([aluno]);
  const { alunos, errors } = parseArquivo(conteudo);

  assert.equal(errors.length, 0);
  assert.equal(alunos.length, 1);
  assert.equal(alunos[0].cep, "41925-15");
  assert.equal(validateAluno(alunos[0]).some((error) => error.field === "cep"), true);
});
