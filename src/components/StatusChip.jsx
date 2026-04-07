import { Chip } from "@mui/material";

const config = {
  "Pending Maker":   { color: "warning",   label: "Pending Maker" },
  "Pending Checker": { color: "info",      label: "Pending Checker" },
  "Pending Risk":    { color: "secondary", label: "Pending Risk" },
  "Approved":        { color: "success",   label: "Approved" },
  "Rejected":        { color: "error",     label: "Rejected" },
};

export default function StatusChip({ status }) {
  const c = config[status] || { color: "default", label: status };
  return <Chip label={c.label} color={c.color} size="small" variant="filled" />;
}
