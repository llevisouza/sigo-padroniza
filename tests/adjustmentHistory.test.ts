import assert from "node:assert/strict";
import test from "node:test";
import { createAluno } from "./helpers/sampleAluno";
import {
  buildAdjustmentHistoryEntries,
  canRevertAdjustment,
  getAdjustmentHistoryStats,
} from "../src/utils/adjustmentHistory";

test("historico registra ajustes com origem e estatisticas coerentes", () => {
  const aluno = createAluno();
  const entries = buildAdjustmentHistoryEntries(
    aluno,
    [
      {
        field: "nome",
        before: "José",
        after: "JOSE",
        reason: "Remover acentos",
      },
      {
        field: "cep",
        before: "41925-157",
        after: "41925157",
        reason: "Remover mascara do CEP",
      },
    ],
    "lote"
  );

  const revertedEntries = [{ ...entries[0], revertedAt: "2026-04-14T12:00:00.000Z" }, entries[1]];
  const stats = getAdjustmentHistoryStats(revertedEntries);

  assert.equal(entries.length, 2);
  assert(entries.every((entry) => entry.source === "lote"));
  assert.equal(stats.total, 2);
  assert.equal(stats.reverted, 1);
  assert.equal(stats.adjustedRecords, 1);
  assert.equal(stats.open, 1);
});

test("historico so permite reversao quando o valor atual ainda bate com o ajuste", () => {
  const aluno = createAluno({ nome: "JOSE" });
  const [entry] = buildAdjustmentHistoryEntries(
    { ...aluno, nome: "José" },
    [{ field: "nome", before: "José", after: "JOSE", reason: "Remover acentos" }],
    "registro"
  );

  assert.equal(canRevertAdjustment(entry, aluno), true);
  assert.equal(canRevertAdjustment(entry, { ...aluno, nome: "JOAO" }), false);
  assert.equal(canRevertAdjustment({ ...entry, revertedAt: "2026-04-14T12:00:00.000Z" }, aluno), false);
});
