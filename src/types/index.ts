// import type { ReactNode } from "react";

import type { ReactNode } from "react";

// export type LayoutType = "dashboard" | "simple" | "chat";

// export interface NavItem {
//   label: string;
//   path: string;
//   icon: ReactNode;
//   disabled?: boolean;
// }

// export interface SidebarItem {
//   label: string;
//   path: string;
//   icon: ReactNode;
//   badge?: number;
//   disabled?: boolean;
// }

// export interface RouteConfig {
//   path: string;
//   element: ReactNode;
//   layout: LayoutType;
//   label: string;
// }

// export interface LeadStat {
//   label: string;
//   value: string;
//   change: string;
//   positive: boolean;
//   color: string;
//   borderColor: string;
// }

// export interface TeamMemberRow {
//   id: string;
//   name: string;
//   avatar: string | undefined;
//   employeeId: string;
//   ticketsAssigned: number;
//   ticketsResolved: number;
//   ticketsPending: number;
//   wonLeads: string;
// }

// export interface TopPerformer {
//   rank: number;
//   avatar: string | undefined;
//   name: string;
//   role: string;
//   wonLeads: number;
//   change: string;
// }

// /** Map of route-prefix → sidebar items shown for that section */
// export interface SidebarSectionConfig {
//   /** matches if the current pathname starts with any of these prefixes */
//   match: string[];
//   items: SidebarItem[];
// }

// export type FlowStatus = "DRAFT" | "DEPRECATED" | "PUBLISHED" | "THROTTLED";

// export interface FlowRow {
//   id: string;
//   name: string;
//   flowId: string;
//   category: string;
//   status: FlowStatus;
//   lastEdited: string;
// }

// export interface SidebarGroup {
//   type: "group";
//   label: string;
//   icon?: ReactNode;
//   defaultOpen?: boolean;
//   children: SidebarItem[];
// }

// export type SidebarEntry = SidebarItem | SidebarGroup;

// export interface SidebarSectionConfig {
//   match: string[];
//   items: SidebarEntry[];
// }

export type LayoutType = "dashboard" | "simple" | "chat" | "none";

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  disabled?: boolean;
}

export interface SidebarItem {
  label: string;
  path: string;
  icon?: ReactNode;
  badge?: string | number;
  badgeVariant?: "recommended" | "count";
  disabled?: boolean;
}

// A collapsible group containing child items (e.g. "Trigger > Rules")
export interface SidebarGroup {
  type: "group";
  label: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: SidebarItem[];
}

// A section entry is either a flat item or a collapsible group
export type SidebarEntry = SidebarItem | SidebarGroup;

export interface SidebarSectionConfig {
  match: string[];
  items: SidebarEntry[];
}

export interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: number;
  online: boolean;
}

export interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  totalOrders: number;
  status: "active" | "inactive" | "pending";
}

export interface RouteConfig {
  path: string;
  element: ReactNode;
  layout: LayoutType;
  label: string;
}

export interface LeadStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  color: string;
  borderColor: string;
}

export interface TeamMemberRow {
  id: string;
  name: string;
  employeeId: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  ticketsPending: number;
  wonLeads: string;
  avatar?: string;
}

export interface TopPerformer {
  rank: number;
  name: string;
  role: string;
  wonLeads: number;
  change: string;
  avatar?: string;
}

export type FlowStatus = "DRAFT" | "DEPRECATED" | "PUBLISHED" | "THROTTLED";

export interface FlowRow {
  id: string;
  name: string;
  flowId: string;
  category: string;
  status: FlowStatus;
  lastEdited: string;
}

export interface AutomationAction {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
}

export interface MaterialRow {
  id: string;
  name: string;
  description: string;
}
