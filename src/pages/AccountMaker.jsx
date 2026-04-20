import React, { useState, useContext } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Alert, Snackbar, Stack,
  InputAdornment, Chip, Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DownloadIcon from "@mui/icons-material/Download";
import { AppContext } from "../context/InvocationContext";
import PageHeader from "../components/PageHeader";

const DetailRow = ({ label, value }) => (
  <Grid item xs={6} sm={4}>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.3 }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>{value || "—"}</Typography>
  </Grid>
);

export default function AccountMaker() {
  const { pendingMaker, updateStatus } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [snack, setSnack] = useState(null);

  const filtered = pendingMaker.filter(
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
    const newStatus = action === "approve" ? "Pending Checker" : "Rejected";
    updateStatus(selected.id, newStatus, remarks);
    setConfirmOpen(false);
    setSnack(action === "approve"
      ? `Approved: ${selected.id} is now in the Checker queue`
      : `Rejected: ${selected.id} was stopped at Maker review`
    );
  };

  return (
    <Box>
      <PageHeader
        icon={AccountBalanceIcon}
        title="Account Maker"
        subtitle="First-level review. Approve valid requests to forward them to the Account Checker, or reject with reasons."
        color="#d97706"
      />



      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
            <TextField
              placeholder="Search by ID, client, scrip..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }}
              sx={{ width: { xs: "100%", sm: 320 } }}
            />
            <Stack direction="row" spacing={1}>
              <Chip
                label={`${filtered.length} Pending`}
                sx={{ bgcolor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", fontWeight: 700 }}
              />
            </Stack>
          </Stack>

          {filtered.length === 0 ? (
            <Box sx={{
              py: 6, textAlign: "center", borderRadius: 3,
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              border: "1px dashed #86efac",
            }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: "#22c55e", mb: 1 }} />
              <Typography variant="h6" sx={{ color: "#15803d", fontWeight: 700 }}>All caught up!</Typography>
              <Typography variant="body2" color="text.secondary">No requests pending Maker review.</Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 860 }}>
                <TableHead>
                  <TableRow>
                    {["Request ID", "Date", "Client", "Scrip", "Qty", "CMP", "Total Value", "Loan Code", "Actions"].map((h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, color: "#1e40af", fontSize: 12 }}>{row.id}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.requestDate}</TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{row.clientName}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.scripName}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>₹{row.cmp.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          ₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.loanCode}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Button
                            size="small" variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => { setSelected(row); setViewOpen(true); }}
                            sx={{ fontSize: 11, minWidth: 0, px: 1 }}
                          >
                            View
                          </Button>
                          <Button
                            size="small" variant="contained" color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => openConfirm(row, "approve")}
                            sx={{ fontSize: 11, minWidth: 0, px: 1, background: "linear-gradient(135deg,#059669,#34d399)" }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small" variant="contained" color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => openConfirm(row, "reject")}
                            sx={{ fontSize: 11, minWidth: 0, px: 1 }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* View detail dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          background: "linear-gradient(135deg, #d97706, #f59e0b)",
          color: "white", py: 2, fontWeight: 700,
        }}>
          Request Details — {selected?.id}
        </DialogTitle>
        {selected && (
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <DetailRow label="Client Name" value={selected.clientName} />
              <DetailRow label="PAN" value={selected.pan} />
              <DetailRow label="Request Date" value={selected.requestDate} />
              <DetailRow label="ISIN" value={selected.isin} />
              <DetailRow label="Scrip Name" value={selected.scripName} />
              <DetailRow label="Quantity" value={selected.quantity.toLocaleString("en-IN")} />
              <DetailRow label="Current Market Price" value={`₹${selected.cmp.toLocaleString("en-IN")}`} />
              <DetailRow label="Loan Code" value={selected.loanCode} />
              <DetailRow label="Product" value={selected.product} />
              <DetailRow label="UTR No." value={selected.utr} />
              <DetailRow label="Pledger DP ID" value={selected.pledgerDpId} />
              <DetailRow label="Pledger Client ID" value={selected.pledgerClientId} />
            </Grid>
            <Divider sx={{ my: 2.5 }} />
            <Box sx={{
              p: 2, borderRadius: 2,
              background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
              border: "1px solid #fde68a",
            }}>
              <Typography variant="caption" color="text.secondary">Invocation Value</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#d97706" }}>
                ₹{(selected.quantity * selected.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </Typography>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button startIcon={<DownloadIcon />} variant="outlined" size="small">Download Doc</Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}
            onClick={() => { setViewOpen(false); openConfirm(selected, "approve"); }}>
            Approve
          </Button>
          <Button variant="contained" color="error" startIcon={<CancelIcon />}
            onClick={() => { setViewOpen(false); openConfirm(selected, "reject"); }}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{
          color: action === "approve" ? "#059669" : "#dc2626",
          fontWeight: 700, pb: 1,
        }}>
          {action === "approve" ? "Confirm Maker Approval" : "Confirm Rejection"}
        </DialogTitle>
        <DialogContent>
          <Alert
            severity={action === "approve" ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {action === "approve"
              ? `${selected?.id} will move to the Account Checker queue.`
              : `${selected?.id} will be rejected. This cannot be undone.`}
          </Alert>
          <TextField
            fullWidth label="Remarks" multiline rows={3} value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={action === "approve" ? "Optional remarks for checker..." : "State reason for rejection (required)"}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={action === "approve" ? "success" : "error"}
            onClick={handleDecision}
            disabled={action === "reject" && !remarks.trim()}
          >
            Confirm {action === "approve" ? "Approval" : "Rejection"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert
          severity={snack?.startsWith("Rejected") ? "error" : "success"}
          onClose={() => setSnack(null)}
          sx={{ fontWeight: 600 }}
        >
          {snack}
        </Alert>
      </Snackbar>
    </Box>
  );
}
