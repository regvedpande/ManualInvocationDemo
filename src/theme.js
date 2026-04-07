import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary:    { main: "#1e40af", light: "#3b82f6", dark: "#1e3a8a" },
    secondary:  { main: "#f59e0b", light: "#fcd34d", dark: "#d97706" },
    success:    { main: "#059669", light: "#34d399", dark: "#065f46" },
    error:      { main: "#dc2626", light: "#f87171", dark: "#991b1b" },
    warning:    { main: "#d97706", light: "#fbbf24", dark: "#92400e" },
    info:       { main: "#0284c7", light: "#38bdf8", dark: "#075985" },
    background: { default: "#f1f5f9", paper: "#ffffff" },
    text:       { primary: "#0f172a", secondary: "#64748b" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h4: { fontWeight: 800, letterSpacing: "-0.5px" },
    h5: { fontWeight: 700, letterSpacing: "-0.3px" },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body2: { fontSize: "0.875rem" },
    caption: { fontSize: "0.75rem" },
  },
  shape: { borderRadius: 12 },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)",
    "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)",
    "0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.03)",
    ...Array(20).fill("0 20px 25px -5px rgba(0,0,0,0.08)"),
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
          fontSize: "0.875rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
        sizeSmall: { fontSize: "0.7rem", height: 22 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#f8fafc",
            fontWeight: 700,
            fontSize: "0.75rem",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "2px solid #e2e8f0",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "#f8fafc" },
          "&:last-child td": { borderBottom: 0 },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

export default theme;
