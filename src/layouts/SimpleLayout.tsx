import { useState, type ReactNode } from "react";
import Navbar from "../components/Navbar";

interface SimpleLayoutProps {
  children: ReactNode;
}

const SimpleLayout = ({ children }: SimpleLayoutProps) => {
  const [, setSidebarOpen] = useState(false);
  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default SimpleLayout;
