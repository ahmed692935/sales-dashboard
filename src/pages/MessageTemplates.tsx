import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  ChevronDown,
  Bold,
  Italic,
  Strikethrough,
  Code2,
  Smile,
  Info,
  Trash2,
  Image as ImageIcon,
  Play,
  Globe,
  Phone,
  PhoneCall,
  GitBranch,
  Tag,
  FileText,
  Star,
  ChevronLeft,
  CheckSquare,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ActionType =
  | "Complete flow"
  | "Visit website"
  | "Call on WhatsApp"
  | "Call Phone Number"
  | "Copy offer code";
type ButtonIconType = "Default" | "Document" | "Promotion" | "Review";
interface CTARow {
  id: string;
  actionType: ActionType;
  buttonIcon: ButtonIconType;
  buttonText: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ACTION_TYPES: { value: ActionType; icon: React.ElementType }[] = [
  { value: "Call on WhatsApp", icon: PhoneCall },
  { value: "Call Phone Number", icon: Phone },
  { value: "Copy offer code", icon: Tag },
  { value: "Visit website", icon: Globe },
  { value: "Complete flow", icon: GitBranch },
];
const BUTTON_ICONS: { value: ButtonIconType; icon: React.ElementType }[] = [
  { value: "Default", icon: CheckSquare },
  { value: "Document", icon: FileText },
  { value: "Promotion", icon: Tag },
  { value: "Review", icon: Star },
];
const ADD_BUTTON_OPTIONS: {
  value: string;
  icon: React.ElementType;
  note?: string;
}[] = [
  { value: "Custom", icon: Smile },
  { value: "Visit website", icon: Globe },
  { value: "Call on WhatsApp", icon: PhoneCall },
  { value: "Call Phone Number", icon: Phone },
  { value: "Complete flow", icon: GitBranch, note: "1 button maximum" },
  { value: "Copy offer code", icon: Tag },
];

let idCounter = 0;
const uid = () => `cta-${++idCounter}`;

// ─── Format helpers ───────────────────────────────────────────────────────────
function applyFormat(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  onChange: (v: string) => void,
  marker: string,
) {
  const el = ref.current;
  if (!el) return;
  const s = el.selectionStart,
    e = el.selectionEnd;
  const selected = value.slice(s, e);
  const newVal = selected.length
    ? value.slice(0, s) + `${marker}${selected}${marker}` + value.slice(e)
    : value.slice(0, s) + `${marker}text${marker}` + value.slice(s);
  onChange(newVal);
  requestAnimationFrame(() => el.focus());
}
function addVariable(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  onChange: (v: string) => void,
) {
  const el = ref.current;
  if (!el) return;
  const pos = el.selectionStart;
  onChange(value.slice(0, pos) + "{{variable}}" + value.slice(pos));
  requestAnimationFrame(() => el.focus());
}

// ─── Fixed-position Dropdown ──────────────────────────────────────────────────
// Uses getBoundingClientRect so it renders outside any overflow:hidden parent.

interface FixedDropdownProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  label: React.ReactNode;
  children: React.ReactNode;
  minWidth?: number;
  buttonClassName?: string;
}

const FixedDropdown = ({
  open,
  onToggle,
  onClose,
  label,
  children,
  minWidth = 160,
  buttonClassName = "",
}: FixedDropdownProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const reposition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const menuH = menuRef.current?.offsetHeight ?? 240;
    // open upward if not enough space below
    const top = r.bottom + menuH > viewportH ? r.top - menuH - 4 : r.bottom + 4;
    setPos({ top, left: r.left, width: Math.max(r.width, minWidth) });
  }, [minWidth]);

  useEffect(() => {
    if (!open) return;
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      )
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors rounded-lg px-3 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 whitespace-nowrap ${buttonClassName}`}
      >
        {label}
        <ChevronDown
          size={11}
          className={`transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && pos && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            minWidth: pos.width,
            zIndex: 9999,
          }}
          className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden py-1"
        >
          {children}
        </div>
      )}
    </>
  );
};

// ─── CTA Row ──────────────────────────────────────────────────────────────────
const CTARowComp = ({
  row,
  onChange,
  onRemove,
}: {
  row: CTARow;
  onChange: (id: string, p: Partial<CTARow>) => void;
  onRemove: (id: string) => void;
}) => {
  const [actionOpen, setActionOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-end gap-3 py-3 border-b border-slate-100 last:border-0">
      {/* Type of action */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
          Type of action
        </span>
        <FixedDropdown
          open={actionOpen}
          onToggle={() => {
            setActionOpen((v) => !v);
            setIconOpen(false);
          }}
          onClose={() => setActionOpen(false)}
          label={row.actionType}
          minWidth={200}
        >
          {ACTION_TYPES.map(({ value, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                onChange(row.id, { actionType: value });
                setActionOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors ${
                row.actionType === value
                  ? "text-violet-700 bg-violet-50 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${row.actionType === value ? "border-violet-600" : "border-slate-300"}`}
              >
                {row.actionType === value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                )}
              </div>
              <Icon size={13} className="text-slate-400 shrink-0" />
              {value}
            </button>
          ))}
        </FixedDropdown>
      </div>

      {/* Button icon */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
          Button icon
        </span>
        <FixedDropdown
          open={iconOpen}
          onToggle={() => {
            setIconOpen((v) => !v);
            setActionOpen(false);
          }}
          onClose={() => setIconOpen(false)}
          label={
            <span className="flex items-center gap-1.5">
              {(() => {
                const f = BUTTON_ICONS.find((b) => b.value === row.buttonIcon);
                return f ? <f.icon size={12} /> : null;
              })()}
              {row.buttonIcon}
            </span>
          }
          minWidth={170}
        >
          {BUTTON_ICONS.map(({ value, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                onChange(row.id, { buttonIcon: value });
                setIconOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors ${
                row.buttonIcon === value
                  ? "text-violet-700 bg-violet-50 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${row.buttonIcon === value ? "border-violet-600" : "border-slate-300"}`}
              >
                {row.buttonIcon === value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                )}
              </div>
              <Icon size={13} className="text-slate-400 shrink-0" />
              {value}
            </button>
          ))}
        </FixedDropdown>
      </div>

      {/* Button text */}
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <span className="text-[10px] font-semibold text-slate-500">
          Button text
        </span>
        <div className="relative">
          <input
            type="text"
            value={row.buttonText}
            maxLength={25}
            onChange={(e) => onChange(row.id, { buttonText: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors pr-12"
            placeholder="Button label…"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
            {row.buttonText.length}/25
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(row.id)}
        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 mb-0.5"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
};

// ─── Template Preview ─────────────────────────────────────────────────────────
const TemplatePreview = ({
  body,
  footer,
  ctaRows,
}: {
  body: string;
  footer: string;
  ctaRows: CTARow[];
}) => {
  const renderBody = (text: string) =>
    text
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/~(.+?)~/g, "<s>$1</s>")
      .replace(/{{(.+?)}}/g, '<span class="text-violet-500">{{$1}}</span>');

  return (
    <div className="bg-[#e5ddd5] rounded-xl p-3 flex flex-col gap-2">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="w-full h-24 bg-slate-200 flex items-center justify-center">
          <ImageIcon size={24} className="text-slate-400" />
        </div>
        <div className="px-3 py-2">
          {body ? (
            <p
              className="text-[11px] text-slate-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: renderBody(
                  body.length > 160 ? body.slice(0, 160) + "…" : body,
                ),
              }}
            />
          ) : (
            <p className="text-[11px] text-slate-300 italic">
              Body text will appear here…
            </p>
          )}
          {footer && (
            <p className="text-[10px] text-slate-400 mt-1">{footer}</p>
          )}
          <p className="text-[9px] text-slate-400 text-right mt-1">11:23</p>
        </div>
        {ctaRows
          .filter((r) => r.buttonText)
          .map((r) => {
            const Icon = BUTTON_ICONS.find(
              (b) => b.value === r.buttonIcon,
            )?.icon;
            return (
              <div key={r.id}>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-center gap-1.5 py-2">
                  {Icon && <Icon size={11} className="text-violet-500" />}
                  <span className="text-[11px] font-semibold text-violet-600">
                    {r.buttonText}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MessageTemplates = () => {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState("Hello");
  const [footer, setFooter] = useState("");
  const [ctaRows, setCtaRows] = useState<CTARow[]>([
    {
      id: uid(),
      actionType: "Complete flow",
      buttonIcon: "Default",
      buttonText: "View Flow",
    },
  ]);
  const [addBtnOpen, setAddBtnOpen] = useState(false);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const [addBtnPos, setAddBtnPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  // position the + Add button dropdown
  useEffect(() => {
    if (!addBtnOpen) return;
    const btn = addBtnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setAddBtnPos({
      top: r.bottom + 4,
      left: r.left,
      width: Math.max(r.width, 208),
    });

    const close = (e: MouseEvent) => {
      if (
        !addBtnRef.current?.contains(e.target as Node) &&
        !addMenuRef.current?.contains(e.target as Node)
      )
        setAddBtnOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [addBtnOpen]);

  const addCTARow = (actionType: string) => {
    setCtaRows((prev) => [
      ...prev,
      {
        id: uid(),
        actionType: actionType as ActionType,
        buttonIcon: "Default",
        buttonText: "",
      },
    ]);
    setAddBtnOpen(false);
  };
  const updateCTARow = (id: string, patch: Partial<CTARow>) =>
    setCtaRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  const removeCTARow = (id: string) =>
    setCtaRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="flex flex-col lg:flex-row min-h-full bg-slate-50">
      {/* ── Left form ────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 py-6">
        <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-violet-600 transition-colors mb-5 w-fit">
          <ChevronLeft size={14} /> Back
        </button>

        <div className="flex flex-col gap-5 max-w-4xl w-full">
          {/* Body card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Body</span>
            </div>
            <div className="relative">
              <textarea
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, 1024))}
                rows={5}
                className="w-full px-4 pt-3 pb-6 text-sm text-slate-700 placeholder-slate-300 focus:outline-none resize-y bg-white min-h-[100px] rounded-b-none"
                placeholder="Enter your message body…"
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 pointer-events-none">
                {body.length}/1024
              </span>
            </div>
            {/* Format toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-t border-slate-100 bg-slate-50/60 flex-wrap">
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <Smile size={14} />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                type="button"
                title="Bold (*text*)"
                onClick={() => applyFormat(bodyRef, body, setBody, "*")}
                className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <Bold size={13} />
              </button>
              <button
                type="button"
                title="Italic (_text_)"
                onClick={() => applyFormat(bodyRef, body, setBody, "_")}
                className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <Italic size={13} />
              </button>
              <button
                type="button"
                title="Strikethrough (~text~)"
                onClick={() => applyFormat(bodyRef, body, setBody, "~")}
                className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <Strikethrough size={13} />
              </button>
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <Code2 size={13} />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                type="button"
                onClick={() => addVariable(bodyRef, body, setBody)}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-violet-600 transition-colors px-1"
              >
                <Plus size={12} /> Add variable
              </button>
              <button
                type="button"
                className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Info size={13} />
              </button>
            </div>
          </div>

          {/* Footer card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700">
                Footer
              </span>
              <span className="text-[10px] text-slate-400">· Optional</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={footer}
                onChange={(e) => setFooter(e.target.value.slice(0, 60))}
                placeholder="Add a short line of text to the bottom of your message in English"
                className="w-full px-4 py-3 text-xs text-slate-700 placeholder-slate-300 focus:outline-none bg-white pr-14 rounded-b-xl"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                {footer.length}/60
              </span>
            </div>
          </div>

          {/* Buttons card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700">
                Buttons
              </span>
              <span className="text-[10px] text-slate-400">· Optional</span>
            </div>
            <div className="px-4 py-3">
              <button
                ref={addBtnRef}
                type="button"
                onClick={() => setAddBtnOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
              >
                <Plus size={13} /> Add button
                <ChevronDown
                  size={11}
                  className={`ml-0.5 transition-transform ${addBtnOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Fixed-position dropdown */}
              {addBtnOpen && addBtnPos && (
                <div
                  ref={addMenuRef}
                  style={{
                    position: "fixed",
                    top: addBtnPos.top,
                    left: addBtnPos.left,
                    minWidth: addBtnPos.width,
                    zIndex: 9999,
                  }}
                  className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden py-1"
                >
                  {ADD_BUTTON_OPTIONS.map(({ value, icon: Icon, note }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => addCTARow(value)}
                      className="w-full flex items-start gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                    >
                      <Icon
                        size={14}
                        className="shrink-0 mt-0.5 text-slate-400"
                      />
                      <div className="text-left">
                        <p className="font-medium">{value}</p>
                        {note && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {note}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Call to action card */}
          {ctaRows.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-700">
                  Call to action
                </span>
                <span className="text-[10px] text-slate-400">· Optional</span>
              </div>
              <div className="px-4 py-2">
                {ctaRows.map((row) => (
                  <CTARowComp
                    key={row.id}
                    row={row}
                    onChange={updateCTARow}
                    onRemove={removeCTARow}
                  />
                ))}
                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Plus size={12} /> Create new
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <CheckSquare size={12} /> Use existing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 mt-8 max-w-2xl">
          <button
            type="button"
            className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            className="px-5 py-2 rounded-lg bg-slate-200 text-sm font-medium text-slate-400 cursor-not-allowed"
          >
            Submit for Review
          </button>
        </div>
      </div>

      {/* ── Right preview ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-90 shrink-0 border-l border-slate-200 bg-white flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-10">
          <p className="text-xs font-semibold text-slate-700">
            Template preview
          </p>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <Play size={11} className="ml-0.5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <TemplatePreview body={body} footer={footer} ctaRows={ctaRows} />
          <p className="text-[10px] text-slate-400 mt-3 leading-relaxed text-center">
            Select text then click <strong>B</strong> / <em>I</em> / <s>S</s> to
            format. Use <span className="text-violet-500">+ Add variable</span>{" "}
            to insert variables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageTemplates;
