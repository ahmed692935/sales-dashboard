import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { useStages } from "../../../hooks/useStages";

export interface Stage {
  id: string;
  name: string;
  slug: string;
  color: string;
  order: number;
}

interface StageDropdownProps {
  value: string | null;
  onSelect: (stageId: string | null) => void;
  disabled?: boolean;
}

export const StageDropdown = ({
  value,
  onSelect,
  disabled,
}: StageDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: stages = [] } = useStages();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const selected = stages.find((s: Stage) => s.id === value) ?? null;

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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selected ? (
          <>
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: selected.color }}
            />

            <span className="font-semibold" style={{ color: selected.color }}>
              {selected.name}
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
          {stages.map((stage: Stage) => (
            <button
              key={stage.id}
              onClick={() => {
                onSelect(stage.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors hover:bg-slate-50 ${
                value === stage.id ? "font-semibold" : "text-slate-700"
              }`}
              style={{
                color: value === stage.id ? stage.color : undefined,
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: stage.color }}
              />

              <span className="flex-1 text-left">{stage.name}</span>

              {value === stage.id && <Check size={12} className="shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
