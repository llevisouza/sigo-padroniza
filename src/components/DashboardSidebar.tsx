import { Info, ShieldAlert } from "lucide-react";
import { Upload } from "./Upload";
import { Aluno } from "../types/Aluno";

type DashboardSidebarProps = {
  onUpload: (alunos: Aluno[], errors: string[]) => void;
  onUploadError: (message: string) => void;
};

export function DashboardSidebar({ onUpload, onUploadError }: DashboardSidebarProps) {
  return (
    <aside className="custom-scrollbar flex min-h-0 flex-col gap-3 xl:overflow-y-auto xl:pr-1">
      <section className="surface-card p-4">
        <h2 className="section-kicker mb-4">Importar Dados</h2>
        <Upload onUpload={onUpload} onError={onUploadError} />

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <p className="text-[12px] leading-6 text-slate-500">
            O processamento e a validacao acontecem localmente no navegador. O site nao salva a base automaticamente.
          </p>
        </div>
      </section>

      <section className="surface-card p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-slate-950">Privacidade e armazenamento</h2>
            <p className="mt-1 text-[12px] leading-6 text-slate-500">
              Este site nao armazena sua base em servidor, banco externo ou conta de usuario.
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-[12px] leading-6 text-slate-500">
          <p>Arquivos importados e correcoes ficam apenas na sessao atual do navegador.</p>
          <p>Se voce fechar, recarregar ou trocar de dispositivo, o trabalho atual pode ser perdido.</p>
          <p>Para preservar as alteracoes, exporte o TXT e mantenha sua propria copia do arquivo saneado.</p>
        </div>
      </section>

      <section className="surface-card p-4">
        <h2 className="section-kicker mb-4">Central de Ajuda</h2>
        <ol className="space-y-3 text-[12px] leading-6 text-slate-500">
          <li className="flex gap-2.5">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">1</span>
            <span>Importe um ou mais arquivos `.txt` da escola.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">2</span>
            <span>Revise as pendencias na tabela principal.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">3</span>
            <span>Use `Ajustar` somente quando houver uma correcao clara para aplicar.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">4</span>
            <span>Exporte quando a base estiver consistente com as correcoes visiveis e guarde o arquivo gerado.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">5</span>
            <span>Consulte a guia `Relatorio` para historico e pendencias da ultima exportacao.</span>
          </li>
        </ol>
      </section>
    </aside>
  );
}
