import { useState } from "react";
import { Pencil, Trash2, Users, Plus, X, Check } from "lucide-react";
import Avatar from "../assets/images/avatar.png";

interface TeamMember {
  id: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  members: TeamMember[];
  leadBy: string;
}

// ─── Real avatar image URLs ────────────────────────────────────────────────────

const AVATAR_URLS = [Avatar];

const makeMemberAvatars = (count: number): TeamMember[] =>
  Array.from({ length: Math.min(count, 4) }, (_, i) => ({
    id: String(i),
    avatar: AVATAR_URLS[i % AVATAR_URLS.length],
  }));

const LOREM =
  "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the";

// Every card now has avatars
const initialTeams: Team[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  name: "Sales Team",
  memberCount: 12,
  description: LOREM,
  members: makeMemberAvatars(4),
  leadBy: "John Doe",
}));

// ─── Team Card ─────────────────────────────────────────────────────────────────

interface TeamCardProps {
  team: Team;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamCard = ({ team, onEdit, onDelete }: TeamCardProps) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow">
    {/* Header */}
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-bold text-slate-800 truncate">
          {team.name}
        </span>
        <span className="text-[11px] border rounded-full px-2 border-gray-300 text-slate-400 whitespace-nowrap shrink-0">
          {team.memberCount} members
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>

    {/* Description */}
    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
      {team.description}
    </p>

    {/* Footer */}
    <div className="flex items-center justify-between mt-1">
      {/* Avatar image stack */}
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {team.members.map((m) => (
            <img
              key={m.id}
              src={m.avatar}
              alt="member"
              className="w-7 h-7 rounded-full border-2 border-white object-cover shrink-0"
            />
          ))}
        </div>
        <span className="ml-2 text-[11px] underline text-violet-600 font-medium">
          +3 More
        </span>
      </div>

      {/* Lead */}
      <span className="text-[11px] text-slate-700 font-semibold">
        Lead by:{" "}
        <span className="font-semibold text-slate-700">{team.leadBy}</span>
      </span>
    </div>
  </div>
);

// ─── Create / Edit Modal ───────────────────────────────────────────────────────

interface TeamFormProps {
  initial?: Team;
  onSave: (data: Pick<Team, "name" | "description" | "leadBy">) => void;
  onClose: () => void;
}

const TeamForm = ({ initial, onSave, onClose }: TeamFormProps) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [leadBy, setLeadBy] = useState(initial?.leadBy ?? "");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description, leadBy });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800">
            {initial ? "Edit Team" : "Create New Team"}
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
            Team Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sales Team"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this team does..."
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Lead By
          </label>
          <input
            type="text"
            value={leadBy}
            onChange={(e) => setLeadBy(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
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

// ─── Main Page ─────────────────────────────────────────────────────────────────

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleCreate = (
    data: Pick<Team, "name" | "description" | "leadBy">,
  ) => {
    setTeams((prev) => [
      ...prev,
      {
        ...data,
        id: Date.now().toString(),
        memberCount: 0,
        members: makeMemberAvatars(4),
      },
    ]);
    setShowCreate(false);
  };

  const handleEdit = (data: Pick<Team, "name" | "description" | "leadBy">) => {
    if (!editingTeam) return;
    setTeams((prev) =>
      prev.map((t) => (t.id === editingTeam.id ? { ...t, ...data } : t)),
    );
    setEditingTeam(null);
  };

  const handleDelete = (id: string) =>
    setTeams((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="p-5 sm:p-6 min-h-full bg-gray-100">
      {showCreate && (
        <TeamForm onSave={handleCreate} onClose={() => setShowCreate(false)} />
      )}
      {editingTeam && (
        <TeamForm
          initial={editingTeam}
          onSave={handleEdit}
          onClose={() => setEditingTeam(null)}
        />
      )}

      <div className="bg-white pt-3 pb-5 px-5">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Teams</h1>
            <p className="text-sm text-slate-400 mt-1">
              Organize members into teams for better collaboration
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreate(true);
              setEditingTeam(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={13} /> Create New Team
          </button>
        </div>

        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Users size={22} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">
              No teams yet. Create your first team!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onEdit={() => {
                  setEditingTeam(team);
                  setShowCreate(false);
                }}
                onDelete={() => handleDelete(team.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
