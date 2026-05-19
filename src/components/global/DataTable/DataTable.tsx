import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface PaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  selectedRows?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: () => void;
  emptyMessage?: string;
  limit?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (p: number) => void;
}) => {
  const pages: (number | "...")[] =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : currentPage <= 3
        ? [1, 2, 3, "...", totalPages]
        : currentPage >= totalPages - 2
          ? [1, "...", totalPages - 2, totalPages - 1, totalPages]
          : [1, "...", currentPage, "...", totalPages];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-8 h-8 flex items-center justify-center text-xs text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={`${p}-${i}`}
            onClick={() => onChange(p as number)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
              currentPage === p
                ? "bg-violet-600 text-white shadow-sm"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  isError,
  isFetching,
  pagination,
  onPageChange,
  selectedRows,
  onToggleRow,
  onToggleAll,
  emptyMessage = "No data found.",
  limit = 8,
}: DataTableProps<T>) {
  const allPageSelected =
    data.length > 0 && data.every((r) => selectedRows?.has(r.id));

  const startEntry = pagination ? (pagination.page - 1) * limit + 1 : 0;
  const endEntry = pagination
    ? Math.min(pagination.page * limit, pagination.total)
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-20 text-sm text-red-400">
            Failed to load data. Please try again.
          </div>
        ) : (
          <table className="w-full min-w-max">
            <thead className="bg-white border-b border-slate-200 sticky top-0 z-10">
              <tr>
                {onToggleAll && (
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={onToggleAll}
                      className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-[13px] font-bold text-black whitespace-nowrap ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onToggleAll ? 1 : 0)}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      selectedRows?.has(row.id)
                        ? "bg-violet-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {onToggleRow && (
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedRows?.has(row.id) ?? false}
                          onChange={() => onToggleRow(row.id)}
                          className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3.5 ${col.className ?? ""}`}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Scrollbar hint */}
      <div className="bg-white border-t border-slate-100 h-1.5 overflow-x-auto">
        <div className="min-w-max h-full" />
      </div>

      {/* Footer */}
      {pagination && onPageChange && (
        <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-slate-500">
            {isFetching && !isLoading ? (
              <span className="flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" />
                Updating...
              </span>
            ) : (
              `Showing ${startEntry} to ${endEntry} of ${pagination.total} entries`
            )}
          </p>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
