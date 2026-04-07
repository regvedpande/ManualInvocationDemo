import React from "react";
import {
  Grid, Card, CardContent, Typography, Box, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, LinearProgress, Stack,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { invocations, stats } from "../mockData";
import StatusChip from "../components/StatusChip";

const statCards = [
  { label: "Total Requests", value: stats.total, icon: <TrendingUpIcon />, color: "#1a3c6e", bg: "#e8edf5" },
  { label: "Pending Maker", value: stats.pendingMaker, icon: <PendingActionsIcon />, color: "#e65100", bg: "#fbe9e7" },
  { label: "Pending Checker", value: stats.pendingChecker, icon: <PendingActionsIcon />, color: "#1565c0", bg: "#e3f2fd" },
  { label: "Pending Risk", value: stats.pendingRisk, icon: <PendingActionsIcon />, color: "#6a1b9a", bg: "#f3e5f5" },
  { label: "Approved", value: stats.approved, icon: <CheckCircleOutlineIcon />, color: "#2e7d32", bg: "#e8f5e9" },
  { label: "Rejected", value: stats.rejected, icon: <CancelOutlinedIcon />, color: "#c62828", bg: "#ffebee" },
];

const barData = [
  { name: "Apr 1", requests: 1 },
  { name: "Apr 2", requests: 2 },
  { name: "Apr 3", requests: 2 },
  { name: "Apr 4", requests: 1 },
  { name: "Apr 5", requests: 2 },
];

const pieData = [
  { name: "Pending Maker", value: 2, color: "#ff7043" },
  { name: "Pending Checker", value: 2, color: "#1e88e5" },
  { name: "Pending Risk", value: 2, color: "#8e24aa" },
  { name: "Approved", value: 1, color: "#43a047" },
  { name: "Rejected", value: 1, color: "#e53935" },
];

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  return (
    <Box>
      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((s) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={s.label}>
            <Card>
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: s.bg, width: 42, height: 42 }}>
                    <Box sx={{ color: s.color, display: "flex" }}>{s.icon}</Box>
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Total Value Banner */}
      <Card sx={{ mb: 3, background: "linear-gradient(135deg, #1a3c6e 0%, #2a5298 100%)", color: "white" }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, "&:last-child": { pb: 2 } }}>
          <AccountBalanceWalletIcon sx={{ fontSize: 36, opacity: 0.8 }} />
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Total Invocation Value (Portfolio)</Typography>
            <Typography variant="h5">{fmt(stats.totalValue)}</Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Stack spacing={0.5} sx={{ textAlign: "right" }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Active Requests</Typography>
            <Typography variant="h6">{stats.pendingMaker + stats.pendingChecker + stats.pendingRisk}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Bar Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: 260 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Daily Invocation Requests</Typography>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={barData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#1a3c6e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 260 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Status Distribution</Typography>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Requests */}
      <Card>
        <CardContent sx={{ pb: "0 !important" }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Recent Invocation Requests</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8ecf0", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                  {["Request ID", "Client Name", "Scrip Name", "Quantity", "CMP", "Value", "Status"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {invocations.slice(0, 6).map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "primary.main" }}>{row.id}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.clientName}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.scripName}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>₹{row.cmp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</TableCell>
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
