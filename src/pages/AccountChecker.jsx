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
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { AppContext } from "../context/InvocationContext";
import PageHeader from "../components/PageHeader";

const DetailRow = ({ label, value }) => (
  <Grid item xs={6} sm={4}>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.3 }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>{value || "—"}</Typography>
  </Grid>
);

export default function AccountChecker() {
  const { pendingChecker, updateStatus } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [snack, setSnack] = useState(null);

  const filtered = pendingChecker.filter(
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
    updateStatus(selected.id, action === "approve" ? "Pending Risk" : "Rejected", remarks);
    setConfirmOpen(false);
    setSnack(action === "approve"
      ? `Approved: ${selected.id} escalated to the Risk queue`
      : `Rejected: ${selected.id} was stopped at Checker review`
    );
  };

  return (
    <Box>
      <PageHeader
        icon={VerifiedUserIcon}
        title="Account Checker"
        subtitle="Second-level review. Requests approved here are escalated to the Risk Team for final sign-off."
        color="#7c3aed"
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
            <Chip
              label={`${filtered.length} Pending`}
              sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe", fontWeight: 700 }}
            />
          </Stack>

          {filtered.length === 0 ? (
            <Box sx={{
              py: 6, textAlign: "center", borderRadius: 3,
              background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
              border: "1px dashed #c4b5fd",
            }}>
              <VerifiedUserIcon sx={{ fontSize: 48, color: "#8b5cf6", mb: 1 }} />
              <Typography variant="h6" sx={{ color: "#6d28d9", fontWeight: 700 }}>Queue Empty</Typography>
              <Typography variant="body2" color="text.secondary">
                No requests pending Checker review. Approve requests in <strong>Account Maker</strong> first.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    {["Request ID", "Date", "Client", "Scrip", "ISIN", "Qty", "Total Value", "Maker Remarks", "Actions"].map((h) => (
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
                      <TableCell sx={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>{row.isin}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          ₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </Typography>
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
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* View dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white", py: 2, fontWeight: 700 }}>
          Checker Review — {selected?.id}
        </DialogTitle>
        {selected && (
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
              <DetailRow label="UTR No." value={selected.utr} />
              <DetailRow label="Pledger DP ID" value={selected.pledgerDpId} />
            </Grid>
            <Divider sx={{ my: 2.5 }} />
            <Alert severity="warning" icon={false}>
              <strong>Maker Remarks:</strong> {selected.remarks || "None provided"}
            </Alert>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}
            onClick={() => { setViewOpen(false); openConfirm(selected, "approve"); }}>Approve</Button>
          <Button variant="contained" color="error" startIcon={<CancelIcon />}
            onClick={() => { setViewOpen(false); openConfirm(selected, "reject"); }}>Reject</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: action === "approve" ? "#059669" : "#dc2626", fontWeight: 700, pb: 1 }}>
          {action === "approve" ? "Confirm Checker Approval" : "Confirm Rejection"}
        </DialogTitle>
        <DialogContent>
          <Alert severity={action === "approve" ? "success" : "error"} sx={{ mb: 2 }}>
            {action === "approve"
              ? `${selected?.id} will be forwarded to the Risk Team for final approval.`
              : `${selected?.id} will be rejected permanently.`}
          </Alert>
          <TextField
            fullWidth label="Checker Remarks" multiline rows={3} value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={action === "reject" ? "Reason for rejection (required)..." : "Optional remarks for Risk team..."}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color={action === "approve" ? "success" : "error"}
            onClick={handleDecision}
            disabled={action === "reject" && !remarks.trim()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack?.startsWith("Rejected") ? "error" : "success"} onClose={() => setSnack(null)} sx={{ fontWeight: 600 }}>
          {snack}
        </Alert>
      </Snackbar>
    </Box>
  );
}
