import { useDroppable } from "@dnd-kit/core";
import type { ConversationWithContact } from "../../../services/whatsapp.service";
import type { Stage } from "../../Inbox/StageDropdown/StageDropdown";
import { KanbanCard } from "./KanbanCard";

interface StageConfig {
  id: Stage;
  label: string;
  accent: string;
  glow: string;
}

interface KanbanColumnProps {
  stage: StageConfig;
  items: ConversationWithContact[];
}

export const KanbanColumn = ({ stage, items }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div className="flex flex-col w-[260px] shrink-0">
      {/* Header */}
      <div
        className="rounded-t-xl px-4 py-3 flex items-center justify-between"
        style={{ background: stage.accent }}
      >
        <span className="text-xs font-bold text-white uppercase tracking-widest">
          {stage.label}
        </span>
        <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
          {items.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[520px] rounded-b-xl border border-t-0 p-2.5 flex flex-col gap-2.5 transition-colors duration-150 ${
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
