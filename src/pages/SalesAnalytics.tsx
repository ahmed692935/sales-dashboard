import { useState } from "react";
import {
  Phone,
  PhoneOutgoing,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  ChevronDown,
  Settings,
  Search,
  RefreshCw,
  Share2,
  Copy,
  Trash2,
  Filter,
  Download,
  Upload,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AgentRow {
  id: string;
  name: string;
  avgDuration: string;
  outboundAttempted: number;
  outboundConnected: number;
  inboundCalls: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const ALL_AGENTS: AgentRow[] = Array.from({ length: 430 }, (_, i) => ({
  id: String(i + 1),
  name: i === 0 ? "Nouman Ali" : `Agent ${i + 1}`,
  avgDuration: i === 0 ? "0s" : `${Math.floor(Math.random() * 120)}s`,
  outboundAttempted: i === 0 ? 0 : Math.floor(Math.random() * 20),
  outboundConnected: i === 0 ? 0 : Math.floor(Math.random() * 15),
  inboundCalls: i === 0 ? 0 : Math.floor(Math.random() * 30),
}));

const ROWS_PER_PAGE = 10;

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  borderColor,
}: StatCardProps) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 min-w-[130px] overflow-hidden flex flex-col">
    {/* Content — padded */}
    <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-4 flex-1">
      <div>
        <p className="text-[11px] text-slate-500 font-medium leading-tight">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={17} className={iconColor} />
      </div>
    </div>
    {/* Full-width colored strip — no padding, edge-to-edge */}
    <div className={`h-1 w-full ${borderColor}`} />
  </div>
);

// ─── Icon toolbar button ──────────────────────────────────────────────────────
const IconBtn = ({
  icon: Icon,
  onClick,
}: {
  icon: React.ElementType;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-800 hover:text-slate-700 hover:bg-slate-100 transition-colors"
  >
    <Icon size={14} />
  </button>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) => {
  const pages: (number | "...")[] =
    total <= 5
      ? Array.from({ length: total }, (_, i) => i + 1)
      : [1, 2, 3, "...", total];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={13} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-7 h-7 flex items-center justify-center text-xs text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
              current === p
                ? "bg-violet-600 text-white shadow-sm"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const CallsAnalytics = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = ALL_AGENTS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () => {
    const ids = paginated.map((a) => a.id);
    const allSel = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const n = new Set(prev);
      allSel
        ? ids.forEach((id) => n.delete(id))
        : ids.forEach((id) => n.add(id));
      return n;
    });
  };

  const allPageSel =
    paginated.length > 0 && paginated.every((a) => selected.has(a.id));
  const startEntry =
    filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endEntry = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

  const STATS: StatCardProps[] = [
    {
      label: "Total Call Volume",
      value: 4,
      icon: Phone,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-400",
      borderColor: "bg-blue-500",
    },
    {
      label: "Outbound Connected",
      value: 5,
      icon: PhoneOutgoing,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-400",
      borderColor: "bg-orange-400",
    },
    {
      label: "Outbound Attempted",
      value: 6,
      icon: PhoneOutgoing,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-400",
      borderColor: "bg-violet-500",
    },
    {
      label: "Inbound Calls",
      value: 12,
      icon: PhoneIncoming,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
      borderColor: "bg-yellow-400",
    },
    {
      label: "Missed Calls",
      value: 160,
      icon: PhoneMissed,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-500",
      borderColor: "bg-teal-500",
    },
    {
      label: "Avg. Call Duration",
      value: "5s",
      icon: Clock,
      iconBg: "bg-red-50",
      iconColor: "text-red-400",
      borderColor: "bg-red-500",
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Title */}
          <div>
            <h1 className="text-base font-bold text-slate-800">
              WhatsApp Calls Analytics
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Last Updated · Mar 15, 2026 10:46 AM
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Last 7 Days */}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Last 7 Days <ChevronDown size={12} />
            </button>
            {/* Date range */}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              28 Dec 22 – 10 Jan 23 <ChevronDown size={12} />
            </button>
            {/* Phone number button */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap">
              <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center shrink-0">
                <Phone size={11} className="text-white" />
              </div>
              +923261111947
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-5 flex flex-col gap-6">
        {/* Stat cards */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Agent Performance */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            Agent performance
          </h2>

          {/* Table card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
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
                    className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-36 sm:w-44"
                  />
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <IconBtn icon={RefreshCw} />
                <IconBtn icon={Share2} />
                <IconBtn icon={Copy} />
                <IconBtn icon={Trash2} />
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <IconBtn icon={Filter} />
                <IconBtn icon={Download} />
                <IconBtn icon={Upload} />
                <IconBtn icon={Maximize2} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
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
                      "Agent",
                      "Avg. Call Duration",
                      "Outbound Attempted",
                      "Outbound Connected",
                      "Inbound Calls",
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
                        colSpan={6}
                        className="px-4 py-12 text-center text-sm text-slate-400"
                      >
                        No agents found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((agent) => (
                      <tr
                        key={agent.id}
                        className={`transition-colors ${selected.has(agent.id) ? "bg-violet-50" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(agent.id)}
                            onChange={() => toggleRow(agent.id)}
                            className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-800">
                          {agent.name}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {agent.avgDuration}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {agent.outboundAttempted}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {agent.outboundConnected}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {agent.inboundCalls}
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
                current={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallsAnalytics;
