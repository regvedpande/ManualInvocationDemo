import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary:    { main: "#1e40af", light: "#3b82f6", dark: "#1e3a8a" },
    secondary:  { main: "#f59e0b", light: "#fcd34d", dark: "#d97706" },
    success:    { main: "#059669", light: "#34d399", dark: "#065f46" },
    error:      { main: "#dc2626", light: "#f87171", dark: "#991b1b" },
    warning:    { main: "#d97706", light: "#fbbf24", dark: "#92400e" },
    info:       { main: "#0284c7", light: "#38bdf8", dark: "#075985" },
    background: { default: "#edf3fb", paper: "#ffffff" },
    text:       { primary: "#0f172a", secondary: "#64748b" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h4: { fontWeight: 800, letterSpacing: "-0.7px" },
    h5: { fontWeight: 700, letterSpacing: "-0.35px" },
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
          borderRadius: 20,
          boxShadow: "0 12px 32px -20px rgba(15,23,42,0.22), 0 4px 12px -8px rgba(15,23,42,0.1)",
          border: "1px solid rgba(148,163,184,0.18)",
          backdropFilter: "blur(10px)",
          transition: "box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: "0 20px 40px -20px rgba(15,23,42,0.28), 0 8px 20px -10px rgba(15,23,42,0.12)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: "0.875rem",
          boxShadow: "none",
          transition: "transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
          "&:hover": { boxShadow: "none", transform: "translateY(-1px)" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
          color: "#111827",
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
          transition: "background-color 0.14s ease",
          "&:hover": { backgroundColor: "rgba(239,246,255,0.72)" },
          "&:last-child td": { borderBottom: 0 },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.84)",
            transition: "box-shadow 0.18s ease, border-color 0.18s ease, background-color 0.18s ease",
            "&:hover": {
              backgroundColor: "#fff",
              boxShadow: "0 8px 24px -20px rgba(37,99,235,0.8)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              boxShadow: "0 16px 34px -24px rgba(37,99,235,0.9)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1.5,
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(18px)",
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
