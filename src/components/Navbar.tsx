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
  LogOut,
  ChevronDown,
} from "lucide-react";
import type { NavItem } from "../types";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/chattick.io.svg";

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
    disabled: false,
  },
  { label: "Flows", path: "/flows", icon: <GitBranch size={16} /> },
  { label: "Contacts", path: "/contacts", icon: <Users size={16} /> },
  {
    label: "Sales Analytics",
    path: "/sales-analytics",
    icon: <BarChart2 size={16} />,
    disabled: false,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Initials avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="bg-white border-b border-slate-200 shrink-0 z-40 relative">
      <div className="flex items-center h-16 px-4">
        {/* Mobile hamburger */}
        <button
          className="lg:hidden mr-3 p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo — desktop */}
        <div className="hidden lg:flex flex-col justify-center w-44 shrink-0">
          <span
            className="text-2xl font-bold cursor-pointer text-slate-800 leading-none tracking-tight"
            onClick={() => navigate("/dashboard")}
          >
            <img src={logo} alt="Chattick.io" className="h-10" />
          </span>
        </div>

        {/* Logo — mobile */}
        <div className="lg:hidden flex-1">
          <span
            className="text-xl font-bold cursor-pointer text-slate-800 leading-none tracking-tight"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Chattick.io" className="h-10" />
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
          {navItems.map((item) =>
            item.disabled ? (
              <span
                key={item.path}
                title="Coming soon"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[14px] font-medium text-slate-300 cursor-not-allowed select-none whitespace-nowrap"
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
                  `flex items-center gap-1.5 px-3 py-2 rounded-md text-[14px] font-medium transition-colors whitespace-nowrap ${
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

        {/* User Menu — only rendered when logged in */}
        {user && (
          <div className="relative ml-auto">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-[#7364FF] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {initials}
              </div>
              {/* Name + role — desktop only */}
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-slate-800">
                  {user.name}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {user.role}
                </span>
              </div>
              <ChevronDown
                size={14}
                className="text-slate-400 hidden lg:block"
              />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {user.email}
                  </p>
                  <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-600 capitalize">
                    {user.role}
                  </span>
                </div>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden ml-2 p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle nav"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-3 py-2 flex flex-col gap-0.5">
          {navItems.map((item) =>
            item.disabled ? (
              <span
                key={item.path}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 cursor-not-allowed select-none"
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

          {user && (
            <div className="border-t border-slate-100 mt-1 pt-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-[#7364FF] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-slate-800">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-400">{user.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
