import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Settings,
  Search,
  Share2,
  Copy,
  Trash2,
  Filter,
  Download,
  Upload,
  Maximize2,
  Eye,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { LeadStat, TeamMemberRow, TopPerformer } from "../types";

// ─── Data ────────────────────────────────────────────────────────────────────

const leadStats: LeadStat[] = [
  {
    label: "New Leads",
    value: "16,249",
    change: "+11.02%",
    positive: true,
    color: "#1e293b",
    borderColor: "border-l-slate-800",
  },
  {
    label: "Qualified",
    value: "12,233",
    change: "+11.02%",
    positive: true,
    color: "#f59e0b",
    borderColor: "border-l-amber-400",
  },
  {
    label: "Proposal",
    value: "11,264",
    change: "+11.02%",
    positive: true,
    color: "#eab308",
    borderColor: "border-l-yellow-400",
  },
  {
    label: "Negotiation",
    value: "16,249",
    change: "+11.02%",
    positive: true,
    color: "#22c55e",
    borderColor: "border-l-green-500",
  },
  {
    label: "Won",
    value: "160",
    change: "+11.02%",
    positive: true,
    color: "#16a34a",
    borderColor: "border-l-green-600",
  },
  {
    label: "Lost",
    value: "45",
    change: "+11.02%",
    positive: false,
    color: "#ef4444",
    borderColor: "border-l-red-500",
  },
];

const barSegments = [
  { label: "New Leads", pct: 13, color: "#1e293b" },
  { label: "Qualified", pct: 23, color: "#f59e0b" },
  { label: "Proposal", pct: 7, color: "#eab308" },
  { label: "Negotiation", pct: 31, color: "#22c55e" },
  { label: "Won", pct: 22, color: "#ef4444" },
];

const pieData = [
  { name: "New Leads", value: 14, color: "#1e293b" },
  { name: "Qualified", value: 22, color: "#f59e0b" },
  { name: "Proposal", value: 18, color: "#eab308" },
  { name: "Negotiation", value: 16, color: "#22c55e" },
  { name: "Won", value: 15, color: "#16a34a" },
  { name: "Lost", value: 15, color: "#ef4444" },
];

const funnelStages = [
  { label: "Leads", pct: 30, color: "#1e293b", widthPct: 100 },
  { label: "Qualified", pct: 30, color: "#f59e0b", widthPct: 82 },
  { label: "Proposal", pct: 30, color: "#eab308", widthPct: 64 },
  { label: "Negotiation", pct: 30, color: "#22c55e", widthPct: 48 },
  { label: "Won", pct: 30, color: "#8b5cf6", widthPct: 34 },
  { label: "Lost", pct: 30, color: "#ef4444", widthPct: 20 },
];

const topPerformers: TopPerformer[] = [
  {
    rank: 1,
    name: "Employee name",
    role: "sales agent",
    wonLeads: 45,
    change: "+18.2%",
  },
  {
    rank: 1,
    name: "Employee name",
    role: "sales agent",
    wonLeads: 45,
    change: "+18.2%",
  },
  {
    rank: 1,
    name: "Employee name",
    role: "sales agent",
    wonLeads: 45,
    change: "+18.2%",
  },
];

const teamMembers: TeamMemberRow[] = [
  {
    id: "1",
    name: "John Doe",
    employeeId: "employee id",
    ticketsAssigned: 15,
    ticketsResolved: 12,
    ticketsPending: 12,
    wonLeads: "Sargodha",
  },
  {
    id: "2",
    name: "Jane Smith",
    employeeId: "employee id",
    ticketsAssigned: 20,
    ticketsResolved: 18,
    ticketsPending: 2,
    wonLeads: "Lahore",
  },
  {
    id: "3",
    name: "Mike Johnson",
    employeeId: "employee id",
    ticketsAssigned: 10,
    ticketsResolved: 8,
    ticketsPending: 2,
    wonLeads: "Karachi",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({ stat }: { stat: LeadStat }) => (
  <div
    className={`bg-white rounded-xl border-l-4 ${stat.borderColor} p-4 shadow-sm flex-1 min-w-[130px]`}
  >
    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1 leading-none">
      {stat.value}
    </p>
    <div
      className={`flex items-center gap-1 mt-2 text-xs font-semibold ${stat.positive ? "text-emerald-600" : "text-red-500"}`}
    >
      {stat.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {stat.change}
    </div>
  </div>
);

const HorizontalBarChart = () => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="text-sm font-semibold text-slate-800 mb-5">
      Sales Horizontal Bar Chart
    </h3>
    {/* Percentages row */}
    <div className="flex mb-2">
      {barSegments.map((seg) => (
        <div key={seg.label} style={{ flex: seg.pct }} className="text-center">
          <span className="text-xs font-semibold text-slate-700">
            {seg.pct}%
          </span>
        </div>
      ))}
    </div>
    {/* Bar */}
    <div className="flex h-5 rounded-md overflow-hidden">
      {barSegments.map((seg) => (
        <div
          key={seg.label}
          style={{ flex: seg.pct, backgroundColor: seg.color }}
        />
      ))}
    </div>
    {/* Legend */}
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
      {barSegments.map((seg) => (
        <div key={seg.label} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: seg.color }}
          />
          <span className="text-xs text-slate-500">{seg.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const SalesPieChart = () => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex-1 min-w-[220px]">
    <h3 className="text-sm font-semibold text-slate-800 mb-2">
      Sales Pie Chart
    </h3>
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              fontSize: 11,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
            }}
          />
          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-slate-800"
            style={{ fontSize: 18, fontWeight: 700, fill: "#1e293b" }}
          >
            14.00
          </text>
          <text
            x="50%"
            y="57%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: 9, fill: "#94a3b8" }}
          >
            Total Leads
          </text>
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-1 mt-1">
        {pieData.map((d) => (
          <div key={d.name} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-[10px] text-slate-500 truncate">
              {d.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SalesFunnelChart = () => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex-1 min-w-[220px]">
    <h3 className="text-sm font-semibold text-slate-800 mb-4">
      Sales Funnel Chart
    </h3>
    <div className="flex gap-4 items-start">
      {/* Funnel */}
      <div className="flex-1 flex flex-col items-center gap-1">
        {funnelStages.map((stage) => (
          <div key={stage.label} className="flex justify-center w-full">
            <div
              className="h-6 rounded-sm transition-all"
              style={{
                width: `${stage.widthPct}%`,
                backgroundColor: stage.color,
              }}
            />
          </div>
        ))}
      </div>
      {/* Labels */}
      <div className="flex flex-col gap-1 justify-center shrink-0">
        {funnelStages.map((stage) => (
          <div key={stage.label} className="flex items-center gap-1.5 h-6">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
            />
            <span className="text-[10px] text-slate-500 whitespace-nowrap">
              {stage.label}-{stage.pct} %
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TopPerformersPanel = () => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex-1 min-w-[200px]">
    <h3 className="text-sm font-semibold text-slate-800 mb-4">
      Top Performers
    </h3>
    <div className="flex flex-col gap-3">
      {topPerformers.map((p, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
            {p.rank}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">
              {p.name}
            </p>
            <p className="text-[10px] text-slate-400">{p.role}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold text-slate-700">
              {p.wonLeads} Won Leads
            </p>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 justify-end">
              <TrendingUp size={10} />
              {p.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const Dashboard = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.size === teamMembers.length
        ? new Set()
        : new Set(teamMembers.map((m) => m.id)),
    );
  };

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-full">
      {/* Date Filter Row */}
      <div className="flex justify-end gap-2">
        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          Sun, 1 Dec – Sat, 7 Dec <ChevronDown size={13} />
        </button>
        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          Week <ChevronDown size={13} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {leadStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Horizontal Bar Chart */}
      <HorizontalBarChart />

      {/* Charts Row */}
      <div className="flex gap-4 flex-wrap lg:flex-nowrap">
        <SalesPieChart />
        <SalesFunnelChart />
        <TopPerformersPanel />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 transition-colors">
              <Settings size={14} />
            </button>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search"
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-40"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[Share2, Copy, Trash2, Filter, Download, Upload, Maximize2].map(
              (Icon, i) => (
                <button
                  key={i}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <Icon size={14} />
                </button>
              ),
            )}
          </div>
        </div>

        {/* Responsive table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-400"
                    checked={selectedRows.size === teamMembers.length}
                    onChange={toggleAll}
                  />
                </th>
                {[
                  "Team Member",
                  "Tickets Assigned",
                  "Tickets Resolved",
                  "Tickets Pending",
                  "Tickets Pending",
                  "Won Leads",
                  "View Details",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr
                  key={member.id}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${selectedRows.has(member.id) ? "bg-violet-50/50" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-violet-600 focus:ring-violet-400"
                      checked={selectedRows.has(member.id)}
                      onChange={() => toggleRow(member.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-slate-800">
                      {member.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <p className="text-[11px] text-slate-400">
                        {member.employeeId}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {member.ticketsAssigned}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {member.ticketsResolved}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {member.ticketsPending}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {member.ticketsPending}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {member.wonLeads}
                  </td>
                  <td className="px-4 py-3">
                    <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-violet-600 transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
