import assert from "node:assert/strict";
import test from "node:test";
import { paginateItems } from "../src/utils/pagination";
import { ExportIssue } from "../src/utils/exportPreparation";

function createIssue(index: number): ExportIssue {
  return {
    alunoId: `aluno-${index}`,
    matricula: `${index}`.padStart(6, "0"),
    nome: `ALUNO ${index}`,
    field: "cep",
    message: "CEP deve ter 8 digitos numericos",
    severity: "warning",
  };
}

test("paginacao do relatorio recorta a pagina correta", () => {
  const issues = Array.from({ length: 52 }, (_, index) => createIssue(index + 1));
  const page = paginateItems(issues, 3, 25);

  assert.equal(page.totalPages, 3);
  assert.equal(page.items.length, 2);
  assert.equal(page.items[0].alunoId, "aluno-51");
  assert.equal(page.startIndex, 51);
  assert.equal(page.endIndex, 52);
});

test("paginacao do relatorio limita pagina fora do intervalo", () => {
  const issues = Array.from({ length: 5 }, (_, index) => createIssue(index + 1));
  const page = paginateItems(issues, 99, 10);
  const empty = paginateItems([], 4, 25);

  assert.equal(page.currentPage, 1);
  assert.equal(page.totalPages, 1);
  assert.equal(empty.currentPage, 1);
  assert.equal(empty.totalPages, 1);
  assert.equal(empty.items.length, 0);
});
