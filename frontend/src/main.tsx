import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import LandingPage from "./pages/landing_page";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import AdminPage from "./pages/AdminPage.tsx";
import Dashboard from "./components/layout/Dashboard.tsx";
import DonorPage from "./pages/DonorPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard />}>
          <Route index element={<AdminPage />} />
          
          <Route path="donor" element={<DonorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
