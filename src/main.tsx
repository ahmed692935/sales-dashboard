import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify/unstyled";
import { AuthProvider } from "./context/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          toastStyle={{
            backgroundColor: "#111827",
            border: "1px solid #1f2937",
          }}
        />
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
