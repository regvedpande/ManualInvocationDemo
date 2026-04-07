import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, Avatar,
  Chip, IconButton, Tooltip, Badge, useTheme, alpha,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityIcon from "@mui/icons-material/Security";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { label: "Initiate Invocation", icon: <AddCircleOutlineIcon />, path: "/initiate" },
  { label: "Account Maker", icon: <AccountBalanceIcon />, path: "/maker", badge: 2 },
  { label: "Account Checker", icon: <VerifiedUserIcon />, path: "/checker", badge: 2 },
  { label: "Risk Approval", icon: <SecurityIcon />, path: "/risk", badge: 2 },
  { label: "Target DP Master", icon: <AccountTreeIcon />, path: "/target-dp" },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const currentNav = navItems.find((n) => n.path === location.pathname) || navItems[0];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "primary.main",
            color: "white",
            borderRight: "none",
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ px: 2.5, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 2,
              bgcolor: "secondary.main", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Typography variant="subtitle2" sx={{ color: "white", fontSize: 13 }}>MI</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "white", lineHeight: 1.2 }}>Manual Invocation</Typography>
            <Typography variant="caption" sx={{ color: alpha("#fff", 0.6) }}>FinSmart Platform</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: alpha("#fff", 0.15) }} />

        {/* Nav */}
        <List sx={{ px: 1.5, pt: 1.5, flex: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: active ? alpha("#fff", 0.15) : "transparent",
                    "&:hover": { bgcolor: alpha("#fff", 0.1) },
                    py: 1,
                  }}
                >
                  <ListItemIcon sx={{ color: active ? "secondary.main" : alpha("#fff", 0.7), minWidth: 36 }}>
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16 } }}>
                        {item.icon}
                      </Badge>
                    ) : item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 13.5, fontWeight: active ? 600 : 400, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* User */}
        <Divider sx={{ borderColor: alpha("#fff", 0.15) }} />
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 13 }}>RK</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: "white", fontWeight: 600, display: "block" }}>Rahul Kumar</Typography>
            <Typography variant="caption" sx={{ color: alpha("#fff", 0.55), fontSize: 10 }}>Initiator</Typography>
          </Box>
          <Chip label="DEMO" size="small" sx={{ bgcolor: "secondary.main", color: "white", fontSize: 9, height: 18 }} />
        </Box>
      </Drawer>

      {/* Main */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e8ecf0" }}>
          <Toolbar sx={{ gap: 1 }}>
            <Typography variant="h6" sx={{ color: "primary.main", flex: 1, fontSize: 16 }}>
              {currentNav.label}
            </Typography>
            <Chip label="MOCK DEMO" size="small" color="secondary" variant="outlined" sx={{ fontSize: 11 }} />
            <Tooltip title="Notifications">
              <IconButton size="small">
                <Badge badgeContent={3} color="error">
                  <NotificationsNoneIcon sx={{ color: "text.secondary" }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Help">
              <IconButton size="small">
                <HelpOutlineIcon sx={{ color: "text.secondary" }} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
