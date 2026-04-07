import React, { useState, useContext } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Alert, Snackbar, Stack,
  InputAdornment, Chip, Divider, Switch, FormControlLabel,
  LinearProgress, Tooltip, alpha,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { AppContext } from "../context/AppContext";
import PageHeader from "../components/PageHeader";

const DetailRow = ({ label, value }) => (
  <Grid item xs={6} sm={4}>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.3 }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>{value || "—"}</Typography>
  </Grid>
);

const riskScore = (row) => {
  let score = 45;
  if (row.quantity > 400) score += 20;
  if (row.cmp > 2000) score += 15;
  if (row.product === "CC") score += 10;
  if (row.quantity > 800) score += 10;
  return Math.min(score, 95);
};

const riskBand = (score) =>
  score < 55 ? { label: "Low Risk",    color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" } :
  score < 72 ? { label: "Medium Risk", color: "#d97706", bg: "#fffbeb", border: "#fde68a" } :
               { label: "High Risk",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };

export default function RiskApproval() {
  const { pendingRisk, approved, rejected, updateStatus } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [autoMode, setAutoMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [snack, setSnack] = useState(null);

  const filtered = pendingRisk.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.scripName.toLowerCase().includes(search.toLowerCase())
  );

  const openConfirm = (row, act) => {
    setSelected(row);
    setAction(act);
    setRemarks("");
    setConfirmOpen(true);
  };

  const handleDecision = () => {
    updateStatus(selected.id, action === "approve" ? "Approved" : "Rejected", remarks);
    setConfirmOpen(false);
    setSnack(action === "approve"
      ? `🎉 ${selected.id} — Final approval granted! Invocation complete.`
      : `✗ ${selected.id} rejected at Risk stage`
    );
  };

  const handleAutoApprove = () => {
    const low = pendingRisk.filter((r) => riskScore(r) < 60);
    low.forEach((r) => updateStatus(r.id, "Approved", "Auto-approved (low risk score < 60)"));
    setSnack(low.length > 0
      ? `🤖 Auto-approved ${low.length} low-risk request(s)`
      : "No low-risk requests to auto-approve right now"
    );
  };

  return (
    <Box>
      <PageHeader
        icon={SecurityIcon}
        title="Risk Approval"
        subtitle="Final approval stage. Risk-scored requests are reviewed here. Approval triggers the invocation execution."
        color="#0369a1"
      />

      {/* Mode toggle card */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 2, bgcolor: "#eff6ff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <AutoModeIcon sx={{ color: "#1e40af" }} />
              </Box>
              <Box>
                <Typography variant="subtitle2">Approval Mode</Typography>
                <Typography variant="caption" color="text.secondary">Switch to auto-approve low-risk requests instantly</Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={autoMode}
                  onChange={(e) => setAutoMode(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Chip
                  label={autoMode ? "Auto Mode ON" : "Manual Mode"}
                  size="small"
                  color={autoMode ? "primary" : "default"}
                  sx={{ fontWeight: 700 }}
                />
              }
            />
            {autoMode && (
              <>
                <Alert severity="info" sx={{ py: 0.5, flex: 1, fontSize: 12 }}>
                  Auto mode enabled — requests with risk score &lt; 60 will be auto-approved.
                </Alert>
                <Button
                  variant="contained" size="small"
                  startIcon={<AutoModeIcon />}
                  onClick={handleAutoApprove}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Run Auto-Approve
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Alert severity="warning" sx={{ mb: 2.5 }}>
        <strong>Demo tip:</strong> This is the <strong>final stage</strong>. Approving here sets status to <strong>Approved</strong> and the invocation is complete.
        {pendingRisk.length === 0 && " Go through Maker → Checker first to get requests here."}
      </Alert>

      {/* Stats row */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }} flexWrap="wrap">
        <Chip label={`${filtered.length} Pending`} sx={{ bgcolor: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", fontWeight: 700 }} />
        <Chip label={`${approved.length} Approved`} sx={{ bgcolor: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0", fontWeight: 700 }} />
        <Chip label={`${rejected.length} Rejected`} sx={{ bgcolor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontWeight: 700 }} />
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
            <TextField
              placeholder="Search by ID, client, scrip..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }}
              sx={{ width: { xs: "100%", sm: 320 } }}
            />
          </Stack>

          {filtered.length === 0 ? (
            <Box sx={{
              py: 6, textAlign: "center", borderRadius: 3,
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              border: "1px dashed #7dd3fc",
            }}>
              <SecurityIcon sx={{ fontSize: 48, color: "#0ea5e9", mb: 1 }} />
              <Typography variant="h6" sx={{ color: "#0369a1", fontWeight: 700 }}>Queue Clear</Typography>
              <Typography variant="body2" color="text.secondary">
                No requests awaiting Risk approval. Complete the Maker → Checker pipeline to see requests here.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    {["Request ID", "Client", "Scrip", "Qty", "Value", "Risk Score", "Checker Remarks", "Actions"].map((h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => {
                    const score = riskScore(row);
                    const band = riskBand(score);
                    return (
                      <TableRow key={row.id}>
                        <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, color: "#1e40af", fontSize: 12 }}>{row.id}</TableCell>
                        <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{row.clientName}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{row.scripName}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            ₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <LinearProgress
                                variant="determinate" value={score}
                                sx={{
                                  height: 6, borderRadius: 3,
                                  bgcolor: band.bg,
                                  "& .MuiLinearProgress-bar": { bgcolor: band.color, borderRadius: 3 },
                                }}
                              />
                            </Box>
                            <Chip
                              label={`${score}`}
                              size="small"
                              sx={{
                                bgcolor: band.bg, color: band.color,
                                border: `1px solid ${band.border}`,
                                fontWeight: 700, fontSize: 10, minWidth: 30,
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: band.color, fontWeight: 600 }}>{band.label}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: "#64748b", fontStyle: "italic" }}>
                            {row.remarks || "No remarks"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Button size="small" variant="outlined" startIcon={<VisibilityIcon />}
                              onClick={() => { setSelected(row); setViewOpen(true); }}
                              sx={{ fontSize: 11, minWidth: 0, px: 1 }}>
                              View
                            </Button>
                            <Button size="small" variant="contained" color="success"
                              startIcon={<CheckCircleIcon />} onClick={() => openConfirm(row, "approve")}
                              sx={{ fontSize: 11, minWidth: 0, px: 1, background: "linear-gradient(135deg,#059669,#34d399)" }}>
                              Approve
                            </Button>
                            <Button size="small" variant="contained" color="error"
                              startIcon={<CancelIcon />} onClick={() => openConfirm(row, "reject")}
                              sx={{ fontSize: 11, minWidth: 0, px: 1 }}>
                              Reject
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* View dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: "linear-gradient(135deg,#0369a1,#38bdf8)", color: "white", py: 2, fontWeight: 700 }}>
          Risk Review — {selected?.id}
        </DialogTitle>
        {selected && (() => {
          const score = riskScore(selected);
          const band = riskBand(score);
          return (
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <DetailRow label="Client Name" value={selected.clientName} />
                <DetailRow label="PAN" value={selected.pan} />
                <DetailRow label="ISIN" value={selected.isin} />
                <DetailRow label="Scrip Name" value={selected.scripName} />
                <DetailRow label="Quantity" value={selected.quantity.toLocaleString("en-IN")} />
                <DetailRow label="CMP" value={`₹${selected.cmp.toLocaleString("en-IN")}`} />
                <DetailRow label="Loan Code" value={selected.loanCode} />
                <DetailRow label="Product" value={selected.product} />
              </Grid>
              <Divider sx={{ my: 2.5 }} />
              <Stack spacing={1.5}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <Typography variant="caption" color="text.secondary">Invocation Value</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e40af" }}>
                    ₹{(selected.quantity * selected.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </Typography>
                </Box>
                <Box sx={{
                  p: 2, borderRadius: 2,
                  bgcolor: band.bg, border: `1px solid ${band.border}`,
                }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: band.color }}>Risk Assessment</Typography>
                    <Chip label={`Score: ${score}/100`} size="small" sx={{ bgcolor: band.bg, color: band.color, border: `1px solid ${band.border}`, fontWeight: 700 }} />
                  </Stack>
                  <LinearProgress
                    variant="determinate" value={score}
                    sx={{ height: 10, borderRadius: 5, bgcolor: alpha(band.color, 0.15), "& .MuiLinearProgress-bar": { bgcolor: band.color, borderRadius: 5 } }}
                  />
                  <Typography variant="body2" sx={{ color: band.color, fontWeight: 700, mt: 0.8 }}>{band.label}</Typography>
                </Box>
              </Stack>
            </DialogContent>
          );
        })()}
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}
            onClick={() => { setViewOpen(false); openConfirm(selected, "approve"); }}>Final Approve</Button>
          <Button variant="contained" color="error" startIcon={<CancelIcon />}
            onClick={() => { setViewOpen(false); openConfirm(selected, "reject"); }}>Reject</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: action === "approve" ? "#059669" : "#dc2626", fontWeight: 700, pb: 1 }}>
          {action === "approve" ? "Final Approval Confirmation" : "Final Rejection"}
        </DialogTitle>
        <DialogContent>
          <Alert severity={action === "approve" ? "success" : "error"} sx={{ mb: 2 }}>
            {action === "approve"
              ? `This is the FINAL approval for ${selected?.id}. The pledge invocation will be executed.`
              : `This will permanently reject ${selected?.id} at the Risk stage.`}
          </Alert>
          <TextField
            fullWidth label="Risk Team Remarks" multiline rows={3} value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={action === "reject" ? "State reason for rejection (required)..." : "Optional remarks..."}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color={action === "approve" ? "success" : "error"}
            onClick={handleDecision}
            disabled={action === "reject" && !remarks.trim()}>
            {action === "approve" ? "Confirm Final Approval" : "Confirm Rejection"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={5000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack?.startsWith("✗") ? "error" : "success"} onClose={() => setSnack(null)} sx={{ fontWeight: 600 }}>
          {snack}
        </Alert>
      </Snackbar>
    </Box>
  );
}
