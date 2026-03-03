import { useState, useRef } from "react";
import { Pencil, Trash2, GripVertical, Plus, Check } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LeadStage {
  id: string;
  name: string;
  description: string;
  color: string; // hex bg color for the row
}

// ─── Preset colors ─────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  { hex: "#ef4444", label: "Red" },
  { hex: "#f97316", label: "Orange" },
  { hex: "#eab308", label: "Yellow" },
  { hex: "#22c55e", label: "Green" },
  { hex: "#06b6d4", label: "Cyan" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#8b5cf6", label: "Violet" },
];

// ─── Initial data ──────────────────────────────────────────────────────────────

const initialStages: LeadStage[] = [
  {
    id: "1",
    name: "Lead Stage 1",
    description: "description of cold call",
    color: "#fef9c3",
  },
  {
    id: "2",
    name: "Lead Stage 2",
    description: "description of cold call",
    color: "#dcfce7",
  },
];

// ─── Create / Edit Form ────────────────────────────────────────────────────────

interface StageFormProps {
  onSave: (stage: Omit<LeadStage, "id">) => void;
  onCancel: () => void;
  initial?: LeadStage;
}

const StageForm = ({ onSave, onCancel, initial }: StageFormProps) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [color, setColor] = useState(initial?.color ?? "#fef9c3");
  const [customColor, setCustomColor] = useState(initial?.color ?? "#fef9c3");
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description, color });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-sm p-6">
      <h3 className="text-lg font-bold text-slate-800 text-center mb-5">
        {initial ? "Edit Stage" : "Create New Stage"}
      </h3>

      {/* Stage Name */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Stage Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Closed"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Lorem ipsum"
          rows={4}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors resize-none"
        />
      </div>

      {/* Color Picker */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Choose Your Lead Stage Color
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => setColor(c.hex)}
              title={c.label}
              className="relative w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none"
              style={{ backgroundColor: c.hex }}
            >
              {color === c.hex && (
                <Check
                  size={12}
                  className="absolute inset-0 m-auto text-white drop-shadow"
                />
              )}
            </button>
          ))}

          {/* Custom color picker */}
          <button
            onClick={() => colorInputRef.current?.click()}
            className="relative w-6 h-6 rounded-full border-2 border-dashed border-slate-300 hover:border-slate-400 flex items-center justify-center transition-colors"
            title="Custom color"
          >
            <Plus size={11} className="text-slate-400" />
            <input
              ref={colorInputRef}
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setColor(e.target.value);
              }}
              className="absolute opacity-0 w-0 h-0"
            />
          </button>
        </div>

        {/* Color preview swatch */}
        <div
          className="mt-2 h-6 w-full rounded-md border border-slate-200 transition-colors"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// ─── Stage Row ─────────────────────────────────────────────────────────────────

interface StageRowProps {
  stage: LeadStage;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDrop: () => void;
  isDraggingOver: boolean;
}

const StageRow = ({
  stage,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingOver,
}: StageRowProps) => (
  <div
    draggable
    onDragStart={() => onDragStart(stage.id)}
    onDragOver={(e) => {
      e.preventDefault();
      onDragOver(stage.id);
    }}
    onDrop={onDrop}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
      isDraggingOver
        ? "border-violet-400 shadow-md scale-[1.01]"
        : "border-transparent"
    }`}
    style={{ backgroundColor: stage.color }}
  >
    {/* Drag handle */}
    <GripVertical size={16} className="text-slate-400 shrink-0" />

    {/* Content */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800">{stage.name}</p>
      <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        onClick={onEdit}
        className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-violet-600 hover:bg-white/60 transition-colors"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={onDelete}
        className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-red-500 hover:bg-white/60 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const LeadStages = () => {
  const [stages, setStages] = useState<LeadStage[]>(initialStages);
  const [showForm, setShowForm] = useState(false);
  const [editingStage, setEditingStage] = useState<LeadStage | null>(null);

  // Drag state
  const dragId = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // ── Drag & Drop ────────────────────────────────────────────────────────
  const handleDragStart = (id: string) => {
    dragId.current = id;
  };
  const handleDragOver = (id: string) => setDragOverId(id);
  const handleDrop = () => {
    if (!dragId.current || dragId.current === dragOverId) {
      dragId.current = null;
      setDragOverId(null);
      return;
    }
    setStages((prev) => {
      const from = prev.findIndex((s) => s.id === dragId.current);
      const to = prev.findIndex((s) => s.id === dragOverId);
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    dragId.current = null;
    setDragOverId(null);
  };

  // ── CRUD ───────────────────────────────────────────────────────────────
  const handleCreate = (data: Omit<LeadStage, "id">) => {
    setStages((prev) => [...prev, { ...data, id: Date.now().toString() }]);
    setShowForm(false);
  };

  const handleEdit = (data: Omit<LeadStage, "id">) => {
    if (!editingStage) return;
    setStages((prev) =>
      prev.map((s) => (s.id === editingStage.id ? { ...s, ...data } : s)),
    );
    setEditingStage(null);
  };

  const handleDelete = (id: string) => {
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 min-h-full bg-gray-100">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Lead Stages</h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize the stages in your sales pipeline. Drag to reorder.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingStage(null);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          Create New Stage
        </button>
      </div>

      {/* ── Stages List ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-8">
        {stages.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-400">
            No stages yet. Click "Create New Stage" to add one.
          </div>
        )}
        {stages.map((stage) => (
          <StageRow
            key={stage.id}
            stage={stage}
            onEdit={() => {
              setEditingStage(stage);
              setShowForm(false);
            }}
            onDelete={() => handleDelete(stage.id)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDraggingOver={dragOverId === stage.id}
          />
        ))}
      </div>

      {/* ── Modals — fixed centered overlay ─────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <StageForm
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingStage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
          onClick={(e) => e.target === e.currentTarget && setEditingStage(null)}
        >
          <StageForm
            initial={editingStage}
            onSave={handleEdit}
            onCancel={() => setEditingStage(null)}
          />
        </div>
      )}
    </div>
  );
};

export default LeadStages;
