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
  Loader2,
} from "lucide-react";
import { useContacts } from "../hooks/useWhatsapp";
import {
  DataTable,
  type Column,
} from "../components/global/DataTable/DataTable";
import { ContactDetailModal } from "../components/Contacts/ContactDetailModal/ContactDetailModal";
import type { WhatsappContact } from "../services/whatsapp.service";

const IconBtn = ({ icon: Icon }: { icon: React.ElementType }) => (
  <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-700 hover:text-slate-700 hover:bg-slate-100 transition-colors">
    <Icon size={15} />
  </button>
);

const LIMIT = 10;

const Contacts = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [detailContact, setDetailContact] = useState<WhatsappContact | null>(
    null,
  );

  const { data, isLoading, isError, isFetching } = useContacts({
    page: currentPage,
    limit: LIMIT,
    search: debouncedSearch || undefined,
  });

  const contacts: WhatsappContact[] = data?.data ?? [];
  const pagination = data?.pagination;

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

  const columns: Column<WhatsappContact>[] = [
    {
      key: "name",
      header: "Name",
      render: (c) => (
        <div className="flex items-center gap-2.5">
          {c.profilePicture ? (
            <img
              src={c.profilePicture}
              alt={c.name ?? c.phone}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-violet-600">
                {(c.name ?? c.phone).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-slate-800">
              {c.name ?? "Unknown"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-[11px] text-slate-400">{c.phone}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone Number",
      render: (c) => (
        <span className="text-xs text-slate-800 whitespace-nowrap">
          {c.phone}
        </span>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (c) =>
        c.tags.length === 0 ? (
          <span className="text-xs text-slate-400">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {c.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                style={{ backgroundColor: tag.color ?? "#6b7280" }}
              >
                {tag.label}
              </span>
            ))}
            {c.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                +{c.tags.length - 3}
              </span>
            )}
          </div>
        ),
    },

    {
      key: "source",
      header: "Source",
      render: () => (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          WhatsApp
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (c) => (
        <span className="text-xs text-slate-800 whitespace-nowrap">
          {new Date(c.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
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
      ),
    },
    {
      key: "view",
      header: "View Details",
      render: (c) => (
        <button
          onClick={() => setDetailContact(c)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-black hover:text-violet-600 hover:bg-violet-50 transition-colors"
        >
          <Eye size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Toolbar */}
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

      {/* Table */}
      <DataTable
        columns={columns}
        data={contacts}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        pagination={pagination}
        onPageChange={setCurrentPage}
        selectedRows={selectedRows}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        limit={LIMIT}
        emptyMessage={
          debouncedSearch
            ? "No contacts match your search."
            : "No contacts yet. They appear here when someone messages you on WhatsApp."
        }
      />

      {/* Detail Modal */}
      {detailContact && (
        <ContactDetailModal
          contact={detailContact}
          onClose={() => setDetailContact(null)}
        />
      )}
    </div>
  );
};

export default Contacts;
