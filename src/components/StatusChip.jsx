import { Chip } from "@mui/material";

const config = {
  "Pending Maker":   { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  "Pending Checker": { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  "Pending Risk":    { color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
  "Approved":        { color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
  "Rejected":        { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

export default function StatusChip({ status }) {
  const c = config[status] || { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontWeight: 700,
        fontSize: "0.7rem",
        height: 22,
      }}
    />
  );
}
