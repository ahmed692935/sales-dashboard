import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";
import SimpleLayout from "../layouts/SimpleLayout";
import ChatLayout from "../layouts/ChatLayout";

// Pages
// import Home from "../pages/Home";
const Dashboard = lazy(() => import("../pages/Dashboard"));
// import Chat from "../pages/Chat";
// import Settings from "../pages/Settings";

import type { ReactNode } from "react";
import type { LayoutType, RouteConfig } from "../types";

const Contacts = lazy(() => import("../pages/Contacts"));
const Flows = lazy(() => import("../pages/Flows"));
const TeamInbox = lazy(() => import("../pages/TeamInbox"));
const Stages = lazy(() => import("../pages/Stages"));
const Teams = lazy(() => import("../pages/Teams"));
const Roles = lazy(() => import("../pages/Roles"));
const Members = lazy(() => import("../pages/Members"));
const Templates = lazy(() => import("../pages/Templates"));
const MessageTemplates = lazy(() => import("../pages/MessageTemplates"));
const Compaigns = lazy(() => import("../pages/Compaigns"));
const SalesAnalytics = lazy(() => import("../pages/SalesAnalytics"));
const Automations = lazy(() => import("../pages/Automations"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Resigter"));
const KanbanPage = lazy(() => import("../pages/Kanban"));

const routeConfigs: RouteConfig[] = [
  {
    path: "/",
    element: <Login />,
    layout: "none",
    label: "Login",
  },
  {
    path: "/register",
    element: <Register />,
    layout: "none",
    label: "Register",
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    layout: "dashboard",
    label: "Dashboard",
  },
  {
    path: "/lead-stages",
    element: <Stages />,
    layout: "dashboard",
    label: "Lead Stages",
  },
  {
    path: "/teams",
    element: <Teams />,
    layout: "dashboard",
    label: "Teams",
  },
  {
    path: "/permission&roles",
    element: <Roles />,
    layout: "dashboard",
    label: "Permission & Roles",
  },
  {
    path: "/members",
    element: <Members />,
    layout: "dashboard",
    label: "Members",
  },
  {
    path: "/contacts",
    element: <Contacts />,
    layout: "simple",
    label: "Contacts",
  },
  {
    path: "/campaigns",
    element: <Compaigns />,
    layout: "dashboard",
    label: "Compaigns",
  },
  {
    path: "/flows",
    element: <Flows />,
    layout: "dashboard",
    label: "Flows",
  },
  {
    path: "/sales-analytics",
    element: <SalesAnalytics />,
    layout: "dashboard",
    label: "Sales Analytics",
  },
  {
    path: "/automations",
    element: <Automations />,
    layout: "dashboard",
    label: "Automations",
  },
  {
    path: "/flows/templates",
    element: <Templates />,
    layout: "dashboard",
    label: "Templates",
  },
  {
    path: "/flows/message-templates",
    element: <MessageTemplates />,
    layout: "dashboard",
    label: "Message Templates",
  },
  {
    path: "/inbox",
    element: <TeamInbox />,
    layout: "chat",
    label: "Team Inbox",
  },
  {
    path: "/kanban",
    element: <KanbanPage />,
    layout: "dashboard",
    label: "Kanban",
  },
];

const layoutWrappers: Record<LayoutType, (children: ReactNode) => ReactNode> = {
  dashboard: (children) => <DashboardLayout>{children}</DashboardLayout>,
  simple: (children) => <SimpleLayout>{children}</SimpleLayout>,
  chat: (children) => <ChatLayout>{children}</ChatLayout>,
  none: (children) => <>{children}</>,
};

const AppRouter = () => {
  return (
    <Routes>
      {routeConfigs.map(({ path, element, layout }) => (
        <Route
          key={path}
          path={path}
          element={layoutWrappers[layout](element)}
        />
      ))}
    </Routes>
  );
};

export default AppRouter;
