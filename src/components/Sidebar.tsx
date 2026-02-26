import { useLocation, NavLink } from "react-router-dom";
import { X } from "lucide-react";
// ✅ Correct relative import path
import sidebarSections from "../../src/components/SidebarConfig";
import type { SidebarItem } from "../types";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const SidebarLink = ({
  item,
  onClose,
}: {
  item: SidebarItem;
  onClose?: () => void;
}) => (
  <NavLink
    to={item.path}
    end
    onClick={onClose}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
        isActive
          ? "text-violet-600 bg-violet-50"
          : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span
          className={`flex items-center shrink-0 ${
            isActive ? "text-violet-500" : "text-slate-400"
          }`}
        >
          {item.icon}
        </span>
        <span className="flex-1">{item.label}</span>
        {item.badge !== undefined && (
          <span className="text-[10px] font-semibold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

const Sidebar = ({ open = true, onClose }: SidebarProps) => {
  const { pathname } = useLocation();

  /**
   * Match logic:
   * - For each section, check if any prefix matches the current path
   * - IMPORTANT: use exact match for single-segment prefixes like "/flows"
   *   to avoid "/flows" accidentally matching "/flowsomethingelse"
   * - startsWith is safe only because all our prefixes end at a segment boundary
   */
  const activeSection = sidebarSections.find((section) =>
    section.match.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
    ),
  );

  // No matching section → sidebar hidden
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
          w-48 bg-white border-r border-slate-200
          flex flex-col z-40 transition-transform duration-200 shrink-0
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile close header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
          <span className="text-lg font-bold text-slate-800">LOGO</span>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {activeSection.items.map((item, index) => (
            <SidebarLink
              key={`${item.path}-${index}`}
              item={item}
              onClose={onClose}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
