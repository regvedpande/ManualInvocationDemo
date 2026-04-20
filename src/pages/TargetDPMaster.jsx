import React, { useState, useContext } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Alert, Snackbar, Stack,
  Chip, IconButton, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { AppContext } from "../context/InvocationContext";
import PageHeader from "../components/PageHeader";

const empty = { entityName: "", dpId: "", clientId: "", bank: "", ifsc: "", accountNo: "" };

const LF = ({ label, children }) => (
  <Box>
    <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 0.5 }}>{label}</Typography>
    {children}
  </Box>
);

export default function TargetDPMaster() {
  const { targetDPs, addTargetDP, approveTargetDP, deleteTargetDP } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [snack, setSnack] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    addTargetDP(form);
    setForm(empty);
    setOpen(false);
    setSnack("Target DP added successfully — pending Checker approval");
  };

  const handleApprove = (id) => {
    approveTargetDP(id);
    setSnack("Target DP activated successfully");
  };

  const handleDelete = (id) => {
    deleteTargetDP(id);
    setDeleteConfirm(null);
    setSnack("Target DP removed");
  };

  const valid = form.entityName && form.dpId && form.clientId;
  const active  = targetDPs.filter((r) => r.status === "Active");
  const pending = targetDPs.filter((r) => r.status === "Pending");

  return (
    <Box>
      <PageHeader
        icon={AccountTreeIcon}
        title="Target DP Master"
        subtitle="Manage the demat accounts (Depository Participant IDs) where invoked shares are transferred upon final approval."
        color="#059669"
      />



      {/* Summary */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
        <Chip label={`${active.length} Active`} sx={{ bgcolor: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0", fontWeight: 700 }} />
        <Chip label={`${pending.length} Pending Approval`} sx={{ bgcolor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", fontWeight: 700 }} />
      </Stack>

      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ flex: 1 }}>Registered Demat Accounts</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
              Add Target DP
            </Button>
          </Stack>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {["#", "Entity Name", "DP ID", "Client ID", "Bank", "IFSC", "Account No.", "Status", "Actions"].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {targetDPs.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ color: "#94a3b8", fontSize: 12 }}>{row.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{row.entityName}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12, color: "#1e40af" }}>{row.dpId}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>{row.clientId}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.bank}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{row.ifsc}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{row.accountNo}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={
                          row.status === "Active"
                            ? { bgcolor: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0", fontWeight: 700 }
                            : { bgcolor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", fontWeight: 700 }
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {row.status === "Pending" && (
                          <Tooltip title="Activate this Target DP">
                            <Button
                              size="small" variant="contained" color="success"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleApprove(row.id)}
                              sx={{ fontSize: 11, px: 1, background: "linear-gradient(135deg,#059669,#34d399)" }}
                            >
                              Activate
                            </Button>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setDeleteConfirm(row.id)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {targetDPs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                      No Target DP accounts configured. Click "Add Target DP" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* Add dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: "linear-gradient(135deg,#059669,#34d399)", color: "white", py: 2, fontWeight: 700 }}>
          Add Target DP Account
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <LF label="Entity Name *">
                <TextField fullWidth name="entityName" value={form.entityName} onChange={handleChange} placeholder="e.g. Aureon Wealth Custody" />
              </LF>
            </Grid>
            <Grid item xs={6}>
              <LF label="DP ID *">
                <TextField fullWidth name="dpId" value={form.dpId} onChange={handleChange} placeholder="e.g. IN300095" />
              </LF>
            </Grid>
            <Grid item xs={6}>
              <LF label="Client ID *">
                <TextField fullWidth name="clientId" value={form.clientId} onChange={handleChange} placeholder="e.g. IN30009511223344" />
              </LF>
            </Grid>
            <Grid item xs={6}>
              <LF label="Bank Name">
                <TextField fullWidth name="bank" value={form.bank} onChange={handleChange} placeholder="e.g. HDFC Bank" />
              </LF>
            </Grid>
            <Grid item xs={6}>
              <LF label="IFSC Code">
                <TextField fullWidth name="ifsc" value={form.ifsc} onChange={handleChange} placeholder="e.g. HDFC0001234" />
              </LF>
            </Grid>
            <Grid item xs={12}>
              <LF label="Account Number">
                <TextField fullWidth name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="e.g. 50100123456789" />
              </LF>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => { setOpen(false); setForm(empty); }}>Cancel</Button>
          <Button variant="contained" disabled={!valid} onClick={handleAdd}>Add Account</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: "#dc2626", fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Alert severity="error">This will permanently remove this Target DP account. Are you sure?</Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3500} onClose={() => setSnack(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="success" onClose={() => setSnack(null)} sx={{ fontWeight: 600 }}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
