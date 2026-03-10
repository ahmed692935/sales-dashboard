// import { useState } from "react";
// import { Mail, X } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type CategoryType = "Marketing" | "Utilities" | "Authentication";
// export type SubType =
//   | "Default"
//   | "Catalogue"
//   | "Flows"
//   | "Calling permissions request";

// export interface TemplateFormData {
//   name: string;
//   language: string;
//   category: CategoryType;
//   subType: SubType;
// }

// interface Step1Props {
//   onNext: (data: TemplateFormData) => void;
//   onClose: () => void;
// }

// const SUB_TYPES: { value: SubType; description: string }[] = [
//   {
//     value: "Default",
//     description:
//       "Send messages with media and customised buttons to engage your customers.",
//   },
//   {
//     value: "Catalogue",
//     description:
//       "Send messages that drive sales by connecting your product catalogue.",
//   },
//   {
//     value: "Flows",
//     description:
//       "Send a form to capture customer interests, appointment requests or run surveys.",
//   },
//   {
//     value: "Calling permissions request",
//     description: "Ask customers if you can call them on WhatsApp",
//   },
// ];

// const CATEGORIES: CategoryType[] = ["Marketing", "Utilities", "Authentication"];

// const Step1 = ({ onNext, onClose }: Step1Props) => {
//   const [form, setForm] = useState<TemplateFormData>({
//     name: "",
//     language: "",
//     category: "Marketing",
//     subType: "Default",
//   });

//   const update = <K extends keyof TemplateFormData>(
//     key: K,
//     val: TemplateFormData[K],
//   ) => setForm((p) => ({ ...p, [key]: val }));

//   const canNext =
//     form.name.trim().length > 0 && form.language.trim().length > 0;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
//           <h2 className="text-base font-semibold text-slate-800">
//             Create Template
//           </h2>
//           <button
//             onClick={onClose}
//             className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
//           >
//             <X size={15} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex overflow-hidden max-h-[70vh]">
//           {/* Left form */}
//           <div className="flex-1 px-7 py-5 flex flex-col gap-5 overflow-y-auto">
//             {/* Row 1 — Name + Language */}
//             <div className="flex gap-4 flex-wrap sm:flex-nowrap">
//               <div className="flex-1 min-w-[160px]">
//                 <label className="block text-xs font-semibold text-slate-600 mb-1.5">
//                   Template Name
//                 </label>
//                 <input
//                   type="text"
//                   value={form.name}
//                   onChange={(e) => update("name", e.target.value)}
//                   placeholder="Ex: Boost Sales"
//                   className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
//                 />
//               </div>
//               <div className="w-full sm:w-44 shrink-0">
//                 <label className="block text-xs font-semibold text-slate-600 mb-1.5">
//                   Select Language
//                 </label>
//                 <input
//                   type="text"
//                   value={form.language}
//                   onChange={(e) => update("language", e.target.value)}
//                   placeholder="Ex: English"
//                   className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
//                 />
//               </div>
//             </div>

//             {/* Category toggle */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">
//                 Category
//               </label>
//               <div className="flex gap-2">
//                 {CATEGORIES.map((cat) => (
//                   <button
//                     key={cat}
//                     onClick={() => update("category", cat)}
//                     className={`flex-1 flex items-center gap-2 py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
//                       form.category === cat
//                         ? "border-violet-500 text-violet-700 bg-white shadow-sm ring-1 ring-violet-300"
//                         : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
//                     }`}
//                   >
//                     <Mail size={13} className="shrink-0" />
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Sub-type radio options */}
//             <div className="flex flex-col gap-4">
//               {SUB_TYPES.map((opt) => (
//                 <label
//                   key={opt.value}
//                   className="flex items-start gap-3 cursor-pointer group"
//                   onClick={() => update("subType", opt.value)}
//                 >
//                   <div
//                     className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
//                       form.subType === opt.value
//                         ? "border-violet-600"
//                         : "border-slate-300 group-hover:border-slate-400"
//                     }`}
//                   >
//                     {form.subType === opt.value && (
//                       <div className="w-2 h-2 rounded-full bg-violet-600" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-700">
//                       {opt.value}
//                     </p>
//                     <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
//                       {opt.description}
//                     </p>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Right — Template Preview */}
//           <div className="hidden sm:flex w-44 shrink-0 border-l border-slate-100 flex-col items-center pt-6 px-4">
//             <p className="text-xs font-semibold text-slate-500">
//               Template Preview
//             </p>
//             <div className="mt-4 w-full flex-1 bg-slate-50 rounded-xl border border-slate-100 min-h-[200px]" />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-slate-100">
//           <button
//             onClick={onClose}
//             className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => canNext && onNext(form)}
//             className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
//               canNext
//                 ? "bg-violet-600 hover:bg-violet-500 text-white"
//                 : "bg-slate-200 text-slate-400 cursor-not-allowed"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Step1;

import { useState } from "react";
import { Mail, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CategoryType = "Marketing" | "Utilities" | "Authentication";
export type SubType =
  | "Default"
  | "Catalogue"
  | "Flows"
  | "Calling permissions request"
  | "One-time Passcode";

export interface TemplateFormData {
  name: string;
  language: string;
  category: CategoryType;
  subType: SubType;
}

interface Step1Props {
  onNext: (data: TemplateFormData) => void;
  onClose: () => void;
}

// ─── Category → SubType options map ──────────────────────────────────────────

const SUB_TYPES_BY_CATEGORY: Record<
  CategoryType,
  { value: SubType; description: string }[]
> = {
  Marketing: [
    {
      value: "Default",
      description:
        "Send messages with media and customised buttons to engage your customers.",
    },
    {
      value: "Catalogue",
      description:
        "Send messages that drive sales by connecting your product catalogue.",
    },
    {
      value: "Flows",
      description:
        "Send a form to capture customer interests, appointment requests or run surveys.",
    },
    {
      value: "Calling permissions request",
      description: "Ask customers if you can call them on WhatsApp",
    },
  ],
  Utilities: [
    {
      value: "Default",
      description:
        "Send messages with media and customised buttons to engage your customers.",
    },
    {
      value: "Flows",
      description:
        "Send a form to capture customer interests, appointment requests or run surveys.",
    },
    {
      value: "Calling permissions request",
      description: "Ask customers if you can call them on WhatsApp",
    },
  ],
  Authentication: [
    {
      value: "One-time Passcode",
      description: "Send code to verify a transaction or login.",
    },
  ],
};

// Default first subType for each category
const DEFAULT_SUBTYPE: Record<CategoryType, SubType> = {
  Marketing: "Default",
  Utilities: "Default",
  Authentication: "One-time Passcode",
};

const CATEGORIES: CategoryType[] = ["Marketing", "Utilities", "Authentication"];

const Step1 = ({ onNext, onClose }: Step1Props) => {
  const [form, setForm] = useState<TemplateFormData>({
    name: "",
    language: "",
    category: "Marketing",
    subType: "Default",
  });

  const update = <K extends keyof TemplateFormData>(
    key: K,
    val: TemplateFormData[K],
  ) => setForm((p) => ({ ...p, [key]: val }));

  const canNext =
    form.name.trim().length > 0 && form.language.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            Create Template
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex overflow-hidden max-h-[70vh]">
          {/* Left form */}
          <div className="flex-1 px-7 py-5 flex flex-col gap-5 overflow-y-auto">
            {/* Row 1 — Name + Language */}
            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Template Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ex: Boost Sales"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
              <div className="w-full sm:w-44 shrink-0">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Select Language
                </label>
                <input
                  type="text"
                  value={form.language}
                  onChange={(e) => update("language", e.target.value)}
                  placeholder="Ex: English"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            {/* Category toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Category
              </label>
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        category: cat,
                        subType: DEFAULT_SUBTYPE[cat],
                      }))
                    }
                    className={`flex-1 flex items-center gap-2 py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                      form.category === cat
                        ? "border-violet-500 text-violet-700 bg-white shadow-sm ring-1 ring-violet-300"
                        : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                    }`}
                  >
                    <Mail size={13} className="shrink-0" />
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-type radio options — dynamic per category */}
            <div className="flex flex-col gap-4">
              {SUB_TYPES_BY_CATEGORY[form.category].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => update("subType", opt.value)}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      form.subType === opt.value
                        ? "border-violet-600"
                        : "border-slate-300 group-hover:border-slate-400"
                    }`}
                  >
                    {form.subType === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-violet-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {opt.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Right — Template Preview */}
          <div className="hidden sm:flex w-44 shrink-0 border-l border-slate-100 flex-col items-center pt-6 px-4">
            <p className="text-xs font-semibold text-slate-500">
              Template Preview
            </p>
            <div className="mt-4 w-full flex-1 bg-slate-50 rounded-xl border border-slate-100 min-h-[200px]" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => canNext && onNext(form)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              canNext
                ? "bg-violet-600 hover:bg-violet-500 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1;
