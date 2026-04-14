import { Download, Search } from "lucide-react";
import { SearchField } from "../types/AppUi";

type AppHeaderProps = {
  alunosCount: number;
  onExport: () => void;
  searchField: SearchField;
  searchTerm: string;
  onSearchFieldChange: (field: SearchField) => void;
  onSearchTermChange: (term: string) => void;
};

export function AppHeader({
  alunosCount,
  onExport,
  searchField,
  searchTerm,
  onSearchFieldChange,
  onSearchTermChange,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <img src="/apple-touch-icon.png" alt="Logo do SIGO" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">SIGO PADRONIZA</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              PADRONIZACAO DO LAYOUT DE DADOS
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 md:flex">
            <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 py-1.5">
              <Search className="mr-2 h-4 w-4 text-slate-400" />
              <select
                value={searchField}
                onChange={(event) => onSearchFieldChange(event.target.value as SearchField)}
                className="cursor-pointer border-none bg-transparent text-[10px] font-black uppercase text-slate-500 outline-none"
              >
                <option value="all">Tudo</option>
                <option value="nome">Nome</option>
                <option value="matricula">Matricula</option>
                <option value="cpf">CPF</option>
                <option value="rg">RG</option>
                <option value="nomeMae">Mae</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-64 border-none bg-transparent px-3 py-1.5 text-sm outline-none"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
            />
          </div>

          <button
            onClick={onExport}
            disabled={alunosCount === 0}
            className={`hidden items-center rounded-xl px-4 py-2 text-sm font-bold shadow-lg transition-all sm:flex ${
              alunosCount > 0
                ? "bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar TXT
          </button>
        </div>
      </div>
    </header>
  );
}
