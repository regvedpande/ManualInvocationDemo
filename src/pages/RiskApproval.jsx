import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Chip,
  Grid, Divider, Alert, Snackbar, Stack, Switch, FormControlLabel,
  InputAdornment, LinearProgress, Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { invocations } from "../mockData";
import StatusChip from "../components/StatusChip";

const InfoRow = ({ label, value }) => (
  <Grid item xs={6} sm={4}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.2 }}>{value || "—"}</Typography>
  </Grid>
);

const riskScore = (row) => {
  let score = 50;
  if (row.quantity > 400) score += 20;
  if (row.cmp > 2000) score += 15;
  if (row.product === "CC") score += 10;
  return Math.min(score, 95);
};

const riskLabel = (score) =>
  score < 60 ? { label: "Low", color: "success" } :
  score < 75 ? { label: "Medium", color: "warning" } :
  { label: "High", color: "error" };

export default function RiskApproval() {
  const [rows, setRows] = useState(invocations.filter((r) => r.status === "Pending Risk"));
  const [processed, setProcessed] = useState([]);
  const [autoMode, setAutoMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [action, setAction] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snack, setSnack] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = rows.filter(
    (r) => r.id.toLowerCase().includes(search.toLowerCase()) || r.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const openConfirm = (row, act) => { setSelected(row); setAction(act); setRemarks(""); setConfirmOpen(true); };

  const handleDecision = () => {
    setRows(rows.filter((r) => r.id !== selected.id));
    setProcessed([{ ...selected, status: action === "approve" ? "Approved" : "Rejected", remarks }, ...processed]);
    setConfirmOpen(false);
    setSnack(action === "approve" ? "Final approval granted. Invocation complete!" : "Request rejected at Risk stage");
  };

  const handleAutoApprove = () => {
    const safe = rows.filter((r) => riskScore(r) < 70);
    const rest = rows.filter((r) => riskScore(r) >= 70);
    setRows(rest);
    setProcessed([...safe.map((r) => ({ ...r, status: "Approved", remarks: "Auto-approved (risk score < 70)" })), ...processed]);
    setSnack(`Auto-approved ${safe.length} low-risk request(s)`);
  };

  return (
    <Box>
      {/* Controls */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoModeIcon color="primary" />
              <Typography variant="subtitle2">Approval Mode</Typography>
            </Box>
            <FormControlLabel
              control={<Switch checked={autoMode} onChange={(e) => setAutoMode(e.target.checked)} color="primary" />}
              label={<Typography variant="body2" fontWeight={600}>{autoMode ? "Auto Mode" : "Manual Mode"}</Typography>}
            />
            {autoMode && (
              <Alert severity="info" sx={{ py: 0.5, flex: 1 }}>
                Auto mode: low-risk requests (score &lt; 70) are auto-approved.{" "}
                <Button size="small" variant="contained" sx={{ ml: 1, py: 0 }} onClick={handleAutoApprove}>
                  Run Auto-Approve
                </Button>
              </Alert>
            )}
            <Tooltip title="Risk score is calculated based on quantity, CMP, and product type">
              <InfoOutlinedIcon sx={{ color: "text.disabled", cursor: "help" }} />
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={`Pending: ${rows.length}`} color="secondary" />
        <Chip label={`Processed: ${processed.length}`} color="default" />
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ flex: 1 }}>Pending for Risk Approval (Final Stage)</Typography>
            <TextField
              size="small" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }}
              sx={{ width: 240 }}
            />
          </Box>
          {filtered.length === 0 ? (
            <Alert severity="success">No pending requests for Risk approval.</Alert>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8ecf0", borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                    {["Request ID", "Client", "Scrip", "Quantity", "Value", "Risk Score", "Checker Remarks", "Actions"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => {
                    const score = riskScore(row);
                    const risk = riskLabel(score);
                    return (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "primary.main" }}>{row.id}</TableCell>
                        <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.clientName}</TableCell>
                        <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.scripName}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>
                          ₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </TableCell>
                        <TableCell sx={{ minWidth: 130 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LinearProgress
                              variant="determinate" value={score}
                              color={risk.color}
                              sx={{ flex: 1, height: 6, borderRadius: 3 }}
                            />
                            <Chip label={`${score} ${risk.label}`} color={risk.color} size="small" sx={{ fontSize: 10 }} />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>{row.remarks || "—"}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Button size="small" variant="outlined" startIcon={<VisibilityIcon />} onClick={() => { setSelected(row); setOpen(true); }} sx={{ fontSize: 11 }}>
                              View
                            </Button>
                            <Button size="small" variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => openConfirm(row, "approve")} sx={{ fontSize: 11 }}>
                              Approve
                            </Button>
                            <Button size="small" variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => openConfirm(row, "reject")} sx={{ fontSize: 11 }}>
                              Reject
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {processed.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Final Decisions</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8ecf0", borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                    {["Request ID", "Client", "Scrip", "Value", "Final Status", "Remarks"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processed.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "primary.main" }}>{row.id}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.clientName}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.scripName}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</TableCell>
                      <TableCell><StatusChip status={row.status} /></TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.remarks || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* View Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", py: 1.5 }}>
          Risk Review — {selected?.id}
        </DialogTitle>
        {selected && (
          <DialogContent sx={{ pt: 2.5 }}>
            <Grid container spacing={2}>
              <InfoRow label="Client Name" value={selected.clientName} />
              <InfoRow label="PAN" value={selected.pan} />
              <InfoRow label="ISIN" value={selected.isin} />
              <InfoRow label="Scrip Name" value={selected.scripName} />
              <InfoRow label="Quantity" value={selected.quantity.toLocaleString("en-IN")} />
              <InfoRow label="CMP" value={`₹${selected.cmp.toLocaleString("en-IN")}`} />
              <InfoRow label="Loan Code" value={selected.loanCode} />
              <InfoRow label="Product" value={selected.product} />
              <InfoRow label="UTR No." value={selected.utr} />
              <InfoRow label="Pledger DP ID" value={selected.pledgerDpId} />
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1.5}>
              <Alert severity="error" icon={false} sx={{ fontWeight: 600 }}>
                Invocation Value: ₹{(selected.quantity * selected.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </Alert>
              {(() => {
                const score = riskScore(selected);
                const risk = riskLabel(score);
                return (
                  <Alert severity={risk.color === "success" ? "success" : risk.color === "warning" ? "warning" : "error"}>
                    Risk Score: <strong>{score} / 100</strong> — {risk.label} Risk
                  </Alert>
                );
              })()}
            </Stack>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => { setOpen(false); openConfirm(selected, "approve"); }}>Final Approve</Button>
          <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => { setOpen(false); openConfirm(selected, "reject"); }}>Reject</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: action === "approve" ? "success.main" : "error.main" }}>
          {action === "approve" ? "Final Approval" : "Final Rejection"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {action === "approve"
              ? `This is the final approval for ${selected?.id}. The invocation will be executed.`
              : `Rejecting ${selected?.id} at the Risk stage. This is the final decision.`}
          </Typography>
          <TextField fullWidth size="small" label="Risk Remarks" multiline rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color={action === "approve" ? "success" : "error"} onClick={handleDecision}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3500} onClose={() => setSnack(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack?.includes("reject") ? "error" : "success"} onClose={() => setSnack(null)}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
