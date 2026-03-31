// import { useLocation, NavLink } from "react-router-dom";
// import { X } from "lucide-react";
// import sidebarSections from "../../src/components/SidebarConfig";
// import type { SidebarItem } from "../types";

// interface SidebarProps {
//   open?: boolean;
//   onClose?: () => void;
// }

// const SidebarLink = ({
//   item,
//   onClose,
// }: {
//   item: SidebarItem;
//   onClose?: () => void;
// }) => {
//   // ── Disabled state — rendered as plain div, no routing, no hover
//   if (item.disabled) {
//     return (
//       <div
//         title="Coming soon"
//         className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium
//                    cursor-not-allowed select-none opacity-40"
//       >
//         <span className="flex items-center shrink-0 [&>svg]:w-[16px] [&>svg]:h-[16px] text-slate-400">
//           {item.icon}
//         </span>
//         <span className="flex-1 text-base text-slate-500">{item.label}</span>
//         {item.badge !== undefined && (
//           <span className="text-[10px] font-semibold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">
//             {item.badge}
//           </span>
//         )}
//       </div>
//     );
//   }

//   // ── Active / normal NavLink
//   return (
//     <NavLink
//       to={item.path}
//       end
//       onClick={onClose}
//       className={({ isActive }) =>
//         `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
//           isActive
//             ? "text-violet-600 bg-violet-50"
//             : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
//         }`
//       }
//     >
//       {({ isActive }) => (
//         <>
//           <span
//             className={`flex items-center shrink-0 [&>svg]:w-[16px] [&>svg]:h-[16px] ${
//               isActive ? "text-violet-500" : "text-black"
//             }`}
//           >
//             {item.icon}
//           </span>
//           <span className="flex-1 text-base">{item.label}</span>
//           {item.badge !== undefined && (
//             <span className="text-[10px] font-semibold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">
//               {item.badge}
//             </span>
//           )}
//         </>
//       )}
//     </NavLink>
//   );
// };

// const Sidebar = ({ open = true, onClose }: SidebarProps) => {
//   const { pathname } = useLocation();

//   const activeSection = sidebarSections.find((section) =>
//     section.match.some(
//       (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
//     ),
//   );

//   if (!activeSection) return null;

//   return (
//     <>
//       {/* Mobile backdrop */}
//       {open && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/30 z-30"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}

//       {/* Sidebar panel */}
//       <aside
//         className={`
//           fixed lg:static top-0 left-0 h-full lg:h-auto
//           w-60 bg-white border-r border-slate-200
//           flex flex-col z-40 transition-transform duration-200 shrink-0
//           ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         `}
//       >
//         {/* Mobile close header */}
//         <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
//           <span className="text-lg font-bold text-slate-800">LOGO</span>
//           <button
//             onClick={onClose}
//             className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Nav links */}
//         <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
//           {activeSection.items.map((item, index) => (
//             <SidebarLink
//               key={`${item.path}-${index}`}
//               item={item}
//               onClose={onClose}
//             />
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import type { SidebarItem, SidebarGroup, SidebarEntry } from "../types";
import sidebarSections from "./SidebarConfig";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

// ─── Type guard ───────────────────────────────────────────────────────────────
const isGroup = (entry: SidebarEntry): entry is SidebarGroup =>
  (entry as SidebarGroup).type === "group";

// ─── Flat link ────────────────────────────────────────────────────────────────
const SidebarLink = ({
  item,
  onClose,
}: {
  item: SidebarItem;
  onClose?: () => void;
}) => {
  if (item.disabled) {
    return (
      <div
        title="Coming soon"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-not-allowed select-none opacity-40"
      >
        {item.icon && (
          <span className="flex items-center shrink-0 text-slate-400 [&>svg]:w-4 [&>svg]:h-4">
            {item.icon}
          </span>
        )}
        <span className="flex-1 text-sm text-slate-500">{item.label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      end
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm ${
          isActive
            ? "text-violet-600 bg-violet-50"
            : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {item.icon && (
            <span
              className={`flex items-center shrink-0 [&>svg]:w-4 [&>svg]:h-4 ${isActive ? "text-violet-500" : "text-slate-500"}`}
            >
              {item.icon}
            </span>
          )}
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined &&
            (item.badgeVariant === "recommended" ? (
              <span className="text-[10px] font-semibold bg-violet-600 text-white px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            ) : (
              <span className="text-[10px] font-semibold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            ))}
        </>
      )}
    </NavLink>
  );
};

// ─── Accordion group ──────────────────────────────────────────────────────────
const SidebarGroupComp = ({
  group,
  onClose,
}: {
  group: SidebarGroup;
  onClose?: () => void;
}) => {
  const [open, setOpen] = useState(group.defaultOpen ?? false);

  return (
    <div>
      {/* Group header — clickable to toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
      >
        {group.icon && (
          <span className="flex items-center shrink-0 text-slate-500 [&>svg]:w-4 [&>svg]:h-4">
            {group.icon}
          </span>
        )}
        <span className="flex-1 text-sm font-semibold text-slate-700 text-left">
          {group.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Children — slide in/out */}
      {open && (
        <div className="mt-0.5 ml-4 pl-3 border-l border-slate-100 flex flex-col gap-0.5">
          {group.children.map((child, i) => (
            <SidebarLink
              key={`${child.path}-${i}`}
              item={child}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ open = true, onClose }: SidebarProps) => {
  const { pathname } = useLocation();

  const activeSection = sidebarSections.find((section) =>
    section.match.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
    ),
  );

  if (!activeSection) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full lg:h-auto
          w-60 bg-white border-r border-slate-200
          flex flex-col z-40 transition-transform duration-200 shrink-0
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
          <span className="text-lg font-bold text-slate-800">LOGO</span>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {activeSection.items.map((entry, index) =>
            isGroup(entry) ? (
              <SidebarGroupComp
                key={`group-${index}`}
                group={entry}
                onClose={onClose}
              />
            ) : (
              <SidebarLink
                key={`${entry.path}-${index}`}
                item={entry}
                onClose={onClose}
              />
            ),
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
