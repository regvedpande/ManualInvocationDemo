import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tabs, Tab, Chip, Tooltip, InputAdornment, Alert, Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import { invocations } from "../mockData";
import StatusChip from "../components/StatusChip";

const products = ["LAP", "SME", "CC", "OD"];
const clients = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Neha Singh", "Vikas Gupta"];

const empty = {
  clientName: "", pan: "", isin: "", scripName: "", quantity: "",
  cmp: "", loanCode: "", product: "", utr: "", pledgerDpId: "", pledgerClientId: "",
};

export default function InvocationInitiation() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(empty);
  const [rows, setRows] = useState(invocations);
  const [search, setSearch] = useState("");
  const [snack, setSnack] = useState(false);
  const [fileName, setFileName] = useState("");

  const filtered = rows.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.scripName.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const newRow = {
      ...form,
      id: `INV-00${rows.length + 1}`,
      requestDate: new Date().toISOString().split("T")[0],
      quantity: Number(form.quantity),
      cmp: Number(form.cmp),
      status: "Pending Maker",
      remarks: "",
      file: fileName || "no_file.pdf",
    };
    setRows([newRow, ...rows]);
    setForm(empty);
    setFileName("");
    setSnack(true);
    setTab(1);
  };

  const valid = form.clientName && form.isin && form.quantity && form.cmp && form.loanCode;

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Initiate New Request" icon={<AddIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600 }} />
        <Tab
          label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>All Requests <Chip label={rows.length} size="small" /></Box>}
          sx={{ textTransform: "none", fontWeight: 600 }}
        />
      </Tabs>

      {tab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2.5 }}>
              Fill in the details below to initiate a new invocation request
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField select fullWidth size="small" label="Client Name *" name="clientName" value={form.clientName} onChange={handleChange}>
                  {clients.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="PAN" name="pan" value={form.pan} onChange={handleChange} inputProps={{ maxLength: 10, style: { textTransform: "uppercase" } }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="ISIN *" name="isin" value={form.isin} onChange={handleChange} placeholder="e.g. INE002A01018" />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Scrip Name *" name="scripName" value={form.scripName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Quantity *" name="quantity" value={form.quantity} onChange={handleChange} type="number" />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="CMP (₹) *" name="cmp" value={form.cmp} onChange={handleChange} type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Loan Code *" name="loanCode" value={form.loanCode} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField select fullWidth size="small" label="Product" name="product" value={form.product} onChange={handleChange}>
                  {products.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="UTR No." name="utr" value={form.utr} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Pledger DP ID" name="pledgerDpId" value={form.pledgerDpId} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Pledger Client ID" name="pledgerClientId" value={form.pledgerClientId} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined" component="label" startIcon={<UploadFileIcon />} fullWidth size="small"
                  sx={{ height: 40, justifyContent: "flex-start", color: fileName ? "success.main" : "inherit", borderColor: fileName ? "success.main" : "inherit" }}
                >
                  {fileName || "Attach Document"}
                  <input type="file" hidden onChange={(e) => setFileName(e.target.files[0]?.name || "")} />
                </Button>
              </Grid>
            </Grid>

            {form.quantity && form.cmp && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Estimated Invocation Value: <strong>₹{(Number(form.quantity) * Number(form.cmp)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong>
              </Alert>
            )}

            <Box sx={{ mt: 2.5, display: "flex", gap: 1.5 }}>
              <Button variant="contained" startIcon={<SendIcon />} disabled={!valid} onClick={handleSubmit}>
                Submit Request
              </Button>
              <Button variant="outlined" onClick={() => setForm(empty)}>Reset</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                size="small" placeholder="Search by ID, client or scrip..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }}
                sx={{ width: 320 }}
              />
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e8ecf0", borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                    {["Request ID", "Date", "Client", "PAN", "Scrip", "ISIN", "Qty", "CMP", "Value", "Loan Code", "Product", "Status"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "primary.main", whiteSpace: "nowrap" }}>{row.id}</TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.requestDate}</TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.clientName}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.pan}</TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.scripName}</TableCell>
                      <TableCell sx={{ fontSize: 11, fontFamily: "monospace" }}>{row.isin}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>₹{row.cmp.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                        ₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.loanCode}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.product}</TableCell>
                      <TableCell><StatusChip status={row.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="success" onClose={() => setSnack(false)}>Request submitted successfully! Pending Maker review.</Alert>
      </Snackbar>
    </Box>
  );
}
