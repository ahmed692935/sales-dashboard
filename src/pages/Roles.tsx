import { useState } from "react";
import { ChevronDown, Plus, X, Check, Users } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Role {
  id: string;
  name: string;
  managerCount: number;
  scope: string;
  description: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const initialRoles: Role[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  name: "Organization Admin",
  managerCount: 3,
  scope: "organization",
  description: "Full Access to manage, billing, settings, CRUD operations",
}));

const AGENT_TYPES = ["Agent", "Admin", "Manager", "Viewer"];

// ─── Create Role Modal ────────────────────────────────────────────────────────

interface RoleFormProps {
  onSave: (data: Omit<Role, "id">) => void;
  onClose: () => void;
}

const RoleForm = ({ onSave, onClose }: RoleFormProps) => {
  const [name, setName] = useState("");
  const [scope, setScope] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), scope, description, managerCount: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800">
            Create New Role
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Role Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Organization Admin"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Scope
          </label>
          <input
            type="text"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            placeholder="e.g. organization"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the permissions for this role..."
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            <Check size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Role Card ─────────────────────────────────────────────────────────────────

const RoleCard = ({ role }: { role: Role }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 min-w-0">
    {/* Header */}
    <div className="flex items-start justify-between gap-1">
      <span className="text-lg font-bold text-slate-800 leading-tight">
        {role.name}
      </span>
      <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
        {role.managerCount} managers
      </span>
    </div>

    {/* Scope */}
    <p className="text-[11px] text-slate-400">scope: {role.scope}</p>

    {/* Description */}
    <p className="text-[12px] text-slate-500 leading-relaxed flex-1">
      {role.description}
    </p>

    {/* Actions */}
    <div className="flex items-center gap-2 mt-2 flex-wrap justify-between">
      <button className="text-[12px] border px-3 pt-1 pb-1 border-gray-300 font-medium text-slate-600 hover:text-slate-800 transition-colors whitespace-nowrap">
        View Managers
      </button>
      <button className="flex items-center gap-1 text-[12px] font-semibold text-white bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
        <Plus size={12} /> Add new manager
      </button>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const Permissions = () => {
  const [email, setEmail] = useState("");
  const [agentType, setAgentType] = useState("Agent");
  const [agentDropdown, setAgentDropdown] = useState(false);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [showCreateRole, setShowCreateRole] = useState(false);

  const handleInvite = () => {
    if (!email.trim()) return;
    setEmail("");
  };

  const handleCreateRole = (data: Omit<Role, "id">) => {
    setRoles((prev) => [...prev, { ...data, id: Date.now().toString() }]);
    setShowCreateRole(false);
  };

  return (
    <div className="p-5 sm:p-6 min-h-full bg-gray-100">
      {/* Modal */}
      {showCreateRole && (
        <RoleForm
          onSave={handleCreateRole}
          onClose={() => setShowCreateRole(false)}
        />
      )}

      {/* ── Outer dashed blue border container ──────────────────────────── */}
      <div className="rounded-xl overflow-hidden">
        {/* ── Invite Team Members ──────────────────────────────────────────── */}
        <div className="">
          <h2 className="text-lg font-bold text-slate-800 mb-3">
            Invite Team Members
          </h2>

          {/* Input row */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Email input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors"
            />

            {/* Agent type dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setAgentDropdown((v) => !v)}
                className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors min-w-[90px] justify-between"
              >
                {agentType}
                <ChevronDown
                  size={13}
                  className={`text-slate-400 transition-transform ${agentDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {agentDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden min-w-[100px]">
                  {AGENT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setAgentType(t);
                        setAgentDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        agentType === t
                          ? "text-violet-700 bg-violet-50 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Invite button */}
            <button
              onClick={handleInvite}
              className="shrink-0 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
            >
              Invite
            </button>
          </div>

          <p className="text-sm text-slate-400 mt-2.5 mb-5">
            Invitations are sent via email. New members can accept and join your
            workspace.
          </p>
        </div>

        {/* ── Roles and Permissions ─────────────────────────────────────────── */}
        <div className="px-5 pt-5 pb-6">
          {/* Section header */}
          <div className="flex items-start bg-white p-5 justify-between gap-4 mb-5 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Roles and Permissions
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                review your member roles and allocate permissions
              </p>
            </div>
            <button
              onClick={() => setShowCreateRole(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              Create New Role
            </button>
          </div>

          {/* Roles grid */}
          {roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Users size={18} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-400">
                No roles yet. Create your first role!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
              {roles.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Permissions;
