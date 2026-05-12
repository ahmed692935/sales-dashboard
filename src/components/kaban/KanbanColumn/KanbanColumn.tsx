import { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import type { ConversationWithContact } from "../../../services/whatsapp.service";
import { KanbanCard } from "./KanbanCard";

interface StageConfig {
  id: string;
  stageId: string;
  label: string;
  accent: string;
  glow: string;
}

interface KanbanColumnProps {
  stage: StageConfig;
  items: ConversationWithContact[];
  onRename?: (newName: string) => void;
  onDelete?: () => void;
}

export const KanbanColumn = ({
  stage,
  items,
  onRename,
  onDelete,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(stage.label);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(stage.label);
  }, [stage.label]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const commitRename = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== stage.label) onRename?.(trimmed);
    else setDraft(stage.label);
    setEditing(false);
  };

  return (
    <div className="flex flex-col w-65 shrink-0">
      <div
        className="rounded-t-xl px-4 py-3 flex items-center justify-between gap-2"
        style={{ background: stage.accent }}
      >
        {editing ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setDraft(stage.label);
                  setEditing(false);
                }
              }}
              onBlur={commitRename}
              className="flex-1 min-w-0 bg-white/20 text-white text-xs font-bold uppercase tracking-widest placeholder-white/60 rounded px-2 py-0.5 outline-none focus:bg-white/30"
            />
            <button
              onClick={commitRename}
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Check size={10} className="text-white" />
            </button>
          </div>
        ) : (
          <span className="text-xs font-bold text-white uppercase tracking-widest truncate">
            {stage.label}
          </span>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-5.5 text-center">
            {items.length}
          </span>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setMenuOpen((v) => !v);
                setConfirmDelete(false);
              }}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition-colors"
            >
              <MoreHorizontal size={14} className="text-white" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-40 z-30">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setEditing(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Pencil size={12} />
                  Rename
                </button>

                {items.length > 0 ? (
                  <div className="px-3 py-2">
                    <p className="text-[10px] text-slate-400">
                      Remove all leads first to delete this stage.
                    </p>
                  </div>
                ) : !confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                ) : (
                  <div className="px-3 py-2 flex flex-col gap-1.5">
                    <p className="text-[10px] text-slate-500">
                      Delete this stage?
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setConfirmDelete(false);
                          onDelete?.();
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={10} />
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <X size={10} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-130 rounded-b-xl border border-t-0 p-2.5 flex flex-col gap-2.5 transition-colors duration-150 ${
          isOver
            ? "bg-slate-100 border-slate-300"
            : "bg-slate-50 border-slate-200"
        }`}
        style={
          isOver
            ? { boxShadow: `inset 0 0 0 2px ${stage.accent}30` }
            : undefined
        }
      >
        {items.length === 0 ? (
          <div
            className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors ${
              isOver ? "border-slate-300 bg-white/60" : "border-slate-200"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: `${stage.accent}15`, color: stage.accent }}
            >
              0
            </div>
            <p className="text-[11px] text-slate-400">No contacts</p>
          </div>
        ) : (
          items.map((item) => (
            <KanbanCard key={item.conversation.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};
