import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Button,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import {
  AutoAwesome as SparkleIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);

// Hide navbar on scroll
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
              }}
              onClick={() => navigate(isAuthenticated ? "/journal" : "/")}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                }}
              >
                <SparkleIcon sx={{ fontSize: 22, color: "white" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: { xs: "none", sm: "block" },
                }}
              >
                AI Journal
              </Typography>
            </Box>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAuthenticated ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip title="Your Profile">
                  <Button
                    onClick={handleAvatarClick}
                    sx={{
                      borderRadius: "50px",
                      px: 2,
                      py: 1,
                      background: "rgba(99, 102, 241, 0.1)",
                      "&:hover": {
                        background: "rgba(99, 102, 241, 0.15)",
                      },
                    }}
                    endIcon={
                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowDownIcon sx={{ color: "#6366f1" }} />
                      </motion.div>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      U
                    </Avatar>
                  </Button>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 3,
                      minWidth: 200,
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Signed in as
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      User
                    </Typography>
                  </Box>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 2,
                      color: "#ef4444",
                      "&:hover": {
                        background: "rgba(239, 68, 68, 0.1)",
                      },
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => navigate("/")}
                  variant="text"
                  sx={{
                    color: "#64748b",
                    "&:hover": {
                      color: "#6366f1",
                      background: "rgba(99, 102, 241, 0.05)",
                    },
                  }}
                >
                  Sign In
                </Button>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigate("/signup")}
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Box>
            )}
          </motion.div>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
