import { NavLink } from "react-router-dom";
import {
  TrendingUp,
  Megaphone,
  Users,
  Layers,
  Settings,
  X,
} from "lucide-react";
import type { SidebarItem } from "../types";

const sidebarItems: SidebarItem[] = [
  { label: "Sales", path: "/dashboard", icon: <TrendingUp size={16} /> },
  { label: "Marketing", path: "/marketing", icon: <Megaphone size={16} /> },
  { label: "Team Members", path: "/users", icon: <Users size={16} /> },
  { label: "Team Members", path: "/teams", icon: <Layers size={16} /> },
  { label: "General", path: "/settings", icon: <Settings size={16} /> },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ open = true, onClose }: SidebarProps) => {
  return (
    <>
      {/* Backdrop on mobile */}
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
          flex flex-col z-40 transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile header inside sidebar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
          <span className="text-lg font-bold text-slate-800">LOGO</span>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <NavLink
              key={`${item.path}-${index}`}
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
                    className={`flex items-center ${isActive ? "text-violet-500" : "text-slate-400"}`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto text-[10px] font-semibold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
