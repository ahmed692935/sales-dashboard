import type { Message } from "../../../services/whatsapp.service";

const SYSTEM_TYPES = new Set([
  "system",
  "stage_change",
  "assignment",
  "status_change",
  "note",
]);

export function isSystemMessage(msg: Message): boolean {
  return SYSTEM_TYPES.has(msg.type);
}

export function formatDateLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return "Today";
  if (msgDate.getTime() === yesterday.getTime()) return "Yesterday";

  const diffDays = Math.floor((today.getTime() - msgDate.getTime()) / 86400000);
  if (diffDays < 7)
    return date.toLocaleDateString("en-US", { weekday: "long" });

  if (date.getFullYear() === now.getFullYear())
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const DateSeparator = ({ date }: { date: string }) => (
  <div className="flex items-center justify-center my-3">
    <span className="px-4 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-violet-600 shadow-sm">
      {date}
    </span>
  </div>
);

export const SystemMessageBubble = ({ msg }: { msg: Message }) => (
  <div className="flex justify-center my-1.5">
    <div className="max-w-md px-5 py-1.5 rounded-full bg-white border border-violet-100">
      <p className="text-[11px] text-primary font-medium text-center leading-relaxed">
        {msg.body}
      </p>
    </div>
  </div>
);
