import assert from "node:assert/strict";
import test from "node:test";
import type { AlunoAdjustment } from "../src/utils/adjustments";
import type { ValidationError } from "../src/utils/validator";
import {
  getAdjustmentCallToAction,
  getBatchAdjustmentLabel,
  getScopedAdjustments,
  getScopedErrorFields,
} from "../src/utils/adjustmentPresentation";

test("acao de ajuste fica explicita para o campo filtrado", () => {
  const adjustments: AlunoAdjustment[] = [
    { field: "cep", before: "41925-157", after: "41925157", reason: "Remover mascara do CEP" },
    { field: "nome", before: "JosÃƒÂ©", after: "JOSE", reason: "Remover acentos do nome" },
  ];
  const errors: ValidationError[] = [
    { field: "cep", message: "CEP deve ter 8 digitos numericos", severity: "warning" },
    { field: "nome", message: "Nome precisa ser padronizado", severity: "error" },
  ];

  const scoped = getScopedAdjustments(adjustments, "cep");
  const action = getAdjustmentCallToAction(adjustments, errors, "cep");

  assert.equal(scoped.length, 1);
  assert.equal(scoped[0]?.field, "cep");
  assert.equal(action.label, "Limpar CEP");
  assert.equal(action.title, "Remover mascara do CEP");
});

test("campo filtrado sem ajuste automatico entra em revisao manual", () => {
  const adjustments: AlunoAdjustment[] = [
    { field: "nome", before: "JosÃƒÂ©", after: "JOSE", reason: "Remover acentos do nome" },
  ];
  const errors: ValidationError[] = [{ field: "cpf", message: "CPF invalido", severity: "error" }];
  const scoped = getScopedAdjustments(adjustments, "cpf");
  const action = getAdjustmentCallToAction(adjustments, errors, "cpf");

  assert.equal(scoped.length, 0);
  assert.equal(action.label, "Revisar CPF");
  assert.equal(action.mode, "manual");
});

test("acao contextual preserva pendencias manuais fora do ajuste automatico", () => {
  const adjustments: AlunoAdjustment[] = [
    { field: "nome", before: "JosÃƒÂ©", after: "JOSE", reason: "Remover acentos do nome" },
    { field: "cpf", before: "111.222.333-44", after: "11122233344", reason: "Remover mascara do CPF" },
  ];
  const errors: ValidationError[] = [
    { field: "nome", message: "Nome precisa ser padronizado", severity: "error" },
    { field: "cpf", message: "CPF invalido", severity: "warning" },
    { field: "cep", message: "CEP invalido", severity: "warning" },
  ];

  const action = getAdjustmentCallToAction(adjustments, errors);

  assert.equal(action.label, "Aplicar 2 ajustes auto");
  assert.equal(action.mode, "mixed");
  assert.deepEqual(action.manualFields, ["cep"]);
});

test("lista de campos pendentes preserva todos os campos unicos", () => {
  const errors: ValidationError[] = [
    { field: "cep", message: "CEP invalido", severity: "warning" },
    { field: "cep", message: "CEP ainda invalido", severity: "warning" },
    { field: "bairro", message: "Bairro obrigatorio", severity: "error" },
  ];

  assert.deepEqual(getScopedErrorFields(errors), ["cep", "bairro"]);
});

test("rotulo do lote descreve o contexto atual", () => {
  assert.equal(getBatchAdjustmentLabel("cep", 715, 78957), "Limpar CEP (715)");
  assert.equal(getBatchAdjustmentLabel("cep", 0, 78957), "Revisar CEP");
  assert.equal(getBatchAdjustmentLabel(null, 12, 120), "Aplicar 12 ajustes");
  assert.equal(getBatchAdjustmentLabel(null, 0, 120), "Sem autoajustes");
});
