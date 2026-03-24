// import { useState } from "react";
// import { ChevronDown, X } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type EndpointType = "with" | "without";

// interface FormState {
//   flowName: string;
//   category: string;
//   endpointType: EndpointType;
//   step1Option: string;
//   step2Option: string;
// }

// interface CreateFlowModalProps {
//   onClose: () => void;
// }

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const categories = [
//   "Sign Up",
//   "Lead Generation",
//   "Customer Support",
//   "Onboarding",
//   "Re-engagement",
// ];

// const step1Options = [
//   "Default",
//   "Collect Purchase Interest",
//   "Give Feedback",
//   "Send A Survey",
//   "Customer Support",
// ];

// const step2Options = [
//   "Get leads for a pre-approved loan/credit card",
//   "Provide insurance quote",
//   "Capture interest for a personalised offer",
//   "Account sign-in/sign-up",
//   "Appointment booking",
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const RadioOption = ({
//   label,
//   value,
//   selected,
//   //   onChange,
// }: {
//   label: string;
//   value: string;
//   selected: string;
//   onChange: (v: string) => void;
// }) => (
//   <label className="flex items-center gap-3 cursor-pointer group py-0.5">
//     <div
//       className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
//         selected === value
//           ? "border-violet-600"
//           : "border-slate-300 group-hover:border-slate-400"
//       }`}
//     >
//       {selected === value && (
//         <div className="w-2 h-2 rounded-full bg-violet-600" />
//       )}
//     </div>
//     <span className="text-sm text-slate-700">{label}</span>
//   </label>
// );

// // ─── Main Modal ───────────────────────────────────────────────────────────────

// const CreateFlowModal = ({ onClose }: CreateFlowModalProps) => {
//   const [step, setStep] = useState<1 | 2>(1);
//   const [categoryOpen, setCategoryOpen] = useState(false);
//   const [form, setForm] = useState<FormState>({
//     flowName: "",
//     category: "",
//     endpointType: "with",
//     step1Option: "Customer Support",
//     step2Option: "",
//   });

//   const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   const currentOptions = step === 1 ? step1Options : step2Options;
//   const currentOptionKey: keyof FormState =
//     step === 1 ? "step1Option" : "step2Option";

//   return (
//     /* Backdrop */
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       {/* Modal */}
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
//           <h2 className="text-base font-semibold text-slate-800">
//             Create Flow
//           </h2>
//           <button
//             onClick={onClose}
//             className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
//           >
//             <X size={15} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Left — Form */}
//           <div className="flex-1 px-7 py-5 flex flex-col gap-5 overflow-y-auto">
//             {/* Row 1: Flow Name + Category dropdown */}
//             <div className="flex gap-4">
//               {/* Flow Name */}
//               <div className="flex-1">
//                 <label className="block text-xs font-semibold text-slate-600 mb-1.5">
//                   Flow Name{" "}
//                   {step === 2 && (
//                     <span className="font-normal text-slate-400">Name</span>
//                   )}
//                 </label>
//                 <input
//                   type="text"
//                   value={form.flowName}
//                   onChange={(e) => update("flowName", e.target.value)}
//                   placeholder="Ex: Boost Sales"
//                   className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
//                 />
//               </div>

//               {/* Category dropdown */}
//               <div className="w-44 relative">
//                 <label className="block text-xs font-semibold text-slate-600 mb-1.5">
//                   Category
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setCategoryOpen((v) => !v)}
//                   className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 bg-white hover:border-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
//                 >
//                   <span className={form.category ? "text-slate-700" : ""}>
//                     {form.category || "Category Name"}
//                   </span>
//                   <ChevronDown
//                     size={14}
//                     className={`text-slate-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {categoryOpen && (
//                   <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
//                     {categories.map((c) => (
//                       <button
//                         key={c}
//                         type="button"
//                         onClick={() => {
//                           update("category", c);
//                           setCategoryOpen(false);
//                         }}
//                         className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
//                       >
//                         {c}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Row 2: Category toggle (With / Without Endpoints) */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">
//                 Category
//               </label>
//               <div className="flex gap-3">
//                 {(["with", "without"] as EndpointType[]).map((type) => (
//                   <button
//                     key={type}
//                     type="button"
//                     onClick={() => update("endpointType", type)}
//                     className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
//                       form.endpointType === type
//                         ? "border-violet-500 text-violet-700 bg-white shadow-sm ring-1 ring-violet-300"
//                         : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
//                     }`}
//                   >
//                     {type === "with" ? "With Endpoints" : "Without Endpoints"}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Row 3: Radio options */}
//             <div className="flex flex-col gap-3">
//               {currentOptions.map((opt) => (
//                 <RadioOption
//                   key={opt}
//                   label={opt}
//                   value={opt}
//                   selected={form[currentOptionKey] as string}
//                   onChange={(v) => update(currentOptionKey, v)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Right — Flow Preview */}
//           <div className="w-44 shrink-0 border-l border-slate-100 flex flex-col items-center justify-start pt-6 px-4">
//             <p className="text-xs font-semibold text-slate-500">Flow Preview</p>
//             <div className="mt-4 w-full flex-1 bg-slate-50 rounded-xl border border-slate-100 min-h-[180px]" />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-slate-100">
//           {step === 1 ? (
//             <>
//               <button
//                 onClick={onClose}
//                 className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => setStep(2)}
//                 className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
//               >
//                 Next
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setStep(1)}
//                 className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={onClose}
//                 className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
//               >
//                 Close
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateFlowModal;

import { useState } from "react";
import { ChevronDown, X, MoreVertical, Settings } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EndpointType = "without" | "with";

interface FormState {
  flowName: string;
  category: string;
  endpointType: EndpointType;
  selectedOption: string;
}

interface CreateFlowModalProps {
  onClose: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Sign Up",
  "Lead Generation",
  "Customer Support",
  "Onboarding",
  "Re-engagement",
];

interface TemplateOption {
  value: string;
  label: string;
  subLabel?: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  { value: "Default", label: "Default" },
  {
    value: "Collect purchase interest",
    label: "Collect purchase interest",
    subLabel: "Full development guide available. More info",
  },
  { value: "Get feedback", label: "Get feedback" },
  { value: "Send a survey", label: "Send a survey" },
  { value: "Customer support", label: "Customer support" },
];

// ─── Flow Preview Components ──────────────────────────────────────────────────

// Shared phone shell
const PhoneShell = ({
  title,
  children,
  footerLabel = "Continue",
  footerGreen = false,
}: {
  title: string;
  children: React.ReactNode;
  footerLabel?: string;
  footerGreen?: boolean;
}) => (
  <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white flex flex-col">
    {/* top green dot (WA status bar) */}
    <div className="h-2 bg-slate-100 flex items-center px-2">
      <div className="w-2 h-2 rounded-full bg-green-500" />
    </div>
    {/* header */}
    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
      <button className="text-slate-400 hover:text-slate-600">
        <X size={13} />
      </button>
      <span className="text-[11px] font-semibold text-slate-700">{title}</span>
      <button className="text-slate-400 hover:text-slate-600">
        <MoreVertical size={13} />
      </button>
    </div>
    {/* body */}
    <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
      {children}
    </div>
    {/* footer */}
    <div className="px-3 pb-3 pt-1">
      <button
        className={`w-full py-2 rounded-lg text-[11px] font-semibold transition-colors ${
          footerGreen
            ? "bg-[#25d366] text-white"
            : "bg-slate-100 text-slate-400 cursor-default"
        }`}
      >
        {footerLabel}
      </button>
      <p className="text-center text-[9px] text-slate-400 mt-1.5">
        Managed by the business.{" "}
        <span className="text-green-600">Learn more</span>
      </p>
    </div>
  </div>
);

// Small input placeholder
const PreviewInput = ({ placeholder }: { placeholder: string }) => (
  <div className="border border-slate-200 rounded-md px-2.5 py-1.5">
    <span className="text-[10px] text-slate-300">{placeholder}</span>
  </div>
);

// Radio row
const PreviewRadio = ({ label }: { label: string }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className="text-[10px] text-slate-700">{label}</span>
    <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
  </div>
);

// Checkbox row
const PreviewCheckbox = ({ label }: { label: string }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className="text-[10px] text-slate-700">{label}</span>
    <div className="w-3.5 h-3.5 rounded border border-slate-300" />
  </div>
);

// ── 1. Customer Support ───────────────────────────────────────────────────────
const PreviewCustomerSupport = () => (
  <PhoneShell title="Get help" footerLabel="Done">
    <PreviewInput placeholder="Name" />
    <PreviewInput placeholder="Order number" />
    <p className="text-[10px] text-slate-500 font-medium mt-1">
      Choose a topic
    </p>
    <div className="flex flex-col gap-1 divide-y divide-slate-50">
      {[
        "Orders and payments",
        "Maintenance",
        "Delivery",
        "Returns",
        "Other",
      ].map((l) => (
        <PreviewRadio key={l} label={l} />
      ))}
    </div>
  </PhoneShell>
);

// ── 2. Send a survey ──────────────────────────────────────────────────────────
const PreviewSendSurvey = () => (
  <PhoneShell title="Question 1 of 3">
    <p className="text-[11px] font-bold text-slate-800 leading-snug">
      You've found the perfect deal, what do you do next?
    </p>
    <p className="text-[10px] text-slate-400">Choose all that apply:</p>
    <div className="flex flex-col gap-1 divide-y divide-slate-50">
      {[
        "Buy it right away",
        "Check reviews before buying",
        "Share it with friends + family",
        "Buy multiple, while its cheap",
        "None of the above",
      ].map((l) => (
        <PreviewCheckbox key={l} label={l} />
      ))}
    </div>
  </PhoneShell>
);

// ── 3. Get feedback ───────────────────────────────────────────────────────────
const PreviewGetFeedback = () => (
  <PhoneShell title="Feedback 1 of 2">
    <p className="text-[11px] font-bold text-slate-800 leading-snug">
      Would you recommend us to a friend?
    </p>
    <p className="text-[10px] text-slate-400">Choose one</p>
    <PreviewRadio label="Yes" />
    <PreviewRadio label="No" />
    <div className="h-px bg-slate-100 my-1" />
    <p className="text-[11px] font-bold text-slate-800">
      How could we do better?
    </p>
    <div className="border border-slate-200 rounded-md px-2.5 py-2 min-h-[40px] flex flex-col justify-between">
      <span className="text-[9px] text-slate-300">
        Leave a comment (optional)
      </span>
      <span className="text-[9px] text-slate-300 mt-2 self-end">0 / 600</span>
    </div>
  </PhoneShell>
);

// ── 4. Collect purchase interest ──────────────────────────────────────────────
const PreviewCollectPurchase = () => (
  <PhoneShell title="Join Now">
    <p className="text-[11px] font-bold text-slate-800 leading-snug">
      Get early access to our Mega Sales Day deals. Register now!
    </p>
    <PreviewInput placeholder="Name" />
    <PreviewInput placeholder="Email" />
    <div className="flex items-start gap-1.5 mt-1">
      <div className="w-3 h-3 rounded border border-slate-300 shrink-0 mt-0.5" />
      <p className="text-[9px] text-slate-600">
        I agree to the terms. <span className="text-green-600">Read more</span>
      </p>
    </div>
    <div className="flex items-start gap-1.5">
      <div className="w-3 h-3 rounded border border-slate-300 shrink-0 mt-0.5" />
      <p className="text-[9px] text-slate-600">
        (optional) Keep me up to date about offers and promotions
      </p>
    </div>
  </PhoneShell>
);

// ── 5. Default ────────────────────────────────────────────────────────────────
const PreviewDefault = () => (
  <PhoneShell title="Welcome" footerLabel="Complete" footerGreen>
    <div className="flex-1 flex flex-col gap-1.5 pt-2">
      <p className="text-[13px] font-bold text-slate-800">Hello World</p>
      <p className="text-[11px] text-slate-500">Let's start building things!</p>
    </div>
  </PhoneShell>
);

// ── Preview map ───────────────────────────────────────────────────────────────
const PREVIEW_MAP: Record<string, React.ReactNode> = {
  "Customer support": <PreviewCustomerSupport />,
  "Send a survey": <PreviewSendSurvey />,
  "Get feedback": <PreviewGetFeedback />,
  "Collect purchase interest": <PreviewCollectPurchase />,
  Default: <PreviewDefault />,
};

// ─── Radio Option (form left side) ───────────────────────────────────────────

const RadioOption = ({
  option,
  selected,
  onChange,
}: {
  option: TemplateOption;
  selected: string;
  onChange: (v: string) => void;
}) => {
  const isSelected = selected === option.value;
  return (
    <label
      onClick={() => onChange(option.value)}
      className={`flex items-start gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition-colors ${
        isSelected ? "bg-blue-50" : "hover:bg-slate-50"
      }`}
    >
      <div
        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          isSelected ? "border-blue-600" : "border-slate-300"
        }`}
      >
        {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
      </div>
      <div>
        <span
          className={`text-sm ${isSelected ? "font-semibold text-slate-800" : "text-slate-700"}`}
        >
          {option.label}
        </span>
        {option.subLabel && (
          <p className="text-[11px] text-slate-400 mt-0.5">
            Full development guide available.{" "}
            <span className="text-blue-500 cursor-pointer">More info</span>
          </p>
        )}
      </div>
    </label>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

const CreateFlowModal = ({ onClose }: CreateFlowModalProps) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    flowName: "",
    category: "",
    endpointType: "without",
    selectedOption: "Customer support",
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const preview = PREVIEW_MAP[form.selectedOption] ?? <PreviewDefault />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
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
          {/* ── Left — Form ─────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Name section */}
            <div className="px-6 py-4 border-b border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.flowName}
                  onChange={(e) =>
                    update("flowName", e.target.value.slice(0, 200))
                  }
                  placeholder="Enter name"
                  maxLength={200}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                  {form.flowName.length}/200
                </span>
              </div>
            </div>

            {/* Categories section */}
            <div className="px-6 py-4 border-b border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Categories
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen((v) => !v)}
                  className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
                >
                  <span
                    className={
                      form.category ? "text-slate-700" : "text-slate-400"
                    }
                  >
                    {form.category || "Select categories"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {categoryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          update("category", c);
                          setCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          form.category === c
                            ? "text-violet-700 bg-violet-50 font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Template section */}
            <div className="px-6 py-4 flex flex-col gap-3">
              <label className="block text-xs font-semibold text-slate-700">
                Template
              </label>

              {/* Endpoint toggle */}
              <div className="flex gap-0 border border-slate-200 rounded-lg overflow-hidden w-fit">
                {(["without", "with"] as EndpointType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => update("endpointType", type)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      form.endpointType === type
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {type === "without" ? "Without endpoint" : "With endpoint"}
                  </button>
                ))}
              </div>

              {/* Template radio list */}
              <div className="flex flex-col gap-0.5">
                {TEMPLATE_OPTIONS.map((opt) => (
                  <RadioOption
                    key={opt.value}
                    option={opt}
                    selected={form.selectedOption}
                    onChange={(v) => update("selectedOption", v)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right — Flow Preview ─────────────────────────────────────── */}
          <div className="w-64 shrink-0 border-l border-slate-100 flex flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-700">
                Flow preview
              </p>
              <button className="flex items-center gap-1 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-md px-2 py-1 transition-colors">
                <Settings size={11} />
                <ChevronDown size={11} />
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto">{preview}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlowModal;
