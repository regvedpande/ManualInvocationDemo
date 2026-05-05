import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/InvocationContext";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, Avatar,
  Chip, IconButton, Tooltip, Badge, alpha, useMediaQuery, useTheme,
  SwipeableDrawer,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityIcon from "@mui/icons-material/Security";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import MenuIcon from "@mui/icons-material/Menu";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const DRAWER_WIDTH = 256;
const sidebarBg = "radial-gradient(circle at top, rgba(251,191,36,0.12), transparent 18%), linear-gradient(168deg, #0b1220 0%, #13284c 56%, #102952 100%)";

const navItems = [
  {
    label: "Dashboard", icon: <DashboardIcon />, path: "/",
    desc: "Overview & analytics",
  },
  {
    label: "Initiate Invocation", icon: <AddCircleOutlineIcon />, path: "/initiate",
    desc: "Submit new request",
  },
  {
    label: "Account Maker", icon: <AccountBalanceIcon />, path: "/maker", badgeKey: "pendingMaker",
    desc: "1st level approval",
  },
  {
    label: "Account Checker", icon: <VerifiedUserIcon />, path: "/checker", badgeKey: "pendingChecker",
    desc: "2nd level review",
  },
  {
    label: "Risk Approval", icon: <SecurityIcon />, path: "/risk", badgeKey: "pendingRisk",
    desc: "Final risk sign-off",
  },
  {
    label: "Target DP Master", icon: <AccountTreeIcon />, path: "/target-dp",
    desc: "Demat account config",
  },
];

const workflowSteps = [
  { step: "1", label: "Initiate", color: "#3b82f6" },
  { step: "2", label: "Maker", color: "#f59e0b" },
  { step: "3", label: "Checker", color: "#8b5cf6" },
  { step: "4", label: "Risk", color: "#059669" },
];

function SidebarContent({ navigate, location, onClose, badges }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2.5,
            background: "linear-gradient(135deg, #f59e0b, #fde68a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 12px 28px -12px rgba(245,158,11,0.85)",
          }}>
            <Typography sx={{ fontWeight: 900, color: "#1e40af", fontSize: 15 }}>AW</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: "white", fontSize: 14, lineHeight: 1.2 }}>
              Aureon Wealth Ops
            </Typography>
            <Typography sx={{ color: alpha("#fff", 0.5), fontSize: 11 }}>Collateral control platform</Typography>
          </Box>
        </Box>

        {/* Workflow indicator */}
        <Box sx={{
          bgcolor: alpha("#fff", 0.07), borderRadius: 3, p: 1.5,
          border: `1px solid ${alpha("#fff", 0.1)}`,
          boxShadow: `inset 0 1px 0 ${alpha("#fff", 0.06)}`,
        }}>
          <Typography sx={{ color: alpha("#fff", 0.5), fontSize: 10, fontWeight: 700, letterSpacing: 1, mb: 1 }}>
            WORKFLOW
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {workflowSteps.map((s, i) => (
              <React.Fragment key={s.step}>
                <Box sx={{
                  display: "flex", flexDirection: "column", alignItems: "center", flex: 1,
                }}>
                  <Box sx={{
                    width: 24, height: 24, borderRadius: "50%",
                    bgcolor: s.color, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "white",
                  }}>{s.step}</Box>
                  <Typography sx={{ color: alpha("#fff", 0.6), fontSize: 9, mt: 0.4 }}>{s.label}</Typography>
                </Box>
                {i < workflowSteps.length - 1 && (
                  <Box sx={{ width: 12, height: 1, bgcolor: alpha("#fff", 0.2), mb: 2 }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: alpha("#fff", 0.08) }} />

      {/* Nav Items */}
      <List sx={{ px: 1.5, pt: 1.5, flex: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); onClose?.(); }}
                sx={{
                  borderRadius: 3,
                  bgcolor: active ? alpha("#fff", 0.12) : "transparent",
                  border: active ? `1px solid ${alpha("#fff", 0.16)}` : "1px solid transparent",
                  borderLeft: active ? `3px solid #fbbf24` : `3px solid transparent`,
                  "&:hover": { bgcolor: alpha("#fff", 0.08), transform: "translateX(2px)" },
                  py: 1.2, px: 1.5,
                  transition: "all 0.18s ease",
                }}
              >
                <ListItemIcon sx={{
                  color: active ? "#fbbf24" : alpha("#fff", 0.55),
                  minWidth: 34,
                }}>
                  {item.badgeKey ? (
                    <Badge
                      badgeContent={badges?.[item.badgeKey] || 0}
                      color="error"
                      sx={{ "& .MuiBadge-badge": { fontSize: 9, height: 15, minWidth: 15, right: -2, top: -2 } }}
                    >
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.desc}
                  primaryTypographyProps={{
                    fontSize: 13.5, fontWeight: active ? 700 : 500,
                    color: active ? "white" : alpha("#fff", 0.85),
                  }}
                  secondaryTypographyProps={{
                    fontSize: 10.5, color: alpha("#fff", 0.4),
                    sx: { display: active ? "block" : "none" },
                  }}
                />
                {active && (
                  <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#fbbf24" }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: alpha("#fff", 0.08) }} />

      {/* Sandbox user */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1.5,
          bgcolor: alpha("#fff", 0.07), borderRadius: 3, p: 1.5,
          border: `1px solid ${alpha("#fff", 0.1)}`,
        }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: "#f59e0b", fontSize: 13, fontWeight: 700 }}>AM</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: "white", fontWeight: 700, fontSize: 12.5, lineHeight: 1.2 }}>Aarav Mehta</Typography>
            <Typography sx={{ color: alpha("#fff", 0.45), fontSize: 10.5 }}>All Roles · Sandbox Mode</Typography>
          </Box>
          <Chip
            label="LAB"
            size="small"
            sx={{ bgcolor: "#059669", color: "white", fontSize: 9, height: 18, fontWeight: 700 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const ctx = useContext(AppContext);
  const badges = ctx ? {
    pendingMaker:   ctx.stats.pendingMaker,
    pendingChecker: ctx.stats.pendingChecker,
    pendingRisk:    ctx.stats.pendingRisk,
  } : {};
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentNav = navItems.find((n) => n.path === location.pathname) || navItems[0];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH, flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH, boxSizing: "border-box",
              background: sidebarBg, borderRight: "none",
              boxShadow: "12px 0 32px -22px rgba(15,23,42,0.9)",
            },
          }}
        >
          <SidebarContent navigate={navigate} location={location} badges={badges} />
        </Drawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <SwipeableDrawer
          open={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH, background: sidebarBg,
            },
          }}
        >
          <SidebarContent navigate={navigate} location={location} onClose={() => setMobileOpen(false)} badges={badges} />
        </SwipeableDrawer>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, width: "100%" }}>
        {/* Topbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: alpha("#ffffff", 0.92),
            borderBottom: "1px solid rgba(148,163,184,0.2)",
            boxShadow: "0 2px 20px -8px rgba(15,23,42,0.1)",
            zIndex: 100,
          }}
        >
          <Toolbar sx={{ gap: 1.5, minHeight: { xs: 56, sm: 64 } }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} edge="start" size="small">
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ color: "primary.dark", fontSize: { xs: 15, sm: 17 }, fontWeight: 700 }} noWrap>
                {currentNav.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
                {currentNav.desc}
              </Typography>
            </Box>

            <Tooltip title="Interactive sandbox with synthetic data only">
              <Chip
                icon={<PlayCircleOutlineIcon sx={{ fontSize: "14px !important" }} />}
                label="Product Sandbox"
                size="small"
                sx={{
                  bgcolor: "rgba(239,246,255,0.85)", color: "#1e40af", fontWeight: 700,
                  border: "1px solid rgba(147,197,253,0.7)", fontSize: 11,
                  display: { xs: "none", sm: "flex" },
                }}
              />
            </Tooltip>

            <Avatar sx={{ width: 32, height: 32, bgcolor: "#f59e0b", fontSize: 12, fontWeight: 700 }}>AM</Avatar>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{
          flex: 1,
          overflow: "auto",
          p: { xs: 2, sm: 3 },
          width: "100%",
          boxSizing: "border-box",
          background: "radial-gradient(circle at top right, rgba(191,219,254,0.26), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0))",
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
