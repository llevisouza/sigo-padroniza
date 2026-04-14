import assert from "node:assert/strict";
import test from "node:test";
import { createAluno } from "./helpers/sampleAluno";
import { getAlunoAdjustments } from "../src/utils/adjustments";
import { validateAluno } from "../src/utils/validator";

test("validator aponta obrigatoriedades de documento para maiores de 10 anos", () => {
  const aluno = createAluno({
    rg: "",
    orgaoExpedidor: "",
    dataEmissaoRg: "",
  });

  const errors = validateAluno(aluno);

  assert(errors.some((error) => error.field === "rg" && error.severity === "error"));
});

test("validator transforma ajustes pendentes em mensagens acionaveis", () => {
  const aluno = createAluno({
    nome: "José da Silva",
    nomeMae: "Maria de Fátima",
    cep: "41925-157",
  });

  const adjustments = getAlunoAdjustments(aluno);
  const errors = validateAluno(aluno, adjustments);

  assert(errors.some((error) => error.field === "nome" && error.message.includes("Use o botao Ajustar")));
  assert(errors.some((error) => error.field === "cep" && error.severity === "error"));
});
