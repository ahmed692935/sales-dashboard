// import { useState } from "react";
// import {
//   Settings,
//   Search,
//   Share2,
//   Copy,
//   Trash2,
//   Filter,
//   Download,
//   Upload,
//   Maximize2,
//   Pencil,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Mail,
//   X,
// } from "lucide-react";

// // ─── Types ─────────────────────────────────────────────────────────────────────

// type TemplateStatus = "DRAFT" | "DEPRECATED" | "PUBLISHED";

// interface Template {
//   id: string;
//   name: string;
//   templateId: string;
//   flowContent: string;
//   category: string;
//   language: string;
//   status: TemplateStatus;
//   messageDelivery: number;
//   readRate: string;
//   lastEdited: string;
// }

// type CategoryType = "Marketing" | "Utilities" | "Authentication";
// type SubType =
//   | "Default"
//   | "Catalogue"
//   | "Flows"
//   | "Calling permissions request";

// interface CreateTemplateForm {
//   name: string;
//   language: string;
//   category: CategoryType;
//   subType: SubType;
// }

// // ─── Mock Data ──────────────────────────────────────────────────────────────

// const STATUSES: TemplateStatus[] = [
//   "DRAFT",
//   "DEPRECATED",
//   "PUBLISHED",
//   "PUBLISHED",
//   "PUBLISHED",
//   "PUBLISHED",
//   "PUBLISHED",
//   "PUBLISHED",
//   "PUBLISHED",
//   "PUBLISHED",
// ];
// const CATEGORIES = [
//   "Utility",
//   "Authentication",
//   "Authentication",
//   "Marketing",
//   "Marketing",
//   "Marketing",
//   "Authentication",
//   "Authentication",
//   "Utility",
//   "Marketing",
// ];

// const allTemplates: Template[] = Array.from({ length: 130 }, (_, i) => ({
//   id: String(i + 1),
//   name: "Lead stage",
//   templateId: "template id",
//   flowContent: "Campaign 25 Desember [ Telegram ]",
//   category: CATEGORIES[i % CATEGORIES.length],
//   language: "English",
//   status: STATUSES[i % STATUSES.length],
//   messageDelivery: 235,
//   readRate: "4%",
//   lastEdited: "10 Des 2022 - 11:50",
// }));

// const ROWS_PER_PAGE = 10;

// // ─── Status Badge ──────────────────────────────────────────────────────────────

// const statusStyle: Record<TemplateStatus, string> = {
//   DRAFT: "bg-slate-100 text-slate-500",
//   DEPRECATED: "bg-red-100 text-red-600",
//   PUBLISHED: "bg-green-100 text-green-700",
// };

// const StatusBadge = ({ status }: { status: TemplateStatus }) => (
//   <span
//     className={`inline-block px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${statusStyle[status]}`}
//   >
//     {status}
//   </span>
// );

// // ─── Icon Button ───────────────────────────────────────────────────────────────

// const IconBtn = ({ icon: Icon }: { icon: React.ElementType }) => (
//   <button className="w-7 h-7 flex items-center justify-center rounded-md text-gray-700 hover:text-slate-700 hover:bg-slate-100 transition-colors">
//     <Icon size={14} />
//   </button>
// );

// // ─── Pagination ────────────────────────────────────────────────────────────────

// const Pagination = ({
//   current,
//   total,
//   onChange,
// }: {
//   current: number;
//   total: number;
//   onChange: (p: number) => void;
// }) => {
//   const pages: (number | "...")[] =
//     total <= 5
//       ? Array.from({ length: total }, (_, i) => i + 1)
//       : [1, 2, 3, "...", total];
//   return (
//     <div className="flex items-center gap-1">
//       <button
//         onClick={() => onChange(Math.max(1, current - 1))}
//         disabled={current === 1}
//         className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//       >
//         <ChevronLeft size={13} />
//       </button>
//       {pages.map((p, i) =>
//         p === "..." ? (
//           <span
//             key={`e${i}`}
//             className="w-7 h-7 flex items-center justify-center text-xs text-slate-400"
//           >
//             ...
//           </span>
//         ) : (
//           <button
//             key={p}
//             onClick={() => onChange(p as number)}
//             className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${current === p ? "bg-violet-600 text-white shadow-sm" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
//           >
//             {p}
//           </button>
//         ),
//       )}
//       <button
//         onClick={() => onChange(Math.min(total, current + 1))}
//         disabled={current === total}
//         className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//       >
//         <ChevronRight size={13} />
//       </button>
//     </div>
//   );
// };

// // ─── Create Template Modal — Step 1 ────────────────────────────────────────────

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

// interface CreateTemplateModalProps {
//   onClose: () => void;
// }

// const CreateTemplateModal = ({ onClose }: CreateTemplateModalProps) => {
//   const [form, setForm] = useState<CreateTemplateForm>({
//     name: "",
//     language: "",
//     category: "Marketing",
//     subType: "Default",
//   });

//   const update = <K extends keyof CreateTemplateForm>(
//     key: K,
//     val: CreateTemplateForm[K],
//   ) => setForm((p) => ({ ...p, [key]: val }));

//   const categories: CategoryType[] = [
//     "Marketing",
//     "Utilities",
//     "Authentication",
//   ];

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
//           <h2 className="text-lg font-bold text-slate-800">Create Template</h2>
//           <button
//             onClick={onClose}
//             className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
//           >
//             <X size={15} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex overflow-hidden">
//           {/* Left form */}
//           <div className="flex-1 px-7 py-5 flex flex-col gap-5 overflow-y-auto">
//             {/* Row 1 */}
//             <div className="flex gap-4">
//               <div className="flex-1">
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
//               <div className="w-44">
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
//                 {categories.map((cat) => (
//                   <button
//                     key={cat}
//                     onClick={() => update("category", cat)}
//                     className={`flex-1 flex items-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
//                       form.category === cat
//                         ? "border-violet-500 text-violet-700 bg-white shadow-sm ring-1 ring-violet-300"
//                         : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
//                     }`}
//                   >
//                     <Mail size={14} className="shrink-0" />
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Sub-type radio options */}
//             <div className="flex flex-col gap-3.5">
//               {SUB_TYPES.map((opt) => (
//                 <label
//                   key={opt.value}
//                   className="flex items-start gap-3 cursor-pointer group"
//                 >
//                   {/* Radio */}
//                   <div
//                     className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
//                       form.subType === opt.value
//                         ? "border-violet-600"
//                         : "border-slate-300 group-hover:border-slate-400"
//                     }`}
//                     onClick={() => update("subType", opt.value)}
//                   >
//                     {form.subType === opt.value && (
//                       <div className="w-2 h-2 rounded-full bg-violet-600" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-700">
//                       {opt.value}
//                     </p>
//                     <p className="text-xs text-slate-400 mt-0.5">
//                       {opt.description}
//                     </p>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Right — Template Preview */}
//           <div className="w-44 shrink-0 border-l border-slate-100 flex flex-col items-center pt-6 px-4">
//             <p className="text-xs font-semibold text-slate-500">
//               Template Preview
//             </p>
//             <div className="mt-4 w-full flex-1 bg-slate-50 rounded-xl border border-slate-100 min-h-[180px]" />
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
//           <button className="px-5 py-2 rounded-lg bg-slate-200 text-sm font-medium text-slate-400 cursor-not-allowed">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Main Page ─────────────────────────────────────────────────────────────────

// const FlowTemplates = () => {
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selected, setSelected] = useState<Set<string>>(new Set());
//   const [showModal, setShowModal] = useState(false);

//   const filtered = allTemplates.filter(
//     (t) =>
//       t.name.toLowerCase().includes(search.toLowerCase()) ||
//       t.category.toLowerCase().includes(search.toLowerCase()) ||
//       t.status.toLowerCase().includes(search.toLowerCase()),
//   );

//   const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
//   const paginated = filtered.slice(
//     (currentPage - 1) * ROWS_PER_PAGE,
//     currentPage * ROWS_PER_PAGE,
//   );

//   const toggleRow = (id: string) =>
//     setSelected((prev) => {
//       const n = new Set(prev);
//       n.has(id) ? n.delete(id) : n.add(id);
//       return n;
//     });

//   const toggleAll = () => {
//     const ids = paginated.map((t) => t.id);
//     const allSel = ids.every((id) => selected.has(id));
//     setSelected((prev) => {
//       const n = new Set(prev);
//       allSel
//         ? ids.forEach((id) => n.delete(id))
//         : ids.forEach((id) => n.add(id));
//       return n;
//     });
//   };

//   const allPageSel =
//     paginated.length > 0 && paginated.every((t) => selected.has(t.id));
//   const startEntry =
//     filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
//   const endEntry = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

//   return (
//     <div className="flex flex-col min-h-full bg-slate-50">
//       {showModal && <CreateTemplateModal onClose={() => setShowModal(false)} />}

//       {/* ── Page Header ──────────────────────────────────────────────────── */}
//       <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
//         <div>
//           <h2 className="text-sm font-bold text-slate-800">Create Templates</h2>
//           <p className="text-xs text-slate-400 mt-0.5">
//             Create and manage automated conversation flows
//           </p>
//         </div>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
//         >
//           Create New Template
//         </button>
//       </div>

//       {/* ── Table Card ───────────────────────────────────────────────────── */}
//       <div className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
//         {/* Toolbar */}
//         <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
//           <div className="flex items-center gap-2">
//             <IconBtn icon={Settings} />
//             <div className="relative">
//               <Search
//                 size={12}
//                 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
//               />
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 placeholder="Search"
//                 className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-40"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
//               Compare
//             </button>
//             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap">
//               Sun, 1 Dec – Sat, 7 Dec <ChevronDown size={12} className="ml-1" />
//             </button>
//             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
//               This Week <ChevronDown size={12} className="ml-1" />
//             </button>
//             <div className="flex items-center gap-0.5 border-l border-slate-200 pl-2 ml-1">
//               <IconBtn icon={Share2} />
//               <IconBtn icon={Copy} />
//               <IconBtn icon={Trash2} />
//               <IconBtn icon={Filter} />
//               <IconBtn icon={Download} />
//               <IconBtn icon={Upload} />
//               <IconBtn icon={Maximize2} />
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto flex-1">
//           <table className="w-full min-w-[900px]">
//             <thead className="border-b border-slate-100 bg-slate-50/50">
//               <tr>
//                 <th className="w-10 px-4 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     checked={allPageSel}
//                     onChange={toggleAll}
//                     className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
//                   />
//                 </th>
//                 {[
//                   "Template Name",
//                   "Flow Content",
//                   "Category",
//                   "Language",
//                   "Status",
//                   "Message Deliver...",
//                   "Read rate",
//                   "Last Edited",
//                   "Actions",
//                 ].map((h) => (
//                   <th
//                     key={h}
//                     className="px-4 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paginated.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={10}
//                     className="px-4 py-12 text-center text-sm text-slate-400"
//                   >
//                     No templates found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginated.map((t) => (
//                   <tr
//                     key={t.id}
//                     className={`transition-colors ${selected.has(t.id) ? "bg-violet-50" : "hover:bg-slate-50"}`}
//                   >
//                     <td className="px-4 py-3.5">
//                       <input
//                         type="checkbox"
//                         checked={selected.has(t.id)}
//                         onChange={() => toggleRow(t.id)}
//                         className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
//                       />
//                     </td>
//                     {/* Template Name */}
//                     <td className="px-4 py-3.5">
//                       <p className="text-xs font-semibold text-slate-800">
//                         {t.name}
//                       </p>
//                       <p className="text-[10px] text-slate-400 mt-0.5">
//                         {t.templateId}
//                       </p>
//                     </td>
//                     <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
//                       {t.flowContent}
//                     </td>
//                     <td className="px-4 py-3.5 text-xs text-slate-600">
//                       {t.category}
//                     </td>
//                     <td className="px-4 py-3.5 text-xs text-slate-600">
//                       {t.language}
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <StatusBadge status={t.status} />
//                     </td>
//                     <td className="px-4 py-3.5 text-xs text-slate-600">
//                       {t.messageDelivery}
//                     </td>
//                     <td className="px-4 py-3.5 text-xs text-slate-600">
//                       {t.readRate}
//                     </td>
//                     <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
//                       {t.lastEdited}
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <div className="flex items-center gap-1">
//                         <button className="w-7 h-7 flex items-center justify-center rounded-md text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
//                           <Pencil size={13} />
//                         </button>
//                         <button className="w-7 h-7 flex items-center justify-center rounded-md text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
//                           <Trash2 size={13} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap bg-white">
//           <p className="text-xs text-slate-500">
//             Showing {startEntry} to {endEntry} of {filtered.length} entries
//           </p>
//           <Pagination
//             current={currentPage}
//             total={totalPages}
//             onChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlowTemplates;

import { useState, type JSX } from "react";
import {
  Settings,
  Search,
  Share2,
  Copy,
  Trash2,
  Filter,
  Download,
  Upload,
  Maximize2,
  Pencil,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Step1, {
  type TemplateFormData,
} from "../components/TemplatesSteps/Step1";
import Step2 from "../components/TemplatesSteps/Step2";
// import Step3 from "../components/template-steps/Step3";
// import Step4 from "../components/template-steps/Step4";
// import Step5 from "../components/template-steps/Step5";
// import Step6 from "../components/template-steps/Step6";
// import Step7 from "../components/template-steps/Step7";
// import Step8 from "../components/template-steps/Step8";
// import Step9 from "../components/template-steps/Step9";
// import Step10 from "../components/template-steps/Step10";
// import Step11 from "../components/template-steps/Step11";
// import Step12 from "../components/template-steps/Step12";

type TemplateStatus = "DRAFT" | "DEPRECATED" | "PUBLISHED";
interface Template {
  id: string;
  name: string;
  templateId: string;
  flowContent: string;
  category: string;
  language: string;
  status: TemplateStatus;
  messageDelivery: number;
  readRate: string;
  lastEdited: string;
}

const STATUSES: TemplateStatus[] = [
  "DRAFT",
  "DEPRECATED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
];
const CATEGORIES = [
  "Utility",
  "Authentication",
  "Authentication",
  "Marketing",
  "Marketing",
  "Marketing",
  "Authentication",
  "Authentication",
  "Utility",
  "Marketing",
];

const allTemplates: Template[] = Array.from({ length: 130 }, (_, i) => ({
  id: String(i + 1),
  name: "Lead stage",
  templateId: "template id",
  flowContent: "Campaign 25 Desember [ Telegram ]",
  category: CATEGORIES[i % CATEGORIES.length],
  language: "English",
  status: STATUSES[i % STATUSES.length],
  messageDelivery: 235,
  readRate: "4%",
  lastEdited: "10 Des 2022 - 11:50",
}));

const ROWS_PER_PAGE = 10;

const statusStyle: Record<TemplateStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-500",
  DEPRECATED: "bg-red-100 text-red-600",
  PUBLISHED: "bg-green-100 text-green-700",
};

const StatusBadge = ({ status }: { status: TemplateStatus }) => (
  <span
    className={`inline-block px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${statusStyle[status]}`}
  >
    {status}
  </span>
);

const IconBtn = ({ icon: Icon }: { icon: React.ElementType }) => (
  <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
    <Icon size={14} />
  </button>
);

const Pagination = ({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) => {
  const pages: (number | "...")[] =
    total <= 5
      ? Array.from({ length: total }, (_, i) => i + 1)
      : [1, 2, 3, "...", total];
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={13} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-7 h-7 flex items-center justify-center text-xs text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${current === p ? "bg-violet-600 text-white shadow-sm" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

const FlowTemplates = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<TemplateFormData | null>(null);

  const filtered = allTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );
  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () => {
    const ids = paginated.map((t) => t.id);
    const allSel = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const n = new Set(prev);
      allSel
        ? ids.forEach((id) => n.delete(id))
        : ids.forEach((id) => n.add(id));
      return n;
    });
  };
  const allPageSel =
    paginated.length > 0 && paginated.every((t) => selected.has(t.id));
  const startEntry =
    filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endEntry = Math.min(currentPage * ROWS_PER_PAGE, filtered.length);

  const goToStep = (step: number) => setCurrentStep(step);
  const cancelFlow = () => {
    setCurrentStep(0);
    setFormData(null);
  };
  const handleStep1Next = (data: TemplateFormData) => {
    setFormData(data);
    setCurrentStep(2);
  };

  // ── Full-page step views ────────────────────────────────────────────────
  if (currentStep >= 2) {
    const stepProps = {
      formData: formData!,
      onBack: () => goToStep(currentStep - 1),
      onCancel: cancelFlow,
      onNext: () => goToStep(currentStep + 1),
      onCreate: cancelFlow,
    };
    const stepMap: Record<number, JSX.Element> = {
      2: <Step2 {...stepProps} />,
      // 3: <Step3 {...stepProps} />,
      // 4: <Step4 {...stepProps} />,
      // 5: <Step5 {...stepProps} />,
      // 6: <Step6 {...stepProps} />,
      // 7: <Step7 {...stepProps} />,
      // 8: <Step8 {...stepProps} />,
      // 9: <Step9 {...stepProps} />,
      // 10: <Step10 {...stepProps} />,
      // 11: <Step11 {...stepProps} />,
      // 12: <Step12 {...stepProps} />,
    };
    return (
      <div className="flex flex-col min-h-full bg-slate-50">
        {/* Step indicator strip */}
        {/* <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center gap-1 overflow-x-auto shrink-0">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <div key={n} className="flex items-center shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  n < currentStep
                    ? "bg-violet-600 text-white"
                    : n === currentStep
                      ? "bg-violet-600 text-white ring-2 ring-violet-200"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {n}
              </div>
              {n < 12 && (
                <div
                  className={`w-5 h-px mx-0.5 ${n < currentStep ? "bg-violet-400" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div> */}
        <div>{stepMap[currentStep] ?? <Step2 {...stepProps} />}</div>
      </div>
    );
  }

  // ── Table view ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {currentStep === 1 && (
        <Step1 onNext={handleStep1Next} onClose={cancelFlow} />
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Create Templates</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create and manage automated conversation flows
          </p>
        </div>
        <button
          onClick={() => setCurrentStep(1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          Create New Template
        </button>
      </div>

      {/* Table Card */}
      <div className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <IconBtn icon={Settings} />
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors w-40"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Compare
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Sun, 1 Dec – Sat, 7 Dec <ChevronDown size={12} className="ml-1" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              This Week <ChevronDown size={12} className="ml-1" />
            </button>
            <div className="flex items-center gap-0.5 border-l border-slate-200 pl-2">
              <IconBtn icon={Share2} />
              <IconBtn icon={Copy} />
              <IconBtn icon={Trash2} />
              <IconBtn icon={Filter} />
              <IconBtn icon={Download} />
              <IconBtn icon={Upload} />
              <IconBtn icon={Maximize2} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allPageSel}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                {[
                  "Template Name",
                  "Flow Content",
                  "Category",
                  "Language",
                  "Status",
                  "Message Deliver...",
                  "Read rate",
                  "Last Edited",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No templates found.
                  </td>
                </tr>
              ) : (
                paginated.map((t) => (
                  <tr
                    key={t.id}
                    className={`transition-colors ${selected.has(t.id) ? "bg-violet-50" : "hover:bg-slate-50"}`}
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.has(t.id)}
                        onChange={() => toggleRow(t.id)}
                        className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 focus:ring-offset-0 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-slate-800">
                        {t.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {t.templateId}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                      {t.flowContent}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {t.category}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {t.language}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {t.messageDelivery}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {t.readRate}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {t.lastEdited}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap bg-white">
          <p className="text-xs text-slate-500">
            Showing {startEntry} to {endEntry} of {filtered.length} entries
          </p>
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default FlowTemplates;
