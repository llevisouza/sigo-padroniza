import { motion } from "motion/react";
import { Info } from "lucide-react";
import { Upload } from "./Upload";
import { AppStats } from "../types/AppUi";
import { Aluno } from "../types/Aluno";

type DashboardSidebarProps = {
  stats: AppStats;
  onUpload: (alunos: Aluno[], errors: string[]) => void;
  onUploadError: (message: string) => void;
};

export function DashboardSidebar({ stats, onUpload, onUploadError }: DashboardSidebarProps) {
  return (
    <div className="space-y-6 lg:col-span-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Importar Dados</h2>
        <Upload onUpload={onUpload} onError={onUploadError} />

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start">
            <Info className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
            <p className="text-xs leading-relaxed text-blue-700">
              Suporte para listas grandes. A validacao continua sendo feita localmente no navegador.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Central de Ajuda</h2>
        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
          <p>1. Importe um ou mais arquivos `.txt` da escola.</p>
          <p>2. Revise as pendencias na tabela principal.</p>
          <p>3. Use `Ajustar` ou `Ajustar Todos` quando fizer sentido para o usuario.</p>
          <p>4. Exporte somente quando estiver satisfeito com as correcoes visiveis.</p>
          <p>5. Consulte a guia `Relatorio` para historico e pendencias da ultima exportacao.</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Estatisticas</h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Total de Alunos</p>
            <p className="text-2xl font-black text-slate-900">{stats.total.toLocaleString("pt-BR")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="text-xs font-bold uppercase text-green-600">Validos</p>
              <p className="text-xl font-black text-green-700">{stats.valid.toLocaleString("pt-BR")}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase text-amber-600">Com Pendencias</p>
              <p className="text-xl font-black text-amber-700">{stats.invalid.toLocaleString("pt-BR")}</p>
            </div>
          </div>
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-bold uppercase text-teal-700">Ajustes Sugeridos</p>
            <p className="text-xl font-black text-teal-800">{stats.adjustableFields.toLocaleString("pt-BR")}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
