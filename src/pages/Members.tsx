import { useState, useCallback } from "react";
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
  Loader2,
  X,
} from "lucide-react";
import {
  useUsers,
  useCreateUser,
  useUpdateRole,
  useDeleteUser,
} from "../hooks/useUsers";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "../components/global/ConfirmModal/ConfirmModal";
import type { User } from "../services/user.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Role = "manager" | "member" | "viewer";

const roleStyle: Record<string, string> = {
  organizer: "bg-violet-100 text-violet-700",
  manager: "bg-blue-100 text-blue-700",
  member: "bg-green-100 text-green-700",
  viewer: "bg-slate-100 text-slate-600",
};

const RoleBadge = ({ role }: { role: string }) => (
  <span
    className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${roleStyle[role] ?? "bg-slate-100 text-slate-500"}`}
  >
    {role}
  </span>
);

const IconBtn = ({ icon: Icon }: { icon: React.ElementType }) => (
  <button className="w-7 h-7 flex items-center justify-center rounded-md text-gray-700 hover:text-slate-700 hover:bg-slate-100 transition-colors">
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
      : current <= 3
        ? [1, 2, 3, "...", total]
        : current >= total - 2
          ? [1, "...", total - 2, total - 1, total]
          : [1, "...", current, "...", total];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
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
            key={`${p}-${i}`}
            onClick={() => onChange(p as number)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
              current === p
                ? "bg-violet-600 text-white"
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
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
      >
        ›
      </button>
    </div>
  );
};

// ─── Create User Modal ────────────────────────────────────────────────────────

const CreateUserModal = ({ onClose }: { onClose: () => void }) => {
  const { mutate: createUser, isPending } = useCreateUser();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member" as Role,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(form, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            Add team member
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@acme.com"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input"
            >
              <option value="manager">Manager</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1 py-2.5 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex-1 py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Creating...
                </>
              ) : (
                "Create member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Edit Role Modal ──────────────────────────────────────────────────────────

const EditRoleModal = ({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) => {
  const { mutate: updateRole, isPending } = useUpdateRole();
  const [role, setRole] = useState<Role>(user.role as Role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRole({ id: user.id, payload: { role } }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">Edit role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">
            Updating role for{" "}
            <span className="font-medium text-gray-800">{user.name}</span>
          </p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="input"
          >
            <option value="manager">Manager</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1 py-2.5 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex-1 py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving...
                </>
              ) : (
                "Save role"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const LIMIT = 10;

const Members = () => {
  const { user: authUser } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const isOrganizer = authUser?.role === "organizer";

  // Debounce search — wait 400ms before hitting the backend
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => setDebouncedSearch(value), 400);
  }, []);

  const { data, isLoading, isError, isFetching } = useUsers({
    page: currentPage,
    limit: LIMIT,
    search: debouncedSearch || undefined,
  });

  const users = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () => {
    const ids = users.map((m) => m.id);
    const allSel = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const n = new Set(prev);
      allSel
        ? ids.forEach((id) => n.delete(id))
        : ids.forEach((id) => n.add(id));
      return n;
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    deleteUser(deletingUser.id, { onSuccess: () => setDeletingUser(null) });
  };

  const allPageSel = users.length > 0 && users.every((m) => selected.has(m.id));

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* ── Toolbar ────────────────────────────────────────────────────── */}
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search members..."
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-44"
              />
              {isFetching && !isLoading && (
                <Loader2
                  size={10}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin"
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <IconBtn icon={Share2} />
              <IconBtn icon={Copy} />
              <IconBtn icon={Trash2} />
              <IconBtn icon={Filter} />
              <IconBtn icon={Download} />
              <IconBtn icon={Upload} />
              <IconBtn icon={Maximize2} />
            </div>
            {isOrganizer && (
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary px-3 py-1.5 text-xs rounded-lg"
              >
                + Add member
              </button>
            )}
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading members...</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-20 text-sm text-red-400">
              Failed to load members. Please try again.
            </div>
          ) : (
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-slate-100 bg-white">
                <tr>
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allPageSel}
                      onChange={toggleAll}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </th>
                  {["Member", "Email", "Role", "Joined", "Actions"].map((h) => (
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
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-sm text-slate-400"
                    >
                      {debouncedSearch
                        ? "No members match your search."
                        : "No members yet."}
                    </td>
                  </tr>
                ) : (
                  users.map((member) => (
                    <tr
                      key={member.id}
                      className={`transition-colors ${selected.has(member.id) ? "bg-violet-50" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected.has(member.id)}
                          onChange={() => toggleRow(member.id)}
                          className="rounded border-slate-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-violet-600">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">
                        {member.email}
                      </td>
                      <td className="px-4 py-3.5">
                        <RoleBadge role={member.role} />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(member.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {isOrganizer && member.role !== "organizer" && (
                            <>
                              <button
                                onClick={() => setEditingUser(member)}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => setDeletingUser(member)}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                          <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap bg-white">
          <p className="text-xs text-slate-500">
            Showing {pagination ? (currentPage - 1) * LIMIT + 1 : 0} to{" "}
            {pagination ? Math.min(currentPage * LIMIT, pagination.total) : 0}{" "}
            of {pagination?.total ?? 0} members
          </p>
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} />}
      {editingUser && (
        <EditRoleModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      {deletingUser && (
        <ConfirmationModal
          title="Remove member"
          message={`Are you sure you want to remove ${deletingUser.name}? This action cannot be undone.`}
          confirmLabel="Remove member"
          isLoading={isDeleting}
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
};

export default Members;
