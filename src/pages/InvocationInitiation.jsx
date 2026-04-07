import React, { useState, useContext } from "react";
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
  Tabs, Tab, Chip, InputAdornment, Alert, Snackbar, Stack, alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AppContext } from "../context/AppContext";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";

const products = ["LAP", "SME", "CC", "OD"];
const clients = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Neha Singh", "Vikas Gupta", "Sunita Reddy", "Deepak Joshi"];
const scrips = [
  { name: "Reliance Industries", isin: "INE002A01018" },
  { name: "HDFC Bank",           isin: "INE040A01034" },
  { name: "TCS",                 isin: "INE001A01036" },
  { name: "Infosys",             isin: "INE030A01027" },
  { name: "ICICI Bank",          isin: "INE047A01021" },
  { name: "SBI",                 isin: "INE062A01020" },
];

const empty = {
  clientName: "", pan: "", isin: "", scripName: "", quantity: "",
  cmp: "", loanCode: "", product: "", utr: "", pledgerDpId: "", pledgerClientId: "",
};

const LabelledField = ({ label, children }) => (
  <Box>
    <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 0.5 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

export default function InvocationInitiation() {
  const { invocations, addInvocation } = useContext(AppContext);
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");
  const [snack, setSnack] = useState(false);
  const [fileName, setFileName] = useState("");

  const filtered = invocations.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.scripName.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "scripName") {
      const found = scrips.find((s) => s.name === value);
      setForm({ ...form, scripName: value, isin: found ? found.isin : form.isin });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    addInvocation({
      ...form,
      quantity: Number(form.quantity),
      cmp: Number(form.cmp),
      file: fileName || "pledge_document.pdf",
    });
    setForm(empty);
    setFileName("");
    setSnack(true);
    setTab(1);
  };

  const valid = form.clientName && form.isin && form.quantity && form.cmp && form.loanCode;
  const value = Number(form.quantity) * Number(form.cmp);

  return (
    <Box>
      <PageHeader
        icon={AddCircleOutlineIcon}
        title="Initiate Invocation"
        subtitle="Submit a new pledge invocation request — it will enter the Maker → Checker → Risk approval pipeline"
        color="#1e40af"
      />

      <Tabs
        value={tab} onChange={(_, v) => setTab(v)}
        sx={{ mb: 2.5, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 } }}
      >
        <Tab icon={<AddIcon fontSize="small" />} iconPosition="start" label="New Request" sx={{ textTransform: "none", fontWeight: 600 }} />
        <Tab
          icon={<FormatListBulletedIcon fontSize="small" />}
          iconPosition="start"
          label={
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <span>All Requests</span>
              <Chip label={invocations.length} size="small" sx={{ height: 18, fontSize: 10 }} />
            </Stack>
          }
          sx={{ textTransform: "none", fontWeight: 600 }}
        />
      </Tabs>

      {tab === 0 && (
        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              After submission, this request will appear in <strong>Account Maker</strong> for first-level review.
            </Alert>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Client Name *">
                  <TextField select fullWidth name="clientName" value={form.clientName} onChange={handleChange} placeholder="Select client">
                    {clients.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="PAN">
                  <TextField fullWidth name="pan" value={form.pan} onChange={handleChange} placeholder="ABCDE1234F" inputProps={{ maxLength: 10, style: { textTransform: "uppercase" } }} />
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Scrip Name *">
                  <TextField select fullWidth name="scripName" value={form.scripName} onChange={handleChange} placeholder="Select scrip">
                    {scrips.map((s) => <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>)}
                  </TextField>
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="ISIN">
                  <TextField fullWidth name="isin" value={form.isin} onChange={handleChange} placeholder="Auto-filled from scrip" />
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Quantity *">
                  <TextField fullWidth name="quantity" value={form.quantity} onChange={handleChange} type="number" placeholder="e.g. 500" />
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Current Market Price (₹) *">
                  <TextField
                    fullWidth name="cmp" value={form.cmp} onChange={handleChange} type="number"
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    placeholder="e.g. 2850"
                  />
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Loan Code *">
                  <TextField fullWidth name="loanCode" value={form.loanCode} onChange={handleChange} placeholder="e.g. LC-9901" />
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Product">
                  <TextField select fullWidth name="product" value={form.product} onChange={handleChange}>
                    <MenuItem value="">Select...</MenuItem>
                    {products.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </TextField>
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="UTR Number">
                  <TextField fullWidth name="utr" value={form.utr} onChange={handleChange} placeholder="e.g. UTR20250401001" />
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Pledger DP ID">
                  <TextField fullWidth name="pledgerDpId" value={form.pledgerDpId} onChange={handleChange} />
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Pledger Client ID">
                  <TextField fullWidth name="pledgerClientId" value={form.pledgerClientId} onChange={handleChange} />
                </LabelledField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelledField label="Supporting Document">
                  <Button
                    variant="outlined" component="label" startIcon={<UploadFileIcon />} fullWidth
                    sx={{
                      height: 40, justifyContent: "flex-start",
                      color: fileName ? "success.main" : "text.secondary",
                      borderColor: fileName ? "success.main" : undefined,
                      borderStyle: "dashed",
                    }}
                  >
                    {fileName || "Click to attach file"}
                    <input type="file" hidden onChange={(e) => setFileName(e.target.files[0]?.name || "")} />
                  </Button>
                </LabelledField>
              </Grid>
            </Grid>

            {value > 0 && (
              <Box sx={{
                mt: 3, p: 2, borderRadius: 2,
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                border: "1px solid #bfdbfe",
              }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Estimated Invocation Value</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e40af" }}>
                      ₹{value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Quantity × CMP</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {Number(form.quantity).toLocaleString("en-IN")} × ₹{Number(form.cmp).toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button variant="contained" startIcon={<SendIcon />} disabled={!valid} onClick={handleSubmit} size="large">
                Submit Invocation Request
              </Button>
              <Button variant="outlined" onClick={() => setForm(empty)}>Reset</Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
              <TextField
                placeholder="Search by ID, client or scrip..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }}
                sx={{ width: { xs: "100%", sm: 340 } }}
              />
              <Box sx={{ flex: 1 }} />
              <Chip label={`${filtered.length} records`} variant="outlined" />
            </Stack>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    {["Request ID", "Date", "Client", "Scrip", "ISIN", "Qty", "CMP", "Value", "Loan Code", "Product", "Status"].map((h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, color: "#1e40af", fontSize: 12 }}>{row.id}</TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.requestDate}</TableCell>
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{row.clientName}</TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{row.scripName}</TableCell>
                      <TableCell sx={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>{row.isin}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.quantity.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>₹{row.cmp.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                        ₹{(row.quantity * row.cmp).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.loanCode}</TableCell>
                      <TableCell><Chip label={row.product || "—"} size="small" variant="outlined" sx={{ fontSize: 10 }} /></TableCell>
                      <TableCell><StatusChip status={row.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      )}

      <Snackbar open={snack} autoHideDuration={4000} onClose={() => setSnack(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="success" onClose={() => setSnack(false)} sx={{ fontWeight: 600 }}>
          Request submitted! Now go to <strong>Account Maker</strong> to approve it.
        </Alert>
      </Snackbar>
    </Box>
  );
}
