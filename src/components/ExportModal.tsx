import { useEffect, useMemo, useState } from "react";
import { Download, Hash, PencilLine, X } from "lucide-react";
import { ExportConfig, ExportFlag } from "../types/Export";
import { buildSuggestedExportFileBaseName, sanitizeExportFileBaseName } from "../utils/generator";
import { onlyDigits } from "../utils/stringUtils";

const exportOptions: Array<{ flag: ExportFlag; title: string; description: string }> = [
  { flag: "I", title: "Inclusao", description: "Para enviar alunos matriculados e frequentes." },
  { flag: "A", title: "Alteracao", description: "Para atualizar dados cadastrais existentes." },
  { flag: "E", title: "Exclusao", description: "Para alunos que nao devem mais constar no beneficio." },
];

type ExportModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (config: ExportConfig) => void;
  initialInstitutionCode?: string;
};

export function ExportModal({ open, onClose, onConfirm, initialInstitutionCode = "" }: ExportModalProps) {
  const [exportFlag, setExportFlag] = useState<ExportFlag>("I");
  const [institutionCode, setInstitutionCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setExportFlag("I");
    setInstitutionCode(initialInstitutionCode);
    setFileName("");
    setError(null);
  }, [initialInstitutionCode, open]);

  const suggestedBaseName = useMemo(
    () => buildSuggestedExportFileBaseName(institutionCode, exportFlag),
    [exportFlag, institutionCode]
  );
  const normalizedCustomBaseName = useMemo(() => sanitizeExportFileBaseName(fileName), [fileName]);
  const suggestedFullName = `${normalizedCustomBaseName || suggestedBaseName || "arquivo"}.txt`;

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    const normalizedInstitutionCode = onlyDigits(institutionCode);

    if (!normalizedInstitutionCode) {
      setError("Informe o codigo da instituicao antes de gerar o arquivo.");
      return;
    }

    onConfirm({
      exportFlag,
      institutionCode: normalizedInstitutionCode,
      fileName: normalizedCustomBaseName || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Configurar Exportacao</h3>
              <p className="text-[13px] text-slate-500">Defina o tipo e o codigo da instituicao.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 transition-colors duration-150 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Tipo de Operacao</p>
            <div className="grid grid-cols-3 gap-3">
              {exportOptions.map((option) => {
                const selected = exportFlag === option.flag;

                return (
                  <button
                    key={option.flag}
                    type="button"
                    onClick={() => setExportFlag(option.flag)}
                    className={`rounded-2xl border px-3 py-3 text-center text-[13px] font-medium transition-all duration-150 ${
                      selected
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                    }`}
                    title={option.description}
                  >
                    {option.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              <Hash className="h-3.5 w-3.5" />
              Codigo da Instituicao
            </label>
            <input
              value={institutionCode}
              onChange={(event) => {
                setInstitutionCode(onlyDigits(event.target.value));
                if (error) {
                  setError(null);
                }
              }}
              placeholder="1104693"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-150 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              <PencilLine className="h-3.5 w-3.5" />
              Nome do Arquivo (Opcional)
            </label>
            <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <input
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                placeholder={suggestedBaseName || "1104693_14042026192155I"}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[14px] text-slate-900 outline-none"
              />
              <div className="flex items-center border-l border-slate-200 px-4 text-sm font-semibold text-slate-400">
                .txt
              </div>
            </div>
            <p className="mt-2 text-[12px] text-slate-400">Sugestao: {suggestedFullName}</p>
          </div>

          {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md"
          >
            Gerar Arquivo
          </button>
        </div>
      </div>
    </div>
  );
}
