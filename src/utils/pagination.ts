export type PaginatedResult<T> = {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
};

export function getTotalPages(totalItems: number, pageSize: number): number {
  const safePageSize = Math.max(1, pageSize);
  return Math.max(1, Math.ceil(totalItems / safePageSize));
}

export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(1, page), Math.max(1, totalPages));
}

export function paginateItems<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = getTotalPages(items.length, safePageSize);
  const currentPage = clampPage(page, totalPages);
  const start = (currentPage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: items.slice(start, end),
    currentPage,
    pageSize: safePageSize,
    totalItems: items.length,
    totalPages,
    startIndex: items.length === 0 ? 0 : start + 1,
    endIndex: Math.min(end, items.length),
  };
}
