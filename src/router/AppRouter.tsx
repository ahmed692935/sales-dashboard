import { Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";
import SimpleLayout from "../layouts/SimpleLayout";
import ChatLayout from "../layouts/ChatLayout";

// Pages
// import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
// import Chat from "../pages/Chat";
// import Settings from "../pages/Settings";

import type { ReactNode } from "react";
import type { LayoutType, RouteConfig } from "../types";
import Contacts from "../pages/Contacts";
import Flows from "../pages/Flows";
import TeamInbox from "../pages/TeamInbox";
import Stages from "../pages/Stages";
import Teams from "../pages/Teams";
import Roles from "../pages/Roles";
import Members from "../pages/Members";
import Templates from "../pages/Templates";
import MessageTemplates from "../pages/MessageTemplates";
import Compaigns from "../pages/Compaigns";

const routeConfigs: RouteConfig[] = [
  {
    path: "/",
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
];

const layoutWrappers: Record<LayoutType, (children: ReactNode) => ReactNode> = {
  dashboard: (children) => <DashboardLayout>{children}</DashboardLayout>,
  simple: (children) => <SimpleLayout>{children}</SimpleLayout>,
  chat: (children) => <ChatLayout>{children}</ChatLayout>,
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
