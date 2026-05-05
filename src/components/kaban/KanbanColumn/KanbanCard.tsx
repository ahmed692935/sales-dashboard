import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { MessageSquare, Clock, GripVertical, User, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ConversationWithContact } from "../../../services/whatsapp.service";

interface KanbanCardProps {
  item: ConversationWithContact;
  isDragOverlay?: boolean;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
}

export const KanbanCard = ({ item, isDragOverlay }: KanbanCardProps) => {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.conversation.id,
      data: { item },
    });

  const style = { transform: CSS.Translate.toString(transform) };

  const name = item.contact?.name ?? item.contact?.phone ?? "Unknown";
  const phone = item.contact?.phone ?? "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border select-none transition-all duration-150 overflow-hidden ${
        isDragOverlay
          ? "border-(--primary) shadow-2xl shadow-(primary)/15 rotate-1 scale-[1.02]"
          : isDragging
            ? "opacity-40 border-slate-200"
            : "border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm"
      }`}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 truncate">{name}</p>
            {phone && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Phone size={10} /> {phone}
              </p>
            )}
          </div>
          <button
            {...listeners}
            {...attributes}
            className="text-black hover:text-slate-500 shrink-0 cursor-grab active:cursor-grabbing mt-0.5 transition-colors"
          >
            <GripVertical size={18} />
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="border-t border-slate-100">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User size={12} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-600 font-medium">Assigned</span>
          </div>
          <span className="text-xs text-slate-500 truncate max-w-25">
            {item.assignedUser?.name ?? (
              <span className="text-slate-300">—</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare size={12} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-600 font-medium">Channel</span>
          </div>
          <span className="text-[11px] bg-teal-50 text-teal-600 font-semibold px-2 py-0.5 rounded-full">
            whatsapp
          </span>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-600 font-medium">Status</span>
          </div>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
              item.conversation.status === "open"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {item.conversation.status}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Clock size={10} />
          Last contacted: {timeAgo(item.conversation.lastMessageAt)}
        </span>
        <button
          onClick={() => navigate(`/inbox?chat_id=${item.conversation.id}`)}
          className="text-slate-400 hover:text-primary transition-colors"
          title="Open in Inbox"
        >
          <MessageSquare size={13} />
        </button>
      </div>
    </div>
  );
};
