import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Card, CardContent, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Stack, Button, Chip, useMediaQuery, useTheme, alpha,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import StatusChip from "../components/StatusChip";

const statCards = [
  { label: "Total Requests",   value: stats.total,           icon: TrendingUpIcon,           gradient: "linear-gradient(135deg, #1e40af, #3b82f6)", path: "/initiate" },
  { label: "Pending Maker",    value: stats.pendingMaker,    icon: PendingActionsIcon,        gradient: "linear-gradient(135deg, #d97706, #f59e0b)", path: "/maker" },
  { label: "Pending Checker",  value: stats.pendingChecker,  icon: PendingActionsIcon,        gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)", path: "/checker" },
  { label: "Pending Risk",     value: stats.pendingRisk,     icon: PendingActionsIcon,        gradient: "linear-gradient(135deg, #0369a1, #38bdf8)", path: "/risk" },
  { label: "Approved",         value: stats.approved,        icon: CheckCircleOutlineIcon,    gradient: "linear-gradient(135deg, #059669, #34d399)", path: "/" },
  { label: "Rejected",         value: stats.rejected,        icon: CancelOutlinedIcon,        gradient: "linear-gradient(135deg, #dc2626, #f87171)", path: "/" },
];

const barData = [
  { name: "Apr 1", requests: 1, color: "#3b82f6" },
  { name: "Apr 2", requests: 2, color: "#3b82f6" },
  { name: "Apr 3", requests: 2, color: "#3b82f6" },
  { name: "Apr 4", requests: 1, color: "#3b82f6" },
  { name: "Apr 5", requests: 2, color: "#3b82f6" },
];

const statusData = [
  { label: "Pending Maker",   value: 2,  color: "#f59e0b", pct: 25 },
  { label: "Pending Checker", value: 2,  color: "#8b5cf6", pct: 25 },
  { label: "Pending Risk",    value: 2,  color: "#0ea5e9", pct: 25 },
  { label: "Approved",        value: 1,  color: "#10b981", pct: 12.5 },
  { label: "Rejected",        value: 1,  color: "#ef4444", pct: 12.5 },
];

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const steps = [
  { n: "01", title: "Initiate",        desc: "Submit a pledge invocation request with ISIN, quantity, and documents.",   color: "#3b82f6", path: "/initiate" },
  { n: "02", title: "Account Maker",   desc: "First-level reviewer verifies the request and approves or rejects.",        color: "#f59e0b", path: "/maker" },
  { n: "03", title: "Account Checker", desc: "Second-level reviewer re-validates before escalating to Risk.",             color: "#8b5cf6", path: "/checker" },
  { n: "04", title: "Risk Approval",   desc: "Risk team gives final sign-off. Approved requests trigger invocation.",     color: "#10b981", path: "/risk" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { invocations, stats } = useContext(AppContext);

  return (
    <Box>
      {/* Recruiter banner */}
      <Card sx={{
        mb: 3,
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)",
        color: "white", overflow: "hidden", position: "relative",
      }}>
        <Box sx={{
          position: "absolute", right: -40, top: -40, width: 200, height: 200,
          borderRadius: "50%", bgcolor: alpha("#fff", 0.03),
        }} />
        <Box sx={{
          position: "absolute", right: 60, bottom: -60, width: 150, height: 150,
          borderRadius: "50%", bgcolor: alpha("#fff", 0.04),
        }} />
        <CardContent sx={{ py: 3, px: { xs: 2.5, sm: 3.5 }, position: "relative" }}>
          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
            <InfoOutlinedIcon sx={{ color: "#fbbf24", mt: 0.3, flexShrink: 0 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: 15, sm: 18 } }}>
                Welcome to the Manual Invocation Demo
              </Typography>
              <Typography sx={{ opacity: 0.75, fontSize: { xs: 12.5, sm: 14 }, lineHeight: 1.6, mb: 2, maxWidth: 680 }}>
                This is a <strong style={{ color: "#fbbf24" }}>fully interactive mock demo</strong> of a financial pledge invocation workflow used
                by NBFCs and lending institutions. No login or backend needed — all data is in-memory. Click any step below
                or use the sidebar to explore each stage.
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {steps.map((s) => (
                  <Button
                    key={s.n}
                    size="small"
                    onClick={() => navigate(s.path)}
                    sx={{
                      bgcolor: alpha("#fff", 0.1), color: "white",
                      border: `1px solid ${alpha("#fff", 0.2)}`,
                      "&:hover": { bgcolor: alpha("#fff", 0.18) },
                      fontSize: 12, px: 1.5,
                    }}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: "13px !important" }} />}
                  >
                    {s.n} · {s.title}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Grid item xs={6} sm={4} md={2} key={s.label}>
              <Card
                onClick={() => navigate(s.path)}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                  overflow: "hidden", position: "relative",
                }}
              >
                <Box sx={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 4,
                  background: s.gradient,
                }} />
                <CardContent sx={{ pt: 2.5, pb: "16px !important", px: 2 }}>
                  <Box sx={{
                    width: 38, height: 38, borderRadius: 2,
                    background: s.gradient, display: "flex",
                    alignItems: "center", justifyContent: "center", mb: 1.5,
                  }}>
                    <Icon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontSize: { xs: 26, sm: 30 }, lineHeight: 1, mb: 0.4 }}>
                    {s.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.3, display: "block" }}>
                    {s.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Portfolio value bar */}
      <Card sx={{ mb: 3, background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", color: "white" }}>
        <CardContent sx={{ py: 2.5, px: { xs: 2.5, sm: 3.5 }, "&:last-child": { pb: 2.5 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={{ xs: 1, sm: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: 2.5,
                bgcolor: alpha("#fff", 0.15), display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography sx={{ opacity: 0.7, fontSize: 12, mb: 0.2 }}>Total Portfolio Invocation Value</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{fmt(stats.totalValue)}</Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={3} sx={{ pl: { sm: 3 } }}>
              {[
                { label: "Active", value: stats.pendingMaker + stats.pendingChecker + stats.pendingRisk },
                { label: "Approved", value: stats.approved },
                { label: "Rejected", value: stats.rejected },
              ].map((item) => (
                <Box key={item.label} sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>{item.value}</Typography>
                  <Typography sx={{ opacity: 0.6, fontSize: 11 }}>{item.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Charts row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Bar Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Daily Requests</Typography>
              <Typography variant="caption" color="text.secondary">April 2025 — Invocation requests submitted per day</Typography>
              <Box sx={{ mt: 2, height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={isSm ? 24 : 36} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <RechartTooltip
                      contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: 13 }}
                      cursor={{ fill: "#f1f5f9" }}
                    />
                    <Bar dataKey="requests" radius={[8, 8, 0, 0]}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={i === barData.length - 1 ? "#1e40af" : "#3b82f6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status breakdown — horizontal bars instead of pie */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Status Breakdown</Typography>
              <Typography variant="caption" color="text.secondary">Distribution across all 8 requests</Typography>
              <Stack spacing={1.8} sx={{ mt: 2.5 }}>
                {statusData.map((s) => (
                  <Box key={s.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>{s.label}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>{s.value} · {s.pct}%</Typography>
                    </Stack>
                    <Box sx={{ height: 8, bgcolor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                      <Box sx={{
                        height: "100%", width: `${s.pct}%`,
                        bgcolor: s.color, borderRadius: 4,
                        transition: "width 1s ease",
                      }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workflow steps */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>How to Explore This Demo</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2.5 }}>
            Click any stage to jump directly to that screen and try out the approval workflow
          </Typography>
          <Grid container spacing={2}>
            {steps.map((s, i) => (
              <Grid item xs={12} sm={6} md={3} key={s.n}>
                <Box
                  onClick={() => navigate(s.path)}
                  sx={{
                    p: 2, borderRadius: 3, border: "1.5px solid #e2e8f0",
                    cursor: "pointer", transition: "all 0.15s",
                    "&:hover": {
                      border: `1.5px solid ${s.color}`,
                      bgcolor: alpha(s.color, 0.04),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{
                    width: 36, height: 36, borderRadius: 2, bgcolor: alpha(s.color, 0.12),
                    display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5,
                  }}>
                    <Typography sx={{ fontWeight: 800, color: s.color, fontSize: 14 }}>{s.n}</Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{s.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{s.desc}</Typography>
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="caption" sx={{ color: s.color, fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
                      Try it <ArrowForwardIcon sx={{ fontSize: 12 }} />
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recent requests table */}
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="subtitle1">Recent Requests</Typography>
              <Typography variant="caption" color="text.secondary">Latest invocation submissions across all stages</Typography>
            </Box>
            <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/initiate")}>
              View All
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
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
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main", fontFamily: "monospace" }}>
                        {row.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.clientName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{row.scripName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{row.quantity.toLocaleString("en-IN")}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">₹{row.cmp.toLocaleString("en-IN")}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        ₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.product} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                    </TableCell>
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
