import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) => {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-3 md:flex-row md:items-center md:justify-between">
      <p className="text-[12px] text-slate-500">
        Mostrando <span className="font-semibold text-slate-900">{start.toLocaleString("pt-BR")}</span> a{" "}
        <span className="font-semibold text-slate-900">{end.toLocaleString("pt-BR")}</span> de{" "}
        <span className="font-semibold text-slate-900">{totalItems.toLocaleString("pt-BR")}</span> registros
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700 shadow-sm outline-none transition-colors duration-150 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        >
          <option value={10}>10 por pagina</option>
          <option value={25}>25 por pagina</option>
          <option value={50}>50 por pagina</option>
          <option value={100}>100 por pagina</option>
        </select>

        <div className="flex items-center gap-1">
          <PaginationButton icon={<ChevronsLeft className="h-4 w-4" />} disabled={currentPage === 1} onClick={() => onPageChange(1)} />
          <PaginationButton
            icon={<ChevronLeft className="h-4 w-4" />}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          />

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 shadow-sm">
            Pagina {currentPage.toLocaleString("pt-BR")} de {totalPages.toLocaleString("pt-BR")}
          </div>

          <PaginationButton
            icon={<ChevronRight className="h-4 w-4" />}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
          <PaginationButton
            icon={<ChevronsRight className="h-4 w-4" />}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        </div>
      </div>
    </div>
  );
};

function PaginationButton({
  icon,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors duration-150 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {icon}
    </button>
  );
}
