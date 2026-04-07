import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Alert, Snackbar, Stack, Chip, IconButton, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { targetDPs } from "../mockData";

const empty = { entityName: "", dpId: "", clientId: "", bank: "", ifsc: "", accountNo: "" };

export default function TargetDPMaster() {
  const [rows, setRows] = useState(targetDPs);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [snack, setSnack] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setRows([...rows, { ...form, id: rows.length + 1, status: "Pending" }]);
    setForm(empty);
    setOpen(false);
    setSnack("Target DP added — pending checker approval");
  };

  const handleApprove = (id) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status: "Active" } : r)));
    setSnack("Target DP activated");
  };

  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
    setSnack("Target DP deleted");
  };

  const valid = form.entityName && form.dpId && form.clientId;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Target DP Master manages the demat accounts where invoked shares are transferred upon final approval.
      </Alert>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="subtitle2" sx={{ flex: 1 }}>Registered Target Demat Accounts</Typography>
            <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={() => setOpen(true)}>
              Add Target DP
            </Button>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8ecf0", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                  {["#", "Entity Name", "DP ID", "Client ID", "Bank", "IFSC", "Account No.", "Status", "Actions"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontSize: 12 }}>{row.id}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{row.entityName}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace" }}>{row.dpId}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace" }}>{row.clientId}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.bank}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace" }}>{row.ifsc}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace" }}>{row.accountNo}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status} size="small"
                        color={row.status === "Active" ? "success" : "warning"}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {row.status === "Pending" && (
                          <Tooltip title="Approve">
                            <IconButton size="small" color="success" onClick={() => handleApprove(row.id)}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", py: 1.5 }}>Add Target DP Account</DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Entity Name *" name="entityName" value={form.entityName} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="DP ID *" name="dpId" value={form.dpId} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Client ID *" name="clientId" value={form.clientId} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Bank Name" name="bank" value={form.bank} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="IFSC Code" name="ifsc" value={form.ifsc} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Account Number" name="accountNo" value={form.accountNo} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={!valid} onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="success" onClose={() => setSnack(null)}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
