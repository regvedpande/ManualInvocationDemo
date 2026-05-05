import { Box, Typography, alpha } from "@mui/material";

export default function PageHeader({ icon, title, subtitle, color = "#1e40af" }) {
  const IconComponent = icon;

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 2, mb: 3,
      p: { xs: 2.25, sm: 2.75 }, borderRadius: 4,
      background: `radial-gradient(circle at top right, ${alpha(color, 0.14)}, transparent 30%), linear-gradient(135deg, ${alpha(color, 0.07)} 0%, ${alpha(color, 0.02)} 100%)`,
      border: `1px solid ${alpha(color, 0.14)}`,
      boxShadow: `0 18px 40px -32px ${alpha(color, 0.45)}, inset 0 1px 0 rgba(255,255,255,0.7)`,
    }}>
      <Box sx={{
        width: 48, height: 48, borderRadius: 2.5, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.72)})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 16px 30px -18px ${alpha(color, 0.65)}`,
      }}>
        <IconComponent sx={{ color: "white", fontSize: 24 }} />
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}
