import { Download, Search } from "lucide-react";
import { SearchField } from "../types/AppUi";

type AppHeaderProps = {
  alunosCount: number;
  isBusy: boolean;
  onExport: () => void;
  searchField: SearchField;
  searchTerm: string;
  onSearchFieldChange: (field: SearchField) => void;
  onSearchTermChange: (term: string) => void;
};

export function AppHeader({
  alunosCount,
  isBusy,
  onExport,
  searchField,
  searchTerm,
  onSearchFieldChange,
  onSearchTermChange,
}: AppHeaderProps) {
  const logoSrc = `${import.meta.env.BASE_URL}apple-touch-icon.png`;

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-4 px-4 sm:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <img src={logoSrc} alt="Logo do SIGO" className="h-7 w-7 object-contain" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[1.05rem] font-semibold tracking-tight text-slate-950">SIGO PADRONIZA</h1>
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
              Padronizacao do layout de dados
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-4">
          <div className="hidden max-w-xl flex-1 items-center gap-3 lg:flex">
            <div className="flex w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-150 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
              <div className="flex items-center border-r border-slate-200 pl-3 pr-2">
                <Search className="mr-2 h-4 w-4 text-slate-400" />
                <select
                  value={searchField}
                  onChange={(event) => onSearchFieldChange(event.target.value as SearchField)}
                  className="cursor-pointer border-none bg-transparent py-2 pr-6 text-[12px] font-medium uppercase text-slate-500 outline-none"
                >
                  <option value="all">Tudo</option>
                  <option value="nome">Nome</option>
                  <option value="matricula">Matricula</option>
                  <option value="cpf">CPF</option>
                  <option value="rg">RG</option>
                  <option value="nomeMae">Mae</option>
                </select>
              </div>

              <div className="flex min-w-0 flex-1 items-center px-3">
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="w-full border-none bg-transparent py-2 text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(event) => onSearchTermChange(event.target.value)}
                />
              </div>
            </div>

            {isBusy && (
              <div className="hidden items-center gap-2 text-[12px] font-medium text-slate-500 xl:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                Atualizando
              </div>
            )}
          </div>

          <button
            onClick={onExport}
            disabled={alunosCount === 0}
            className={`inline-flex items-center rounded-xl px-4 py-2 text-[13px] font-medium shadow-sm transition-all duration-150 ${
              alunosCount > 0
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
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
