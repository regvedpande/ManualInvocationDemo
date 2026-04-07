import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Chip,
  Grid, Divider, Alert, Snackbar, Stack, InputAdornment,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { invocations } from "../mockData";
import StatusChip from "../components/StatusChip";

const InfoRow = ({ label, value }) => (
  <Grid item xs={6} sm={4}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.2 }}>{value || "—"}</Typography>
  </Grid>
);

export default function AccountMaker() {
  const [rows, setRows] = useState(invocations.filter((r) => r.status === "Pending Maker"));
  const [processed, setProcessed] = useState([]);
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

  const handleView = (row) => { setSelected(row); setOpen(true); };

  const openConfirm = (row, act) => { setSelected(row); setAction(act); setRemarks(""); setConfirmOpen(true); };

  const handleDecision = () => {
    const newStatus = action === "approve" ? "Pending Checker" : "Rejected";
    setRows(rows.filter((r) => r.id !== selected.id));
    setProcessed([{ ...selected, status: newStatus, remarks }, ...processed]);
    setConfirmOpen(false);
    setSnack(action === "approve" ? "Approved and forwarded to Checker" : "Request rejected");
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={`Pending: ${rows.length}`} color="warning" />
        <Chip label={`Processed: ${processed.length}`} color="default" />
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ flex: 1 }}>Pending for Maker Review</Typography>
            <TextField
              size="small" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }}
              sx={{ width: 240 }}
            />
          </Box>
          {filtered.length === 0 ? (
            <Alert severity="success">No pending requests for Maker review.</Alert>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8ecf0", borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                    {["Request ID", "Date", "Client", "Scrip", "Quantity", "CMP", "Value", "Loan Code", "Actions"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "primary.main" }}>{row.id}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.requestDate}</TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.clientName}</TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.scripName}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>₹{row.cmp.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>
                        ₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.loanCode}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Button size="small" variant="outlined" startIcon={<VisibilityIcon />} onClick={() => handleView(row)} sx={{ fontSize: 11 }}>
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {processed.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Processed by Me</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8ecf0", borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                    {["Request ID", "Client", "Scrip", "Status", "Remarks"].map((h) => (
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
          Invocation Request Details — {selected?.id}
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
              <InfoRow label="Pledger Client ID" value={selected.pledgerClientId} />
              <InfoRow label="Attached File" value={selected.file} />
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Alert severity="info" icon={false} sx={{ fontWeight: 600 }}>
              Invocation Value: ₹{(selected.quantity * selected.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </Alert>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button startIcon={<DownloadIcon />} variant="outlined" size="small">Download Doc</Button>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => { setOpen(false); openConfirm(selected, "approve"); }}>Approve</Button>
          <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => { setOpen(false); openConfirm(selected, "reject"); }}>Reject</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: action === "approve" ? "success.main" : "error.main" }}>
          {action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {action === "approve"
              ? `You are approving ${selected?.id}. This will forward the request to the Checker.`
              : `You are rejecting ${selected?.id}. This action cannot be undone.`}
          </Typography>
          <TextField
            fullWidth size="small" label="Remarks" multiline rows={2}
            value={remarks} onChange={(e) => setRemarks(e.target.value)}
            placeholder={action === "approve" ? "Optional remarks..." : "Please state reason for rejection..."}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color={action === "approve" ? "success" : "error"} onClick={handleDecision}>
            Confirm {action === "approve" ? "Approval" : "Rejection"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack?.includes("reject") ? "error" : "success"} onClose={() => setSnack(null)}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
