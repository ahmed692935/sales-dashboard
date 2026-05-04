import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, X, Loader2, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
  id: string;
  label: string;
  sublabel?: string;
  avatar?: string; // initials or image URL
}

export interface PaginationMeta {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedDropdownProps {
  // Trigger display
  value: DropdownOption | null;
  placeholder?: string;
  triggerClassName?: string;

  // Data fetching — consumer owns the query
  onSearch: (search: string, page: number) => void;
  options: DropdownOption[];
  pagination: PaginationMeta | null;
  isLoading: boolean;

  // Selection
  onSelect: (option: DropdownOption | null) => void;
  clearable?: boolean;

  // Appearance
  align?: "left" | "right";
  width?: string; // tailwind class e.g. "w-56"
  disabled?: boolean;
}

// ─── Avatar helper ────────────────────────────────────────────────────────────

const Avatar = ({
  value,
  size = "sm",
}: {
  value: string;
  size?: "sm" | "xs";
}) => {
  const isUrl = value.startsWith("http");
  const dim = size === "sm" ? "w-6 h-6 text-[11px]" : "w-5 h-5 text-[10px]";
  return isUrl ? (
    <img src={value} className={`${dim} rounded-full object-cover shrink-0`} />
  ) : (
    <div
      className={`${dim} rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 shrink-0`}
    >
      {value.charAt(0).toUpperCase()}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const PaginatedDropdown = ({
  value,
  placeholder = "Select...",
  triggerClassName,
  onSearch,
  options,
  pagination,
  isLoading,
  onSelect,
  clearable = true,
  align = "right",
  width = "w-56",
  disabled = false,
}: PaginatedDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  // Notify parent when search or page changes
  useEffect(() => {
    if (open) onSearch(search, page);
  }, [search, page, open]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleToggle = () => {
    if (disabled) return;
    if (!open) {
      setSearch("");
      setPage(1);
    }
    setOpen((v) => !v);
  };

  const handleSelect = useCallback(
    (option: DropdownOption) => {
      onSelect(option.id === value?.id ? null : option);
      setOpen(false);
    },
    [onSelect, value],
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={
          triggerClassName ??
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {value ? (
          <>
            {value.avatar && <Avatar value={value.avatar} size="xs" />}
            <span className="text-violet-600 font-semibold truncate max-w-25">
              {value.label}
            </span>
            {clearable && (
              <X
                size={11}
                className="text-slate-400 hover:text-red-400 shrink-0"
                onClick={handleClear}
              />
            )}
          </>
        ) : (
          <>
            <span>{placeholder}</span>
            <ChevronDown size={11} className="shrink-0" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute top-full mt-1.5 ${alignClass} ${width} bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden`}
        >
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-2.5 py-1.5">
              <Search size={12} className="text-slate-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none min-w-0"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X
                    size={11}
                    className="text-slate-400 hover:text-slate-600"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="max-h-48 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-5">
                <Loader2 size={14} className="animate-spin text-slate-400" />
              </div>
            ) : options.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-5">
                No results found
              </p>
            ) : (
              options.map((option) => {
                const isSelected = value?.id === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-slate-50 ${
                      isSelected ? "text-violet-600" : "text-slate-700"
                    }`}
                  >
                    {option.avatar && <Avatar value={option.avatar} />}
                    <div className="flex-1 min-w-0 text-left">
                      <p
                        className={`truncate ${isSelected ? "font-semibold" : ""}`}
                      >
                        {option.label}
                      </p>
                      {option.sublabel && (
                        <p className="text-[10px] text-slate-400 truncate">
                          {option.sublabel}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Check size={12} className="shrink-0 text-violet-600" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="text-[11px] text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-[10px] text-slate-400">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="text-[11px] text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
