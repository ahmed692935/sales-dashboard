import { useState, useCallback } from "react";
import {
  Search,
  Settings,
  Share2,
  Copy,
  Trash2,
  Filter,
  Download,
  Upload,
  Maximize2,
  Pencil,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useContacts } from "../hooks/useWhatsapp";

const IconBtn = ({ icon: Icon }: { icon: React.ElementType }) => (
  <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-700 hover:text-slate-700 hover:bg-slate-100 transition-colors">
    <Icon size={15} />
  </button>
);

// ─── Pagination ───────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

const LIMIT = 8;

const Contacts = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const { data, isLoading, isError, isFetching } = useContacts({
    page: currentPage,
    limit: LIMIT,
    search: debouncedSearch || undefined,
  });

  const contacts = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  // Debounce search
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => setDebouncedSearch(value), 400);
  }, []);

  const toggleRow = (id: string) =>
    setSelectedRows((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () => {
    const ids = contacts.map((c) => c.id);
    const allSel = ids.every((id) => selectedRows.has(id));
    setSelectedRows((prev) => {
      const n = new Set(prev);
      allSel
        ? ids.forEach((id) => n.delete(id))
        : ids.forEach((id) => n.add(id));
      return n;
    });
  };

  const allPageSelected =
    contacts.length > 0 && contacts.every((c) => selectedRows.has(c.id));
  const startEntry = pagination ? (currentPage - 1) * LIMIT + 1 : 0;
  const endEntry = pagination
    ? Math.min(currentPage * LIMIT, pagination.total)
    : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <IconBtn icon={Settings} />
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search"
              className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-44"
            />
            {isFetching && !isLoading && (
              <Loader2
                size={10}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin"
              />
            )}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors shadow-sm">
            <Filter size={12} /> Filter
          </button>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn icon={Share2} />
          <IconBtn icon={Copy} />
          <IconBtn icon={Trash2} />
          <IconBtn icon={Filter} />
          <IconBtn icon={Download} />
          <IconBtn icon={Upload} />
          <IconBtn icon={Maximize2} />
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading contacts...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-20 text-sm text-red-400">
            Failed to load contacts. Please try again.
          </div>
        ) : (
          <table className="w-full min-w-[860px]">
            <thead className="bg-white border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                {[
                  "Name",
                  "Phone Number",
                  "Source",
                  "Created",
                  "Actions",
                  "View Details",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[13px] font-bold text-black whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    {debouncedSearch
                      ? "No contacts match your search."
                      : "No contacts yet. They appear here when someone messages you on WhatsApp."}
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={`transition-colors ${selectedRows.has(contact.id) ? "bg-violet-50" : "hover:bg-slate-50"}`}
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(contact.id)}
                        onChange={() => toggleRow(contact.id)}
                        className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-violet-600">
                            {(contact.name ?? contact.phone)
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {contact.name ?? "Unknown"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <p className="text-[11px] text-slate-400">
                              {contact.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 text-xs text-slate-800 whitespace-nowrap">
                      {contact.phone}
                    </td>

                    {/* Source */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        WhatsApp
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3.5 text-xs text-slate-800 whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-black hover:text-violet-600 hover:bg-violet-50 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-black hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={13} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-black hover:text-slate-600 hover:bg-slate-100 transition-colors">
                          <Share2 size={13} />
                        </button>
                      </div>
                    </td>

                    {/* View Details */}
                    <td className="px-4 py-3.5">
                      <button className="w-7 h-7 flex items-center justify-center rounded-md text-black hover:text-violet-600 hover:bg-violet-50 transition-colors">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Scrollbar hint ────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-100 h-1.5 overflow-x-auto">
        <div className="min-w-[860px] h-full" />
      </div>

      {/* ── Footer / Pagination ───────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-slate-500">
          Showing {startEntry} to {endEntry} of {pagination?.total ?? 0} entries
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Contacts;
