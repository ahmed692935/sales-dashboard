import { useState } from "react";
import {
  Settings,
  Search,
  Share2,
  Copy,
  Trash2,
  Filter,
  Download,
  Upload,
  Maximize2,
  Pencil,
  Eye,
  Share,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type MemberStatus = "Active" | "Inactive" | "Pending";

interface Member {
  id: string;
  avatar: string;
  name: string;
  subContent: string;
  email: string;
  role: string;
  status: MemberStatus;
  joined: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const ROLES = ["Manager", "Admin", "Agent", "Viewer"];
const STATUSES: MemberStatus[] = ["Active", "Inactive", "Pending"];
const CITIES = ["Sargodha", "Lahore", "Karachi", "Islamabad", "Peshawar"];

const allMembers: Member[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  avatar: `https://i.pravatar.cc/150?img=${(i % 10) + 1}`,
  name: "Cell Cont ent",
  subContent: "Sub Content",
  email: "abc@gmail.com",
  role: ROLES[i % ROLES.length],
  status: STATUSES[i % STATUSES.length],
  joined: CITIES[i % CITIES.length],
}));

const ROWS_PER_PAGE = 10;

// ─── Status Badge ──────────────────────────────────────────────────────────────

const statusStyle: Record<MemberStatus, string> = {
  Active: "bg-violet-600 text-white",
  Inactive: "bg-slate-200 text-slate-500",
  Pending: "bg-amber-100 text-amber-600",
};

const StatusBadge = ({ status }: { status: MemberStatus }) => (
  <span
    className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${statusStyle[status]}`}
  >
    {status}
  </span>
);

// ─── Icon Button ───────────────────────────────────────────────────────────────

const IconBtn = ({ icon: Icon }: { icon: React.ElementType }) => (
  <button className="w-7 h-7 flex items-center justify-center rounded-md text-gray-700 hover:text-slate-700 hover:bg-slate-100 transition-colors">
    <Icon size={14} />
  </button>
);

// ─── Pagination ────────────────────────────────────────────────────────────────

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
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
      >
        ‹
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
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
      >
        ›
      </button>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const Members = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = allMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.status.toLowerCase().includes(search.toLowerCase()),
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
    const ids = paginated.map((m) => m.id);
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
    paginated.length > 0 && paginated.every((m) => selected.has(m.id));
  const startEntry =
    filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endEntry = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
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
          {/* Right icons */}
          <div className="flex items-center gap-0.5">
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
        <div className="overflow-x-auto flex-1">
          <table className="w-full min-w-[750px]">
            <thead className="border-b border-slate-100 bg-white">
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
                  "Member",
                  "Email",
                  "Role",
                  "Status",
                  "Joined",
                  "Actions",
                  "View Details",
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
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                paginated.map((member) => (
                  <tr
                    key={member.id}
                    className={`transition-colors ${selected.has(member.id) ? "bg-violet-50" : "hover:bg-slate-50"}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.has(member.id)}
                        onChange={() => toggleRow(member.id)}
                        className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                      />
                    </td>

                    {/* Member — avatar + name + sub */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {member.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {member.subContent}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {member.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {member.role}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={member.status} />
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                      {member.joined}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={13} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                          <Share size={13} />
                        </button>
                      </div>
                    </td>

                    {/* View Details */}
                    <td className="px-4 py-3.5">
                      <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer / Pagination ───────────────────────────────────────────── */}
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
  );
};

export default Members;
