import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { AppStats, FilterMode } from "../types/AppUi";

type ValidationBannerProps = {
  visible: boolean;
  stats: AppStats;
  filterMode: FilterMode;
  errorFieldFilter: string | null;
  onApplyFilter: (mode: FilterMode, field?: string | null) => void;
  onClearErrorFieldFilter: () => void;
};

export function ValidationBanner({
  visible,
  stats,
  filterMode,
  errorFieldFilter,
  onApplyFilter,
  onClearErrorFieldFilter,
}: ValidationBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`mb-8 flex flex-col gap-6 rounded-3xl border p-6 shadow-xl shadow-slate-200/50 ${
        stats.isAllValid ? "border-green-200 bg-white" : "border-amber-200 bg-white"
      }`}
    >
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center">
          {stats.isAllValid ? (
            <div className="mr-4 rounded-2xl bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          ) : (
            <div className="mr-4 rounded-2xl bg-amber-100 p-3">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          )}
          <div>
            <h3 className={`text-lg font-black ${stats.isAllValid ? "text-green-900" : "text-amber-900"}`}>
              {stats.isAllValid ? "Pronto para Exportacao" : `Exportacao Liberada com ${stats.blocking} Pendencias`}
            </h3>
            <p className="text-sm font-medium text-slate-500">
              {stats.isAllValid
                ? "Todos os campos obrigatorios foram preenchidos corretamente."
                : "Use os botoes de ajuste para padronizar os dados antes de exportar."}
            </p>
          </div>
        </div>

        <div className="w-full space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:max-w-3xl">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Exibir</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onApplyFilter("all")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  filterMode === "all"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-300"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Todos os Registros
              </button>
              <button
                onClick={() => onApplyFilter("I")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  filterMode === "I"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "border border-blue-100 bg-white text-blue-600 hover:border-blue-300"
                }`}
              >
                Inclusao (I)
              </button>
              <button
                onClick={() => onApplyFilter("A")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  filterMode === "A"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                    : "border border-purple-100 bg-white text-purple-600 hover:border-purple-300"
                }`}
              >
                Alteracao (A)
              </button>
              <button
                onClick={() => onApplyFilter("E")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  filterMode === "E"
                    ? "bg-red-600 text-white shadow-lg shadow-red-200"
                    : "border border-red-100 bg-white text-red-600 hover:border-red-300"
                }`}
              >
                Exclusao (E)
              </button>
              <button
                onClick={() => onApplyFilter("invalid")}
                className={`flex items-center rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  filterMode === "invalid" && !errorFieldFilter
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-200"
                    : "border border-amber-200 bg-white text-amber-700 hover:border-amber-300"
                }`}
              >
                <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                Pendencias ({stats.invalid})
              </button>
            </div>
          </div>

          {stats.topErrors.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Filtrar por Campo com Pendencia
                </p>
                {errorFieldFilter && (
                  <button
                    onClick={onClearErrorFieldFilter}
                    className="text-[10px] font-bold uppercase text-blue-600 hover:underline"
                  >
                    Limpar Filtro
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.topErrors.slice(0, 8).map(([field, count]) => (
                  <button
                    key={field}
                    onClick={() => onApplyFilter("invalid", field)}
                    className={`group flex items-center rounded-xl border px-4 py-2 transition-all ${
                      errorFieldFilter === field
                        ? "border-blue-600 bg-blue-600 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold capitalize ${
                        errorFieldFilter === field ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {field}
                    </span>
                    <span
                      className={`ml-2.5 rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                        errorFieldFilter === field
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
