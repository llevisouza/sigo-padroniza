import assert from "node:assert/strict";
import { gerarConteudoTXT } from "../src/utils/generator.ts";
import { parseArquivo } from "../src/utils/parser.ts";
import { Aluno } from "../src/types/Aluno.ts";

const aluno: Aluno = {
  id: "roundtrip-check",
  ano: "2026",
  codigoEscola: "12345",
  matricula: "ABC123",
  codigoSetps: "987",
  nome: "JOAO TESTE",
  sexo: "M",
  dataNascimento: "01/01/2010",
  nomeMae: "MARIA TESTE",
  nomePai: "JOSE TESTE",
  rg: "123456",
  orgaoExpedidor: "SSP",
  dataEmissaoRg: "02/02/2020",
  cpf: "12345678901",
  certidao: "1234567",
  livro: "1",
  folha: "2",
  endereco: "RUA A",
  numero: "10",
  complemento: "CASA",
  bairro: "CENTRO",
  cep: "12345678",
  telefone: "71999999999",
  email: "teste@example.com",
  grau: "1",
  serie: "01",
  turno: "M",
  flag: "I",
};

const conteudo = gerarConteudoTXT([aluno]);
assert.equal(conteudo.length, 525, "A exportacao deve gerar 525 colunas por registro");

const { alunos, errors } = parseArquivo(conteudo);
assert.equal(errors.length, 0, "O parser nao deve gerar erros para o conteudo exportado");
assert.equal(alunos.length, 1, "O parser deve reimportar o registro exportado");

const reimportado = alunos[0];

assert.equal(reimportado.ano, aluno.ano);
assert.equal(reimportado.codigoEscola, aluno.codigoEscola);
assert.equal(reimportado.matricula, aluno.matricula);
assert.equal(reimportado.nome, aluno.nome);
assert.equal(reimportado.nomeMae, aluno.nomeMae);
assert.equal(reimportado.cpf, aluno.cpf);
assert.equal(reimportado.cep, aluno.cep);
assert.equal(reimportado.email, aluno.email);
assert.equal(reimportado.flag, aluno.flag);

console.log("Roundtrip exportacao -> parser validado com sucesso.");
