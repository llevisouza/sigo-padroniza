import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { AppStats, FilterMode } from "../types/AppUi";
import { getFieldDisplayName } from "../utils/adjustmentPresentation";

type ValidationBannerProps = {
  visible: boolean;
  stats: AppStats;
  filterMode: FilterMode;
  errorFieldFilter: string | null;
  onApplyFilter: (mode: FilterMode, field?: string | null) => void;
  onClearErrorFieldFilter: () => void;
};

const operationFilters: Array<{ label: string; mode: FilterMode }> = [
  { label: "Todos os Registros", mode: "all" },
  { label: "Inclusao (I)", mode: "I" },
  { label: "Alteracao (A)", mode: "A" },
  { label: "Exclusao (E)", mode: "E" },
];

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

  const hasPendencies = !stats.isAllValid;
  const title = hasPendencies
    ? `Exportacao liberada com ${stats.invalid.toLocaleString("pt-BR")} pendencias`
    : "Pronto para exportacao";
  const description = hasPendencies
    ? stats.adjustableRecords > 0
      ? "Use os ajustes automaticos quando houver e revise manualmente os demais campos antes de exportar."
      : "Nao ha ajuste automatico disponivel para esta base. As pendencias atuais exigem revisao manual."
    : "Todos os campos obrigatorios foram preenchidos corretamente.";

  return (
    <section className="grid shrink-0 gap-3 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)] xl:items-start">
      <div className="surface-card border-slate-200 p-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              hasPendencies ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {hasPendencies ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
          </div>

          <div className="min-w-0">
            <h3 className="mb-1 text-[15px] font-semibold text-slate-950">
              {title}
            </h3>
            <p className="text-[12px] leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="surface-card p-4">
        <div className="mb-3">
          <p className="section-kicker mb-2">Exibir</p>
          <div className="flex flex-wrap gap-2">
            {operationFilters.map((option) => {
              const selected = filterMode === option.mode;

              return (
                <button
                  key={option.mode}
                  onClick={() => onApplyFilter(option.mode)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 ${
                    selected
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}

            <button
              onClick={() => onApplyFilter("invalid")}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 ${
                filterMode === "invalid" && !errorFieldFilter
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-amber-200 bg-white text-amber-700 hover:bg-amber-50"
              }`}
            >
              Pendencias ({stats.invalid.toLocaleString("pt-BR")})
            </button>
          </div>
        </div>

        {stats.topErrors.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="section-kicker">Filtrar por campo com pendencia</p>
              {errorFieldFilter && (
                <button
                  onClick={onClearErrorFieldFilter}
                  className="text-[11px] font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Limpar filtro
                </button>
              )}
            </div>

            <div className="custom-scrollbar max-h-24 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                {stats.topErrors.map(([field, count]) => {
                  const selected = errorFieldFilter === field;
                  return (
                    <button
                      key={field}
                      onClick={() => onApplyFilter("invalid", field)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 ${
                        selected
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <span className="capitalize">{getFieldDisplayName(field)}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                          selected ? "bg-blue-100 text-blue-700" : "bg-white text-slate-500"
                        }`}
                      >
                        {count.toLocaleString("pt-BR")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
