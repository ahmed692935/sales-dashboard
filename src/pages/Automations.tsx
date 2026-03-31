import { useState } from "react";
import {
  Search,
  Share2,
  Copy,
  Trash2,
  Filter,
  Download,
  Upload,
  Maximize2,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
} from "lucide-react";

import AutomationsSecondSidebar from "../components/Automations/AutomationSidebar";
import type { AutomationAction } from "../types";
import { AUTOMATION_ACTIONS } from "../components/Automations/AutomationActions";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MaterialRow {
  id: string;
  name: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TEAMS = [
  "Sales Team",
  "Support Team",
  "Engineering",
  "Marketing",
  "Finance",
];

const getMockRows = (actionId: string): MaterialRow[] =>
  Array.from({ length: 430 }, (_, i) => ({
    id: String(i + 1),
    name: "Material Name",
    description:
      actionId === "assign-to-team"
        ? "Assign to team {team name}"
        : actionId === "assign-to-user"
          ? "Assign to user {user name}"
          : "Send notification to {team name}",
  }));

const ROWS_PER_PAGE = 10;

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

// ─── Add Material Modal ───────────────────────────────────────────────────────
const AddMaterialModal = ({
  actionLabel,
  onClose,
}: {
  actionLabel: string;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [dropdownOpen, setDropdown] = useState(false);
  const [selected, setSelected] = useState<string[]>(["Team", "Team 1"]);

  const toggle = (team: string) =>
    setSelected((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team],
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 pt-6 pb-5">
          <h2 className="text-base font-bold text-slate-800 mb-5">
            {actionLabel} Material
          </h2>

          {/* Material name */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Material name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Please input name e.g (Send notification to John)"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>

          {/* Team list */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Team list
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdown((v) => !v)}
                className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-400 bg-white hover:border-slate-300 transition-colors"
              >
                <span>Select</span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                  {TEAMS.map((team) => (
                    <button
                      key={team}
                      type="button"
                      onClick={() => toggle(team)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selected.includes(team)
                          ? "text-violet-700 bg-violet-50 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected tags */}
          {selected.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Selected Team
              </label>
              <div className="flex flex-wrap gap-2">
                {selected.map((team) => (
                  <span
                    key={team}
                    className="flex items-center gap-1 px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded-md"
                  >
                    <X
                      size={11}
                      className="cursor-pointer hover:opacity-70"
                      onClick={() => toggle(team)}
                    />
                    {team}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Save and Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Automations = () => {
  const [activeAction, setActiveAction] = useState<AutomationAction>(
    AUTOMATION_ACTIONS[2],
  );
  const [search, setSearch] = useState("");
  const [currentPage, setPage] = useState(1);
  const [showModal, setModal] = useState(false);

  const rows = getMockRows(activeAction.id);
  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()),
  );
  const total = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paged = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );
  const start =
    filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

  const ActionIcon = activeAction.icon;

  const handleActionChange = (action: AutomationAction) => {
    setActiveAction(action);
    setPage(1);
    setSearch("");
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-full bg-slate-50">
      {showModal && (
        <AddMaterialModal
          actionLabel={activeAction.label}
          onClose={() => setModal(false)}
        />
      )}

      {/* ── Second sidebar — extracted component ──────────────────────── */}
      <AutomationsSecondSidebar
        activeId={activeAction.id}
        onChange={handleActionChange}
      />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ActionIcon size={18} className="text-slate-500" />
              {activeAction.label}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {activeAction.description}
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={13} /> Add
          </button>
        </div>

        {/* Table card */}
        <div className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
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
                  setPage(1);
                }}
                placeholder="Search"
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-44"
              />
            </div>
            <div className="flex items-center gap-0.5">
              {[Share2, Copy, Trash2, Filter, Download, Upload, Maximize2].map(
                (Icon, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Icon size={14} />
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <tbody className="divide-y divide-slate-50">
                {paged.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-12 text-center text-sm text-slate-400"
                    >
                      No items found.
                    </td>
                  </tr>
                ) : (
                  paged.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {row.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {row.description}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-auto">
                          <MoreVertical size={14} />
                        </button>
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
              Showing {start} to {end} of {filtered.length} entries
            </p>
            <Pagination
              current={currentPage}
              total={total}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automations;
