import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#ef4444",
  "#ec4899",
  "#f97316",
  "#14b8a6",
  "#6366f1",
];

interface AddStageModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (name: string, color: string) => void;
}

export const AddStageModal = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: AddStageModalProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onConfirm(name.trim(), color);
    setName("");
    setColor(COLORS[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Add new Stage</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Stage name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. Qualified, Negotiation…"
              autoFocus
              className="w-full text-sm text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                  style={{
                    backgroundColor: c,
                    boxShadow:
                      color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5"
            style={{ backgroundColor: `${color}10` }}
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color }}
            >
              {name || "Preview"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={onClose} className="btn-outline flex-1 py-2">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
            className="btn-primary flex-1 py-2"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            Create Stage
          </button>
        </div>
      </div>
    </div>
  );
};
