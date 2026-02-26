import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
} from "lucide-react";
import type { FlowRow, FlowStatus } from "../types";
import CreateFlowModal from "../components/FlowModal";

// ─── Mock data ────────────────────────────────────────────────────────────────

const statuses: FlowStatus[] = [
  "DRAFT",
  "DEPRECATED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "THROTTLED",
  "PUBLISHED",
];

const allFlows: FlowRow[] = Array.from({ length: 130 }, (_, i) => ({
  id: String(i + 1),
  name: "name fo flow",
  flowId: "12345688",
  category: "Sign Up",
  status: statuses[i % statuses.length],
  lastEdited: "10 Des 2022 - 11:50",
}));

const ROWS_PER_PAGE = 10;

// ─── Stat cards ───────────────────────────────────────────────────────────────

const statsData = [
  { label: "Total Flows", value: "135", border: "border-b-violet-500" },
  { label: "Blocked", value: "120", border: "border-b-amber-400" },
  { label: "Draft", value: "105", border: "border-b-yellow-400" },
  { label: "Published", value: "5", border: "border-b-green-500" },
  { label: "Deprecated", value: "5", border: "border-b-red-400" },
  { label: "Throttled", value: "5", border: "border-b-orange-400" },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusStyle: Record<FlowStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-500",
  DEPRECATED: "bg-red-100 text-red-600",
  PUBLISHED: "bg-green-100 text-green-700",
  THROTTLED: "bg-orange-100 text-orange-600",
};

const StatusBadge = ({ status }: { status: FlowStatus }) => (
  <span
    className={`inline-block px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${statusStyle[status]}`}
  >
    {status}
  </span>
);

// ─── Small icon button ────────────────────────────────────────────────────────

const IconBtn = ({ icon: Icon }: { icon: React.ElementType }) => (
  <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
    <Icon size={14} />
  </button>
);

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (p: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  const pages: (number | "...")[] =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [1, 2, 3, "...", totalPages];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={13} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e-${i}`}
            className="w-7 h-7 flex items-center justify-center text-xs text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
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
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Flows = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  const filtered = allFlows.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase()) ||
      f.status.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const ids = paginated.map((f) => f.id);
    const allSel = ids.every((id) => selectedRows.has(id));
    setSelectedRows((prev) => {
      const next = new Set(prev);
      allSel
        ? ids.forEach((id) => next.delete(id))
        : ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const allPageSel =
    paginated.length > 0 && paginated.every((f) => selectedRows.has(f.id));
  const startEntry =
    filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endEntry = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

  return (
    <>
      {showModal && <CreateFlowModal onClose={() => setShowModal(false)} />}
      <div className="flex flex-col min-h-full bg-slate-50">
        {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
        <div className="flex gap-3 overflow-x-auto m-4">
          {statsData.map((s) => (
            <div
              key={s.label}
              className={`flex-1 min-w-[130px] border-b-4 rounded-b-xl bg-white ${s.border} px-5 py-4 border-r border-slate-100 last:border-r-0`}
            >
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Create Flow Header ──────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 m-4 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Create Flow</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create and manage automated conversation flows
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
            onClick={() => setShowModal(true)}
          >
            <Plus size={13} />
            Create New Flow
          </button>
        </div>

        {/* ── Table Container ─────────────────────────────────────────────────── */}
        <div className="mx-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            {/* Left */}
            <div className="flex items-center gap-2">
              <IconBtn icon={Settings} />
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search"
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-40"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Compare
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap">
                Sun, 1 Dec – Sat, 7 Dec{" "}
                <ChevronDown size={12} className="ml-1" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                This Week <ChevronDown size={12} className="ml-1" />
              </button>
              <div className="flex items-center gap-0.5 border-l border-slate-200 pl-2 ml-1">
                <IconBtn icon={Share2} />
                <IconBtn icon={Copy} />
                <IconBtn icon={Trash2} />
                <IconBtn icon={Filter} />
                <IconBtn icon={Download} />
                <IconBtn icon={Upload} />
                <IconBtn icon={Maximize2} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allPageSel}
                      onChange={toggleAll}
                      className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                    />
                  </th>
                  {[
                    "Flow Name",
                    "Flow ID",
                    "Category",
                    "Status",
                    "Last Edited",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-slate-400"
                    >
                      No flows found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((flow) => (
                    <tr
                      key={flow.id}
                      className={`transition-colors ${
                        selectedRows.has(flow.id)
                          ? "bg-violet-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(flow.id)}
                          onChange={() => toggleRow(flow.id)}
                          className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">
                        {flow.name}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">
                        {flow.flowId}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">
                        {flow.category}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={flow.status} />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {flow.lastEdited}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 flex items-center justify-center rounded-md text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button className="w-7 h-7 flex items-center justify-center rounded-md text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap bg-white">
            <p className="text-xs text-slate-500">
              Showing {startEntry} to {endEntry} of {filtered.length} entries
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Flows;
