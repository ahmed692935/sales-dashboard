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
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Avatar from "../assets/images/avatar.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type StageType = "Verified" | "Ongoing" | "Rejected" | "On Hold";

interface Contact {
  id: string;
  name: string;
  subName: string;
  avatar: string | undefined;
  email: string;
  phone: string;
  city: string;
  qualification: string;
  stage: StageType;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const allContacts: Contact[] = Array.from({ length: 130 }, (_, i) => ({
  id: String(i + 1),
  name: "Cell Cont ent",
  subName: "Sub Content",
  email: "abc@gmail.com",
  phone: "+92 300 1234567",
  city: "Sargodha",
  qualification: ["BS IT", "BS CS", "BS SE", "BS Physics", "BS Chemistry"][
    i % 5
  ],
  stage: (
    ["Verified", "Ongoing", "Verified", "Rejected", "On Hold"] as StageType[]
  )[i % 5],
  avatar: Avatar,
}));

const ROWS_PER_PAGE = 8;
const TOTAL = allContacts.length;

// ─── Stage Badge ──────────────────────────────────────────────────────────────

const stageBadgeStyle: Record<StageType, string> = {
  Verified: "bg-violet-100 text-violet-700",
  Ongoing: "bg-blue-100 text-blue-600",
  Rejected: "bg-rose-100 text-rose-600",
  "On Hold": "bg-orange-100 text-orange-600",
};

const StageBadge = ({ stage }: { stage: StageType }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${stageBadgeStyle[stage]}`}
  >
    {stage}
  </span>
);

// ─── Toolbar Icon Button ──────────────────────────────────────────────────────

const IconBtn = ({ icon: Icon }: { icon: React.ElementType }) => (
  <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-700 hover:text-slate-700 hover:bg-slate-100 transition-colors">
    <Icon size={15} />
  </button>
);

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  const pages: (number | "...")[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "...", totalPages);
  }

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
            key={`ellipsis-${i}`}
            className="w-8 h-8 flex items-center justify-center text-xs text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
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

const Contacts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Filter by search
  const filtered = allContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.qualification.toLowerCase().includes(search.toLowerCase()),
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
    const pageIds = paginated.map((c) => c.id);
    const allSelected = pageIds.every((id) => selectedRows.has(id));
    setSelectedRows((prev) => {
      const next = new Set(prev);
      allSelected
        ? pageIds.forEach((id) => next.delete(id))
        : pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const allPageSelected =
    paginated.length > 0 && paginated.every((c) => selectedRows.has(c.id));

  const startEntry =
    filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endEntry = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
        {/* Left side */}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search"
              className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-44"
            />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors shadow-sm">
            <Filter size={12} />
            Filter
          </button>
        </div>

        {/* Right side */}
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

      {/* Table wrapper */}
      <div className="flex-1 overflow-auto">
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
                "Email",
                "Phone Number",
                "City",
                "Qualification",
                "Stage",
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
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  No contacts found.
                </td>
              </tr>
            ) : (
              paginated.map((contact) => (
                <tr
                  key={contact.id}
                  className={`transition-colors ${
                    selectedRows.has(contact.id)
                      ? "bg-violet-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {/* Checkbox */}
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
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {contact.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <p className="text-[11px] text-slate-400">
                            {contact.subName}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <p className="text-[13px] font-semibold text-black">
                      {contact.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {contact.subName}
                    </p> */}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3.5 text-xs text-slate-800">
                    {contact.email}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3.5 text-xs text-slate-800 whitespace-nowrap">
                    {contact.phone}
                  </td>

                  {/* City */}
                  <td className="px-4 py-3.5 text-xs text-slate-800">
                    {contact.city}
                  </td>

                  {/* Qualification */}
                  <td className="px-4 py-3.5 text-xs text-slate-800">
                    {contact.qualification}
                  </td>

                  {/* Stage */}
                  <td className="px-4 py-3.5">
                    <StageBadge stage={contact.stage} />
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
      </div>

      {/* Scrollbar hint row (matches screenshot) */}
      <div className="bg-white border-t border-slate-100 h-1.5 overflow-x-auto">
        <div className="min-w-[860px] h-full" />
      </div>

      {/* Footer / Pagination */}
      <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-slate-500">
          Showing {startEntry} to {endEntry} of {TOTAL} entries
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
