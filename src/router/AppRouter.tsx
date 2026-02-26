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

const routeConfigs: RouteConfig[] = [
  {
    path: "/",
    element: <Dashboard />,
    layout: "dashboard",
    label: "Dashboard",
  },
  {
    path: "/contacts",
    element: <Contacts />,
    layout: "simple",
    label: "Contacts",
  },
  {
    path: "/flows",
    element: <Flows />,
    layout: "dashboard",
    label: "Flows",
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
