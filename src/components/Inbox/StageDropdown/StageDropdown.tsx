import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

export type Stage =
  | "new_lead"
  | "contacted"
  | "proposal_sent"
  | "application_submitted"
  | "won"
  | "lost";

export const STAGES: {
  id: Stage;
  label: string;
  color: string;
  dot: string;
}[] = [
  {
    id: "new_lead",
    label: "New Lead",
    color: "text-violet-600",
    dot: "bg-violet-500",
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "text-blue-600",
    dot: "bg-blue-500",
  },
  {
    id: "proposal_sent",
    label: "Proposal Sent",
    color: "text-indigo-600",
    dot: "bg-indigo-500",
  },
  {
    id: "application_submitted",
    label: "Application Submitted",
    color: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  { id: "won", label: "Won", color: "text-teal-600", dot: "bg-teal-500" },
  { id: "lost", label: "Lost", color: "text-red-600", dot: "bg-red-500" },
];

interface StageDropdownProps {
  value: Stage | null;
  onSelect: (stage: Stage | null) => void;
  disabled?: boolean;
}

export const StageDropdown = ({
  value,
  onSelect,
  disabled,
}: StageDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = STAGES.find((s) => s.id === value) ?? null;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selected ? (
          <>
            <div className={`w-2 h-2 rounded-full shrink-0 ${selected.dot}`} />
            <span className={`font-semibold ${selected.color}`}>
              {selected.label}
            </span>
            <X
              size={11}
              className="text-slate-400 hover:text-red-400 shrink-0"
              onClick={handleClear}
            />
          </>
        ) : (
          <>
            Select Stage
            <ChevronDown size={11} className="shrink-0" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => {
                onSelect(stage.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors hover:bg-slate-50 ${
                value === stage.id
                  ? stage.color + " font-semibold"
                  : "text-slate-700"
              }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${stage.dot}`} />
              <span className="flex-1 text-left">{stage.label}</span>
              {value === stage.id && <Check size={12} className="shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
