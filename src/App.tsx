import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

function PortfolioOverview() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "system-ui" }}>
      <h1>Fiscal Genius Hub</h1>
      <p>Sanitized portfolio snapshot of a fiscal-document platform built with React, TypeScript and Supabase.</p>
      <section>
        <h2>Application areas</h2>
        <ul>
          <li>Authentication and onboarding</li>
          <li>Fiscal-document scanning and OCR</li>
          <li>Company and accountant dashboards</li>
          <li>Retailer, affiliate and administrative workflows</li>
          <li>Cashback, reports and export flows</li>
        </ul>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<PortfolioOverview />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
