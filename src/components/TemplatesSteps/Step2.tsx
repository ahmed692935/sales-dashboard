import { useState, useRef } from "react";
import {
  ChevronLeft,
  Plus,
  ChevronDown,
  ChevronUp,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Trash2,
  Info,
} from "lucide-react";
import type { TemplateFormData } from "./Step1";

interface Step2Props {
  formData: TemplateFormData;
  onBack: () => void;
  onCancel: () => void;
  onCreate: () => void;
}

type CallToActionOption =
  | "Copy Offer Code"
  | "Visit Website"
  | "Call Phone Number"
  | "None";

const CTA_OPTIONS: CallToActionOption[] = [
  "Copy Offer Code",
  "Visit Website",
  "Call Phone Number",
  "None",
];

// ─── applyFormat ──────────────────────────────────────────────────────────────
// Wraps the currently selected text in the textarea with the given markers.
// If nothing is selected, inserts the markers at cursor position.

function applyFormat(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  onChange: (v: string) => void,
  marker: string,
) {
  const el = ref.current;
  if (!el) return;

  const start = el.selectionStart;
  const end = el.selectionEnd;

  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);

  let newValue: string;
  let newStart: number;
  let newEnd: number;

  if (selected.length > 0) {
    // If already wrapped — toggle off
    const wrapped = `${marker}${selected}${marker}`;
    if (before.endsWith(marker) && after.startsWith(marker)) {
      // unwrap
      newValue =
        before.slice(0, -marker.length) + selected + after.slice(marker.length);
      newStart = start - marker.length;
      newEnd = end - marker.length;
    } else {
      newValue = before + wrapped + after;
      newStart = start + marker.length;
      newEnd = end + marker.length;
    }
  } else {
    // No selection — insert placeholder
    const placeholder = `${marker}text${marker}`;
    newValue = before + placeholder + after;
    newStart = start + marker.length;
    newEnd = start + marker.length + 4; // "text".length
  }

  onChange(newValue);

  // Restore selection after React re-render
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(newStart, newEnd);
  });
}

// ─── addVariable ─────────────────────────────────────────────────────────────

function addVariable(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  onChange: (v: string) => void,
) {
  const el = ref.current;
  if (!el) return;
  const pos = el.selectionStart;
  const varText = `{{variable}}`;
  const newValue = value.slice(0, pos) + varText + value.slice(pos);
  onChange(newValue);
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(pos + varText.length, pos + varText.length);
  });
}

// ─── SectionBlock ─────────────────────────────────────────────────────────────

interface SectionBlockProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  showFormatToolbar?: boolean;
  showCounter?: boolean;
  maxLength?: number;
}

const SectionBlock = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
  showFormatToolbar = false,
  showCounter = false,
  maxLength,
}: SectionBlockProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        {!showFormatToolbar && (
          <button
            type="button"
            onClick={() => addVariable(textareaRef, value, onChange)}
            className="flex items-center gap-1 text-[11px] text-slate-800 hover:text-violet-600 transition-colors"
          >
            <Plus size={12} /> Add Variabel
          </button>
        )}
      </div>

      {/* Format toolbar — only for Body */}
      {showFormatToolbar && (
        <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200 bg-slate-50/50 flex-wrap">
          {/* Up/Down (move cursor up/down — cosmetic) */}
          <div className="flex flex-col mr-1">
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600"
              onClick={() => {
                const el = textareaRef.current;
                if (!el) return;
                const pos = Math.max(0, el.selectionStart - 1);
                requestAnimationFrame(() => {
                  el.focus();
                  el.setSelectionRange(pos, pos);
                });
              }}
            >
              <ChevronUp size={10} />
            </button>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600"
              onClick={() => {
                const el = textareaRef.current;
                if (!el) return;
                const pos = Math.min(value.length, el.selectionStart + 1);
                requestAnimationFrame(() => {
                  el.focus();
                  el.setSelectionRange(pos, pos);
                });
              }}
            >
              <ChevronDown size={10} />
            </button>
          </div>

          {/* Bold → *text* */}
          <button
            type="button"
            title="Bold (*text*)"
            onClick={() => applyFormat(textareaRef, value, onChange, "*")}
            className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <Bold size={13} />
          </button>

          {/* Italic → _text_ */}
          <button
            type="button"
            title="Italic (_text_)"
            onClick={() => applyFormat(textareaRef, value, onChange, "_")}
            className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <Italic size={13} />
          </button>

          {/* Underline → __text__ (double underscore) */}
          <button
            type="button"
            title="Underline (__text__)"
            onClick={() => applyFormat(textareaRef, value, onChange, "__")}
            className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <Underline size={13} />
          </button>

          {/* Strikethrough → ~text~ */}
          <button
            type="button"
            title="Strikethrough (~text~)"
            onClick={() => applyFormat(textareaRef, value, onChange, "~")}
            className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <Strikethrough size={13} />
          </button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          {/* Add Variable */}
          <button
            type="button"
            onClick={() => addVariable(textareaRef, value, onChange)}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-violet-600 transition-colors"
          >
            <Plus size={12} /> Add Variabel
          </button>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-4 py-3 text-xs text-slate-700 placeholder-slate-300 focus:outline-none resize-none bg-white"
      />

      {showCounter && maxLength && (
        <div className="px-4 pb-2 text-right">
          <span className="text-[10px] text-slate-400">
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Step 2 ───────────────────────────────────────────────────────────────────

const Step2 = ({ onBack, onCancel, onCreate }: Step2Props) => {
  const [header, setHeader] = useState(
    "Lorem ipsum dolor sit amet consectetur.",
  );
  const [body, setBody] = useState(
    "Lorem ipsum dolor sit amet consectetur. Amet sed nullam vitae purus nisi rutrum pellentesque ipsum aliquam. Neque nullam amet egestas morbi eget ultricies aliquam quisque.",
  );
  const [footer, setFooter] = useState(
    "Lorem ipsum dolor sit amet consectetur.",
  );
  const [ctaOption, setCtaOption] =
    useState<CallToActionOption>("Copy Offer Code");
  const [ctaDropdownOpen, setCtaDropdownOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Copy Offer Code");
  const [offerCode, setOfferCode] = useState("");

  // ── Render body with WhatsApp-style markers highlighted ─────────────────
  const renderPreviewBody = (text: string) => {
    return text
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/~(.+?)~/g, "<s>$1</s>")
      .replace(/{{(.+?)}}/g, '<span class="text-violet-500">{{$1}}</span>');
  };

  return (
    <div className="flex min-h-full bg-slate-50">
      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 py-5 overflow-y-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-600 transition-colors mb-4 w-fit"
        >
          <ChevronLeft size={14} /> Back
        </button>

        <h2 className="text-base font-bold text-slate-800 mb-5">
          Set up Template
        </h2>

        <div className="flex flex-col gap-4 max-w-3xl">
          <SectionBlock
            label="Header"
            value={header}
            onChange={setHeader}
            placeholder="Enter header text..."
            rows={2}
          />
          <SectionBlock
            label="Body"
            value={body}
            onChange={setBody}
            placeholder="Enter body text..."
            rows={5}
            showFormatToolbar
            showCounter
            maxLength={1024}
          />
          <SectionBlock
            label="Footer"
            value={footer}
            onChange={setFooter}
            placeholder="Enter footer text..."
            rows={2}
          />

          {/* Call to Action */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Call to Action
              </span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Optional
              </span>
              <button className="text-slate-400 hover:text-slate-600">
                <Info size={13} />
              </button>
            </div>

            <div className="relative mb-3">
              <button
                onClick={() => setCtaDropdownOpen((v) => !v)}
                className="w-full sm:w-80 flex items-center justify-between gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                {ctaOption}
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${ctaDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {ctaDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden w-full sm:w-80">
                  {CTA_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setCtaOption(opt);
                        setCtaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${ctaOption === opt ? "text-violet-700 bg-violet-50 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {ctaOption !== "None" && (
              <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-[140px]">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                    Button Text
                  </p>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Copy Offer Code"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                    {ctaOption === "Visit Website"
                      ? "URL"
                      : ctaOption === "Call Phone Number"
                        ? "Phone Number"
                        : "Offer Code"}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={offerCode}
                      onChange={(e) => setOfferCode(e.target.value)}
                      placeholder="Enter Sample"
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
                    />
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 mt-8 max-w-3xl">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Create
          </button>
        </div>
      </div>

      {/* ── Right Template Preview panel ────────────────────────────────── */}
      <div className="hidden lg:flex w-80 shrink-0 border-l border-slate-200 bg-white flex-col px-4 pt-6 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 mb-4">
          Template Preview
        </p>
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col gap-2">
          {header && (
            <p className="text-[11px] font-bold text-slate-800 leading-relaxed">
              {header}
            </p>
          )}
          {body && (
            <p
              className="text-[11px] text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: renderPreviewBody(
                  body.length > 200 ? body.slice(0, 200) + "..." : body,
                ),
              }}
            />
          )}
          {footer && (
            <p className="text-[10px] text-slate-400 mt-1">{footer}</p>
          )}
          {ctaOption !== "None" && buttonText && (
            <button className="w-full mt-1 py-1.5 rounded-lg bg-violet-100 text-violet-700 text-[11px] font-semibold">
              {buttonText}
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
          Tip: Select text then click <strong>B</strong> / <em>I</em> / <s>S</s>{" "}
          to apply formatting. Use{" "}
          <span className="text-violet-500">+ Add Variabel</span> to insert a
          variable.
        </p>
      </div>
    </div>
  );
};

export default Step2;
