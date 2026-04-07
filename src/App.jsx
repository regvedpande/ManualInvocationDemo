import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import InvocationInitiation from "./pages/InvocationInitiation";
import AccountMaker from "./pages/AccountMaker";
import AccountChecker from "./pages/AccountChecker";
import RiskApproval from "./pages/RiskApproval";
import TargetDPMaster from "./pages/TargetDPMaster";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/initiate" element={<InvocationInitiation />} />
              <Route path="/maker" element={<AccountMaker />} />
              <Route path="/checker" element={<AccountChecker />} />
              <Route path="/risk" element={<RiskApproval />} />
              <Route path="/target-dp" element={<TargetDPMaster />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
