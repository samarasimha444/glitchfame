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
        <Toaster position="bottom-right" reverseOrder={false} />

      </SkeletonProvider>
      
    </BrowserRouter>
  </QueryClientProvider>
);