import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EndpointType = "with" | "without";

interface FormState {
  flowName: string;
  category: string;
  endpointType: EndpointType;
  step1Option: string;
  step2Option: string;
}

interface CreateFlowModalProps {
  onClose: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories = [
  "Sign Up",
  "Lead Generation",
  "Customer Support",
  "Onboarding",
  "Re-engagement",
];

const step1Options = [
  "Default",
  "Collect Purchase Interest",
  "Give Feedback",
  "Send A Survey",
  "Customer Support",
];

const step2Options = [
  "Get leads for a pre-approved loan/credit card",
  "Provide insurance quote",
  "Capture interest for a personalised offer",
  "Account sign-in/sign-up",
  "Appointment booking",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const RadioOption = ({
  label,
  value,
  selected,
  //   onChange,
}: {
  label: string;
  value: string;
  selected: string;
  onChange: (v: string) => void;
}) => (
  <label className="flex items-center gap-3 cursor-pointer group py-0.5">
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        selected === value
          ? "border-violet-600"
          : "border-slate-300 group-hover:border-slate-400"
      }`}
    >
      {selected === value && (
        <div className="w-2 h-2 rounded-full bg-violet-600" />
      )}
    </div>
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────

const CreateFlowModal = ({ onClose }: CreateFlowModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    flowName: "",
    category: "",
    endpointType: "with",
    step1Option: "Customer Support",
    step2Option: "",
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const currentOptions = step === 1 ? step1Options : step2Options;
  const currentOptionKey: keyof FormState =
    step === 1 ? "step1Option" : "step2Option";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            Create Flow
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — Form */}
          <div className="flex-1 px-7 py-5 flex flex-col gap-5 overflow-y-auto">
            {/* Row 1: Flow Name + Category dropdown */}
            <div className="flex gap-4">
              {/* Flow Name */}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Flow Name{" "}
                  {step === 2 && (
                    <span className="font-normal text-slate-400">Name</span>
                  )}
                </label>
                <input
                  type="text"
                  value={form.flowName}
                  onChange={(e) => update("flowName", e.target.value)}
                  placeholder="Ex: Boost Sales"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>

              {/* Category dropdown */}
              <div className="w-44 relative">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setCategoryOpen((v) => !v)}
                  className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 bg-white hover:border-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
                >
                  <span className={form.category ? "text-slate-700" : ""}>
                    {form.category || "Category Name"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {categoryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          update("category", c);
                          setCategoryOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Category toggle (With / Without Endpoints) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Category
              </label>
              <div className="flex gap-3">
                {(["with", "without"] as EndpointType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => update("endpointType", type)}
                    className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                      form.endpointType === type
                        ? "border-violet-500 text-violet-700 bg-white shadow-sm ring-1 ring-violet-300"
                        : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                    }`}
                  >
                    {type === "with" ? "With Endpoints" : "Without Endpoints"}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Radio options */}
            <div className="flex flex-col gap-3">
              {currentOptions.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  value={opt}
                  selected={form[currentOptionKey] as string}
                  onChange={(v) => update(currentOptionKey, v)}
                />
              ))}
            </div>
          </div>

          {/* Right — Flow Preview */}
          <div className="w-44 shrink-0 border-l border-slate-100 flex flex-col items-center justify-start pt-6 px-4">
            <p className="text-xs font-semibold text-slate-500">Flow Preview</p>
            <div className="mt-4 w-full flex-1 bg-slate-50 rounded-xl border border-slate-100 min-h-[180px]" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-slate-100">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFlowModal;
