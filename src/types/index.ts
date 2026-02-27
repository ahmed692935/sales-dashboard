import type { ReactNode } from "react";

export type LayoutType = "dashboard" | "simple" | "chat";

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  disabled?: boolean;
}

export interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: number;
  disabled?: boolean; 
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
}

export interface TopPerformer {
  rank: number;
  name: string;
  role: string;
  wonLeads: number;
  change: string;
}

/** Map of route-prefix → sidebar items shown for that section */
export interface SidebarSectionConfig {
  /** matches if the current pathname starts with any of these prefixes */
  match: string[];
  items: SidebarItem[];
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
