import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import theme from "./theme";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";

const Dashboard            = lazy(() => import("./pages/Dashboard"));
const InvocationInitiation = lazy(() => import("./pages/InvocationInitiation"));
const AccountMaker         = lazy(() => import("./pages/AccountMaker"));
const AccountChecker       = lazy(() => import("./pages/AccountChecker"));
const RiskApproval         = lazy(() => import("./pages/RiskApproval"));
const TargetDPMaster       = lazy(() => import("./pages/TargetDPMaster"));

function PageLoader() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <CircularProgress size={32} thickness={4} />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"          element={<Dashboard />} />
                <Route path="/initiate"  element={<InvocationInitiation />} />
                <Route path="/maker"     element={<AccountMaker />} />
                <Route path="/checker"   element={<AccountChecker />} />
                <Route path="/risk"      element={<RiskApproval />} />
                <Route path="/target-dp" element={<TargetDPMaster />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
