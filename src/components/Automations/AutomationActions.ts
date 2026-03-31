import { Bell, UserCheck, Users } from "lucide-react";

export interface AutomationAction {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
}

export const AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: "send-notifications",
    icon: Bell,
    label: "Send Notifications",
    description: "Send notifications within company",
  },
  {
    id: "assign-to-user",
    icon: UserCheck,
    label: "Assign to user",
    description: "Assign conversation to a user",
  },
  {
    id: "assign-to-team",
    icon: Users,
    label: "Assign to team",
    description: "Send notifications within company",
  },
];
