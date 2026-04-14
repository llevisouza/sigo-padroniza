import { motion } from "motion/react";
import { X } from "lucide-react";
import { ExportFlag } from "../utils/exportPreparation";

const exportOptions: Array<{ flag: ExportFlag; title: string; description: string }> = [
  { flag: "I", title: "Inclusao", description: "Para enviar alunos matriculados e frequentes." },
  { flag: "A", title: "Alteracao", description: "Para atualizar dados cadastrais existentes." },
  { flag: "E", title: "Exclusao", description: "Para alunos que nao devem mais constar no beneficio." },
];

type ExportModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (flag: ExportFlag) => void;
};

export function ExportModal({ open, onClose, onConfirm }: ExportModalProps) {
  if (!open) {
    return null;
  }

  return (
    <motion.div
      key="export-type-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-xl font-black text-slate-900">Escolha o tipo de exportacao</h3>
            <p className="text-sm text-slate-500">O tipo escolhido sera aplicado em todo o arquivo gerado.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          {exportOptions.map((option) => (
            <button
              key={option.flag}
              onClick={() => onConfirm(option.flag)}
              className="rounded-2xl border border-slate-200 p-5 text-left transition-all hover:border-blue-400 hover:bg-blue-50"
            >
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Tipo {option.flag}</p>
              <h4 className="mb-2 text-lg font-black text-slate-900">{option.title}</h4>
              <p className="text-sm leading-relaxed text-slate-500">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
