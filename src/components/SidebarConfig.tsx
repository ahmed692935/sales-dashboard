import {
  TrendingUp,
  Megaphone,
  Users,
  Layers,
  Settings,
  LayoutDashboard,
  FileText,
  PhoneCall,
  BookOpen,
  Zap,
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
        disabled: false,
      },
      {
        label: "Message Templates",
        path: "/flows/message-templates",
        icon: <FileText size={16} />,
        disabled: false,
      },
    ],
  },

  //compaigns
  {
    match: ["/campaigns"],
    items: [
      {
        label: "Create Compaigns",
        path: "/campaigns",
        icon: <FileText size={16} />,
        disabled: false,
      },
    ],
  },

  // sales analytics
  {
    match: ["/sales-analytics"],
    items: [
      {
        label: "Sales Analytics",
        path: "/sales-analytics",
        icon: <PhoneCall size={16} />,
        disabled: false,
      },
    ],
  },

  {
    match: ["/automations"],
    items: [
      {
        type: "group",
        label: "Trigger",
        icon: <Zap size={16} />,
        defaultOpen: true,
        children: [
          {
            label: "Rules",
            path: "/automations/rules",
            badge: "Recommended",
            badgeVariant: "recommended",
          },
        ],
      },
      {
        type: "group",
        label: "Actions library",
        icon: <BookOpen size={16} />,
        defaultOpen: true,
        children: [
          {
            label: "Routing",
            path: "/automations/routing",
          },
        ],
      },
    ],
  },

  // ─── Sales / Dashboard section ──────────────────────────────────────────
  // NOTE: "/" removed from match — it caused every route to match this section
  //       Use "/dashboard" as the root of this section instead
  {
    match: ["/", "/lead-stages", "/teams", "/permission&roles", "/members"],
    items: [
      {
        label: "Members",
        path: "/members",
        icon: <Users size={16} />,
        disabled: false,
      },
      {
        label: "Sales",
        path: "/lead-stages",
        icon: <TrendingUp size={16} />,
        disabled: false,
      },
      {
        label: "Permission & Roles",
        path: "/permission&roles",
        icon: <Users size={16} />,
        disabled: false,
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
        disabled: false,
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
