import React from "react"
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SkeletonProvider from "./components/loaders";
import App from "./App";
import './index.css'
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <SkeletonProvider>
        <App />
         <Toaster
          position="bottom-right"
          gutter={8}
          containerStyle={{
            bottom: 20,
            right: 20,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(17, 22, 31, 0.85)",
              color: "#e5e7eb",
              padding: "10px 14px",
              fontSize: "13px",
              borderRadius: "10px",
              border: "1px solid rgba(145, 207, 208, 0.25)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
            },
            success: {
              iconTheme: {
                primary: "#91CFD0",
                secondary: "#0f0f18",
              },
              style: {
                border: "1px solid rgba(145, 207, 208, 0.5)",
                background: "rgba(145, 207, 208, 0.08)",
              },
            },
            error: {
              iconTheme: {
                primary: "#ff4d4f",
                secondary: "#0f0f18",
              },
              style: {
                border: "1px solid rgba(255, 77, 79, 0.4)",
              },
            },
          }}
        />

      </SkeletonProvider>
      
    </BrowserRouter>
  </QueryClientProvider>
);