import { Box, Typography, alpha } from "@mui/material";

export default function PageHeader({ icon: Icon, title, subtitle, color = "#1e40af" }) {
  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 2, mb: 3,
      p: 2.5, borderRadius: 3,
      background: `linear-gradient(135deg, ${alpha(color, 0.07)} 0%, ${alpha(color, 0.03)} 100%)`,
      border: `1px solid ${alpha(color, 0.12)}`,
    }}>
      <Box sx={{
        width: 48, height: 48, borderRadius: 2.5, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
      }}>
        <Icon sx={{ color: "white", fontSize: 24 }} />
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}
