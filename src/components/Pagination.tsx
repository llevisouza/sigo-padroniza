import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) => {
  if (totalPages <= 1 && totalItems <= 10) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 bg-white border-t border-slate-200 gap-4">
      <div className="text-sm text-slate-500">
        Mostrando <span className="font-bold text-slate-900">{(currentPage - 1) * pageSize + 1}</span> a{' '}
        <span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, totalItems)}</span> de{' '}
        <span className="font-bold text-slate-900">{totalItems}</span> registros
      </div>

      <div className="flex items-center space-x-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 por pagina</option>
          <option value={25}>25 por pagina</option>
          <option value={50}>50 por pagina</option>
          <option value={100}>100 por pagina</option>
        </select>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="px-4 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
            Pagina {currentPage} de {totalPages}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
