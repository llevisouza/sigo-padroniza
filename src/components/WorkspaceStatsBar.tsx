import { AppStats } from "../types/AppUi";

type WorkspaceStatsBarProps = {
  stats: AppStats;
};

const statCards = [
  {
    key: "total",
    label: "Total de Alunos",
    tone: "slate",
  },
  {
    key: "valid",
    label: "Validos",
    tone: "emerald",
  },
  {
    key: "invalid",
    label: "Pendencias",
    tone: "amber",
  },
  {
    key: "adjustableFields",
    label: "Ajustes Automaticos",
    tone: "blue",
  },
] as const;

export function WorkspaceStatsBar({ stats }: WorkspaceStatsBarProps) {
  const values = {
    total: stats.total,
    valid: stats.valid,
    invalid: stats.invalid,
    adjustableFields: stats.adjustableFields,
  } as const;

  return (
    <section className="grid shrink-0 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={values[card.key].toLocaleString("pt-BR")}
          tone={card.tone}
        />
      ))}
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  tone: "slate" | "emerald" | "amber" | "blue";
};

function StatCard({ label, value, tone }: StatCardProps) {
  const dotClass =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "amber"
        ? "bg-amber-500"
        : tone === "blue"
          ? "bg-blue-500"
          : "bg-slate-400";
  const valueClass =
    tone === "emerald"
      ? "text-emerald-700"
      : tone === "amber"
        ? "text-amber-700"
        : tone === "blue"
          ? "text-blue-700"
          : "text-slate-950";

  return (
    <div className="surface-card px-4 py-3.5">
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">{label}</p>
      </div>
      <p className={`text-[1.85rem] font-bold tracking-tight ${valueClass}`}>{value}</p>
    </div>
  );
}
