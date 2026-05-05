import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardContent, Chip, Grid, InputAdornment, Slider,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, alpha, useMediaQuery, useTheme,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InsightsIcon from "@mui/icons-material/Insights";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as RechartTooltip, XAxis, YAxis,
} from "recharts";
import { AppContext } from "../context/InvocationContext";
import StatusChip from "../components/StatusChip";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const steps = [
  { n: "01", title: "Originate", desc: "Create a pledged-security invocation request with demat and loan context.", color: "#1e40af", path: "/initiate" },
  { n: "02", title: "Maker Control", desc: "Validate documents, pledge identifiers, and requested transfer quantity.", color: "#d97706", path: "/maker" },
  { n: "03", title: "Checker Control", desc: "Run independent four-eye review before final risk sign-off.", color: "#7c3aed", path: "/checker" },
  { n: "04", title: "Risk Sign-off", desc: "Review exposure, concentration, LTV pressure, and execution readiness.", color: "#0369a1", path: "/risk" },
];

const getRequestValue = (row) => row.quantity * row.cmp;

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { invocations, stats } = useContext(AppContext);
  const [scenario, setScenario] = useState({
    quantity: 450,
    cmp: 1825,
    haircut: 22,
    loanOutstanding: 525000,
  });

  const pendingCount = stats.pendingMaker + stats.pendingChecker + stats.pendingRisk;
  const approvedValue = invocations
    .filter((row) => row.status === "Approved")
    .reduce((sum, row) => sum + getRequestValue(row), 0);
  const pendingValue = invocations
    .filter((row) => row.status.startsWith("Pending"))
    .reduce((sum, row) => sum + getRequestValue(row), 0);
  const largestExposure = invocations.reduce((max, row) => Math.max(max, getRequestValue(row)), 0);
  const completionRate = Math.round((stats.approved / Math.max(stats.total, 1)) * 100);
  const exceptionRate = Math.round((stats.rejected / Math.max(stats.total, 1)) * 100);
  const highValueCount = invocations.filter((row) => getRequestValue(row) > 750000).length;

  const dailyData = useMemo(() => {
    const byDate = invocations.reduce((acc, row) => {
      const key = new Date(row.requestDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(byDate)
      .map(([name, requests]) => ({ name, requests }))
      .reverse();
  }, [invocations]);

  const statusData = [
    { label: "Maker", value: stats.pendingMaker, color: "#d97706" },
    { label: "Checker", value: stats.pendingChecker, color: "#7c3aed" },
    { label: "Risk", value: stats.pendingRisk, color: "#0369a1" },
    { label: "Approved", value: stats.approved, color: "#059669" },
    { label: "Rejected", value: stats.rejected, color: "#dc2626" },
  ].map((item) => ({
    ...item,
    pct: Math.round((item.value / Math.max(stats.total, 1)) * 100),
  }));

  const collateralValue = Number(scenario.quantity) * Number(scenario.cmp);
  const postHaircutValue = collateralValue * (1 - Number(scenario.haircut) / 100);
  const coverageRatio = postHaircutValue / Math.max(Number(scenario.loanOutstanding), 1);
  const suggestedBand =
    coverageRatio >= 1.35 ? { label: "Comfortable", color: "#059669", bg: "#f0fdf4" } :
    coverageRatio >= 1.1 ? { label: "Watchlist", color: "#d97706", bg: "#fffbeb" } :
    { label: "Escalate", color: "#dc2626", bg: "#fef2f2" };

  const executiveCards = [
    {
      label: "Invocation Exposure",
      value: fmt(stats.totalValue),
      detail: `${pendingCount} active controls in flight`,
      icon: AccountBalanceWalletIcon,
      color: "#1e40af",
    },
    {
      label: "Approved Collateral",
      value: fmt(approvedValue),
      detail: `${completionRate}% completion rate`,
      icon: FactCheckIcon,
      color: "#059669",
    },
    {
      label: "Pending Exposure",
      value: fmt(pendingValue),
      detail: "Maker, checker, and risk queues",
      icon: PendingActionsIcon,
      color: "#d97706",
    },
    {
      label: "Risk Exceptions",
      value: `${exceptionRate}%`,
      detail: `${highValueCount} high-value requests flagged`,
      icon: ShieldOutlinedIcon,
      color: "#dc2626",
    },
  ];

  return (
    <Box>
      <Card
        sx={{
          mb: 3,
          background: "radial-gradient(circle at 82% 18%, rgba(251,191,36,0.32), transparent 26%), radial-gradient(circle at 12% 86%, rgba(59,130,246,0.18), transparent 22%), linear-gradient(135deg, #07111f 0%, #10213f 48%, #123f57 100%)",
          color: "white",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.18 }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.04), transparent 40%, rgba(255,255,255,0.03))" }} />
        <CardContent sx={{ p: { xs: 2.5, md: 4 }, position: "relative" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Wealth operations control tower"
                sx={{ mb: 2, bgcolor: alpha("#fbbf24", 0.16), color: "#fde68a", border: "1px solid rgba(251,191,36,0.28)", fontWeight: 800 }}
              />
              <Typography variant="h4" sx={{ color: "white", fontSize: { xs: 26, md: 38 }, lineHeight: 1.1, mb: 1.5 }}>
                Collateral invocation with maker-checker controls, risk scoring, and demat readiness.
              </Typography>
              <Typography sx={{ color: alpha("#fff", 0.72), maxWidth: 680, lineHeight: 1.7, mb: 2.5 }}>
                A synthetic wealth-management workflow for loan-against-securities portfolios. Submit requests, move them through approvals, and watch exposure update at every stage.
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Button variant="contained" color="secondary" onClick={() => navigate("/initiate")} endIcon={<ArrowForwardIcon />}>
                  Start a request
                </Button>
                <Button variant="outlined" onClick={() => navigate("/risk")} sx={{ color: "white", borderColor: alpha("#fff", 0.35), backdropFilter: "blur(8px)" }}>
                  Review risk queue
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ bgcolor: alpha("#fff", 0.09), border: "1px solid rgba(255,255,255,0.16)", color: "white", boxShadow: "none", backdropFilter: "blur(14px)" }}>
                <CardContent>
                  <Stack spacing={2}>
                    {[
                      { label: "Largest single exposure", value: fmt(largestExposure), icon: TrendingUpIcon },
                      { label: "SLA posture", value: pendingCount <= 6 ? "Healthy" : "Attention", icon: SpeedIcon },
                      { label: "Risk model", value: "LTV + concentration + product rules", icon: HealthAndSafetyIcon },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Stack key={item.label} direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                          <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: alpha("#fff", 0.13), display: "grid", placeItems: "center" }}>
                            <Icon sx={{ color: "#fbbf24" }} />
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ color: alpha("#fff", 0.55), fontSize: 12 }}>{item.label}</Typography>
                            <Typography sx={{ fontWeight: 800, overflowWrap: "anywhere", lineHeight: 1.25 }}>{item.value}</Typography>
                          </Box>
                        </Stack>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {executiveCards.map((item) => {
          const Icon = item.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.label}>
              <Card sx={{ height: "100%", position: "relative", overflow: "hidden", transition: "transform 0.18s ease, box-shadow 0.18s ease", "&:hover": { transform: "translateY(-3px)" } }}>
                <Box sx={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${alpha(item.color, 0.08)}, transparent 55%)` }} />
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${item.color}, ${alpha(item.color, 0.3)})`, borderRadius: "20px 20px 0 0" }} />
                <CardContent sx={{ position: "relative", pt: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                      {item.label}
                    </Typography>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(item.color, 0.1), display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon sx={{ color: item.color, fontSize: 20 }} />
                    </Box>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: item.color, mb: 0.4 }}>{item.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.detail}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1">Operations Pulse</Typography>
                  <Typography variant="caption" color="text.secondary">Requests by submission date with live in-memory state</Typography>
                </Box>
                <Chip label={`${stats.total} total requests`} variant="outlined" />
              </Stack>
              <Box sx={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} barSize={isSm ? 24 : 38} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <RechartTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 28px rgba(15,23,42,0.14)", fontSize: 13 }} />
                    <Bar dataKey="requests" radius={[8, 8, 0, 0]}>
                      {dailyData.map((entry, i) => (
                        <Cell key={entry.name} fill={i === dailyData.length - 1 ? "#0f766e" : "#1e40af"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1">Control Queue Mix</Typography>
              <Typography variant="caption" color="text.secondary">Distribution across workflow states</Typography>
              <Stack spacing={1.8} sx={{ mt: 2.5 }}>
                {statusData.map((item) => (
                  <Box key={item.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.value} · {item.pct}%</Typography>
                    </Stack>
                    <Box sx={{ height: 9, bgcolor: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                      <Box sx={{ height: "100%", width: `${item.pct}%`, minWidth: item.value ? 12 : 0, bgcolor: item.color, borderRadius: 6 }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%", border: `1px solid ${alpha(suggestedBand.color, 0.22)}` }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: "#eff6ff", display: "grid", placeItems: "center" }}>
                  <InsightsIcon sx={{ color: "#1e40af" }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1">Collateral Scenario Lab</Typography>
                  <Typography variant="caption" color="text.secondary">Experiment with haircut and loan exposure</Typography>
                </Box>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={scenario.quantity}
                    onChange={(e) => setScenario((prev) => ({ ...prev, quantity: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="CMP"
                    type="number"
                    fullWidth
                    value={scenario.cmp}
                    onChange={(e) => setScenario((prev) => ({ ...prev, cmp: e.target.value }))}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Risk haircut: {scenario.haircut}%</Typography>
                  <Slider
                    value={Number(scenario.haircut)}
                    min={0}
                    max={50}
                    step={1}
                    onChange={(_, value) => setScenario((prev) => ({ ...prev, haircut: value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Loan outstanding"
                    type="number"
                    fullWidth
                    value={scenario.loanOutstanding}
                    onChange={(e) => setScenario((prev) => ({ ...prev, loanOutstanding: e.target.value }))}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2.5, p: 2.25, borderRadius: 3.5, bgcolor: suggestedBand.bg, border: `1px solid ${alpha(suggestedBand.color, 0.28)}`, boxShadow: `inset 0 1px 0 ${alpha("#fff", 0.75)}` }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Post-haircut collateral</Typography>
                  <Chip label={suggestedBand.label} size="small" sx={{ bgcolor: "white", color: suggestedBand.color, fontWeight: 800 }} />
                </Stack>
                <Typography variant="h5" sx={{ color: suggestedBand.color, fontWeight: 900 }}>{fmt(postHaircutValue)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Coverage ratio: <strong>{coverageRatio.toFixed(2)}x</strong> against outstanding loan.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1">Operational Workflow</Typography>
              <Typography variant="caption" color="text.secondary">Navigate through approval stages</Typography>
              <Grid container spacing={1.5} sx={{ mt: 1 }}>
                {steps.map((step) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={step.n}>
                    <Box
                      onClick={() => navigate(step.path)}
                      sx={{
                        p: 2.1,
                        height: "100%",
                        borderRadius: 3.5,
                        border: "1px solid #e2e8f0",
                        cursor: "pointer",
                        transition: "all 0.18s ease",
                        "&:hover": { borderColor: step.color, bgcolor: alpha(step.color, 0.04), transform: "translateY(-2px)" },
                      }}
                    >
                      <Stack direction="row" spacing={1.2} alignItems="flex-start">
                        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: alpha(step.color, 0.12), display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <Typography sx={{ color: step.color, fontWeight: 900 }}>{step.n}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2">{step.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{step.desc}</Typography>
                          <Typography variant="caption" sx={{ mt: 1, color: step.color, fontWeight: 800, display: "flex", alignItems: "center", gap: 0.5 }}>
                            Open stage <ArrowForwardIcon sx={{ fontSize: 13 }} />
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} sx={{ mb: 2 }} spacing={1}>
            <Box>
              <Typography variant="subtitle1">Recent Invocation Requests</Typography>
              <Typography variant="caption" color="text.secondary">Operational snapshot with value, product, and status</Typography>
            </Box>
            <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/initiate")}>
              View request ledger
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small" sx={{ minWidth: 860 }}>
              <TableHead>
                <TableRow>
                  {["Request ID", "Client", "Scrip", "Qty", "CMP", "Value", "Product", "Status"].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {invocations.slice(0, 6).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 800, color: "#1e40af", fontSize: 12 }}>{row.id}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>{row.clientName}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.scripName}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>₹{row.cmp.toLocaleString("en-IN")}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>{fmt(getRequestValue(row))}</TableCell>
                    <TableCell><Chip label={row.product || "LAS"} size="small" variant="outlined" sx={{ fontSize: 10 }} /></TableCell>
                    <TableCell><StatusChip status={row.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
