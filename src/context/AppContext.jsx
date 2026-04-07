import React, { createContext, useState, useCallback } from "react";
import { invocations as seed, targetDPs as seedDPs } from "../mockData";

export const AppContext = createContext(null);

let idCounter = seed.length + 1;

export function AppProvider({ children }) {
  const [invocations, setInvocations] = useState(seed);
  const [targetDPs, setTargetDPs] = useState(seedDPs);

  // ── Invocation CRUD ──────────────────────────────────────────────
  const addInvocation = useCallback((form) => {
    const id = `INV-${String(idCounter++).padStart(3, "0")}`;
    setInvocations((prev) => [
      {
        ...form,
        id,
        requestDate: new Date().toISOString().split("T")[0],
        status: "Pending Maker",
        remarks: "",
      },
      ...prev,
    ]);
  }, []);

  const updateStatus = useCallback((id, status, remarks = "") => {
    setInvocations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, remarks } : r))
    );
  }, []);

  // ── Target DP CRUD ────────────────────────────────────────────────
  const addTargetDP = useCallback((form) => {
    setTargetDPs((prev) => [
      ...prev,
      { ...form, id: prev.length + 1, status: "Pending" },
    ]);
  }, []);

  const approveTargetDP = useCallback((id) => {
    setTargetDPs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Active" } : r))
    );
  }, []);

  const deleteTargetDP = useCallback((id) => {
    setTargetDPs((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // ── Derived views ────────────────────────────────────────────────
  const pendingMaker   = invocations.filter((r) => r.status === "Pending Maker");
  const pendingChecker = invocations.filter((r) => r.status === "Pending Checker");
  const pendingRisk    = invocations.filter((r) => r.status === "Pending Risk");
  const approved       = invocations.filter((r) => r.status === "Approved");
  const rejected       = invocations.filter((r) => r.status === "Rejected");

  const stats = {
    total:          invocations.length,
    pendingMaker:   pendingMaker.length,
    pendingChecker: pendingChecker.length,
    pendingRisk:    pendingRisk.length,
    approved:       approved.length,
    rejected:       rejected.length,
    totalValue:     invocations.reduce((s, i) => s + i.quantity * i.cmp, 0),
  };

  return (
    <AppContext.Provider value={{
      invocations, pendingMaker, pendingChecker, pendingRisk, approved, rejected,
      addInvocation, updateStatus, stats,
      targetDPs, addTargetDP, approveTargetDP, deleteTargetDP,
    }}>
      {children}
    </AppContext.Provider>
  );
}
