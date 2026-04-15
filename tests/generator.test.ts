import assert from "node:assert/strict";
import test from "node:test";
import { buildExportFileName, buildSuggestedExportFileBaseName } from "../src/utils/generator";

test("gerador monta o nome sugerido com codigo da instituicao e tipo", () => {
  const date = new Date(2026, 3, 14, 19, 21, 55);

  assert.equal(buildSuggestedExportFileBaseName("1104693", "I", date), "1104693_14042026192155I");
  assert.equal(
    buildExportFileName({ institutionCode: "1104693", exportFlag: "I" }, date),
    "1104693_14042026192155I.txt"
  );
});

test("gerador respeita nome customizado e sanitiza caracteres invalidos", () => {
  const date = new Date(2026, 3, 14, 19, 21, 55);

  assert.equal(
    buildExportFileName(
      {
        institutionCode: "1104693",
        exportFlag: "A",
        fileName: "arquivo final?:teste.txt",
      },
      date
    ),
    "arquivo_finalteste.txt"
  );
});
