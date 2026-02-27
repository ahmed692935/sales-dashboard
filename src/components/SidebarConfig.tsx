import {
  TrendingUp,
  Megaphone,
  Users,
  Layers,
  Settings,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import type { SidebarSectionConfig } from "../types";

const sidebarSections: SidebarSectionConfig[] = [
  // ─── Flows section — must come BEFORE any catch-all ─────────────────────
  // Listed first so "/flows" is matched before the Sales section tries "/"
  {
    match: ["/flows"],
    items: [
      {
        label: "Flow Dashboard",
        path: "/flows",
        icon: <LayoutDashboard size={16} />,
        disabled: false,
      },
      {
        label: "Templates",
        path: "/flows/templates",
        icon: <FileText size={16} />,
        disabled: true,
      },
    ],
  },

  // ─── Sales / Dashboard section ──────────────────────────────────────────
  // NOTE: "/" removed from match — it caused every route to match this section
  //       Use "/dashboard" as the root of this section instead
  {
    match: ["/"],
    items: [
      {
        label: "Sales",
        path: "/dashboard",
        icon: <TrendingUp size={16} />,
        disabled: true,
      },
      {
        label: "Marketing",
        path: "/marketing",
        icon: <Megaphone size={16} />,
        disabled: true,
      },
      {
        label: "Team Members",
        path: "/users",
        icon: <Users size={16} />,
        disabled: true,
      },
      {
        label: "Team Members",
        path: "/teams",
        icon: <Layers size={16} />,
        disabled: true,
      },
      {
        label: "General",
        path: "/settings",
        icon: <Settings size={16} />,
        disabled: true,
      },
    ],
  },
];

export default sidebarSections;
