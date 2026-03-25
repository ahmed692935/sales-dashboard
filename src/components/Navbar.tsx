import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Inbox,
  Megaphone,
  Zap,
  GitBranch,
  Users,
  BarChart2,
  Settings,
  Menu,
  X,
} from "lucide-react";
import type { NavItem } from "../types";

const navItems: NavItem[] = [
  { label: "Team Inbox", path: "/inbox", icon: <Inbox size={16} /> },
  {
    label: "Campaigns",
    path: "/campaigns",
    icon: <Megaphone size={16} />,
    disabled: false,
  },
  {
    label: "Automations",
    path: "/automations",
    icon: <Zap size={16} />,
    disabled: true,
  },
  { label: "Flows", path: "/flows", icon: <GitBranch size={16} /> },
  { label: "Contacts", path: "/contacts", icon: <Users size={16} /> },
  {
    label: "Sales Analytics",
    path: "/dashboard",
    icon: <BarChart2 size={16} />,
    disabled: true,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings size={16} />,
    disabled: true,
  },
];

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const Navbar = ({ onToggleSidebar, sidebarOpen }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 shrink-0 z-40 relative">
      <div className="flex items-center h-14 px-4">
        {/* Mobile hamburger */}
        <button
          className="lg:hidden mr-3 p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo area - visible on desktop, hidden on mobile (shown in sidebar) */}
        <div className="hidden lg:flex flex-col justify-center w-44 shrink-0">
          <span className="text-xs text-slate-400 leading-none mb-1">
            3 managers
          </span>
          <span
            className="text-2xl font-bold cursor-pointer text-slate-800 leading-none tracking-tight"
            onClick={() => navigate("/")}
          >
            LOGO
          </span>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex-1">
          <span
            className="text-xl font-bold cursor-pointer text-slate-800 leading-none tracking-tight"
            onClick={() => navigate("/")}
          >
            LOGO
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
          {/* {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-md text-[14px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-violet-600 bg-violet-50"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`
              }
            >
              <span className="flex items-center opacity-70">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))} */}
          {navItems.map((item) =>
            item.disabled ? (
              // Disabled link — rendered as a <span>, not clickable at all
              <span
                key={item.path}
                title="Coming soon"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[14px] font-medium
                           text-slate-300 cursor-not-allowed select-none whitespace-nowrap"
              >
                <span className="flex items-center opacity-50">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </span>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-md text-[14px] font-medium
                   transition-colors whitespace-nowrap ${
                     isActive
                       ? "text-violet-600 bg-violet-50"
                       : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                   }`
                }
              >
                <span className="flex items-center opacity-70">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ),
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle nav"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-3 py-2 flex flex-col gap-0.5">
          {/* {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-violet-600 bg-violet-50"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <span className="flex items-center">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))} */}
          {navItems.map((item) =>
            item.disabled ? (
              <span
                key={item.path}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium
                           text-slate-300 cursor-not-allowed select-none"
              >
                <span className="flex items-center opacity-50">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </span>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-violet-600 bg-violet-50"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <span className="flex items-center">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ),
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
