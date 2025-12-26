// src/pages/JournalPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Timeline from "../components/Timeline";
import {
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  Paper,
  Fab,
  Zoom,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  AutoAwesome as SparkleIcon,
  TipsAndUpdates as TipsIcon,
  Close as CloseIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import Navbar from "../components/NavBar";
import AnimatedBackground from "../components/AnimatedBackground";
import LoadingSpinner, { FullPageLoader } from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "../utils/animations";
import { API_ENDPOINTS } from "../config/api";

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState("");
  const [creating, setCreating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const showError = (message) => {
    setSnackbar({ open: true, message, severity: "error" });
  };

  // eslint-disable-next-line no-unused-vars
  const showSuccess = (message) => {
    setSnackbar({ open: true, message, severity: "success" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.getAllEntries, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(response.data);
    } catch (err) {
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.deleteEntry(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCreate = async () => {
    if (!entry.trim()) return;
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API_ENDPOINTS.createEntry,
        { content: entry },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEntries((prev) => [res.data, ...prev]);
      setOpen(false);
      setEntry("");
    } catch (err) {
      console.error("Create failed", err);
      console.error("Error response:", err.response?.data);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create entry. Please try again.";
      showError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const prompts = [
    "What made you smile today?",
    "What's one thing you're grateful for?",
    "What's been on your mind lately?",
    "Describe your perfect day.",
  ];

  if (loading) {
    return <FullPageLoader message="Loading your journal..." />;
  }

  return (
    <>
      <AnimatedBackground variant="journal" />
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 10, sm: 12 },
          pb: 10,
          minHeight: "100vh",
        }}
      >
        <MotionBox
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Header Section */}
          <MotionBox
            variants={staggerItem}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 3,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Your Journal
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {entries.length > 0
                  ? `${entries.length} ${
                      entries.length === 1 ? "entry" : "entries"
                    } in your journey`
                  : "Start documenting your thoughts and feelings"}
              </Typography>
            </Box>

            {!isMobile && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setOpen(true)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
                    "&:hover": {
                      boxShadow: "0 15px 40px rgba(99, 102, 241, 0.4)",
                    },
                  }}
                >
                  New Entry
                </Button>
              </motion.div>
            )}
          </MotionBox>

          {/* Stats Cards */}
          {entries.length > 0 && (
            <MotionBox
              variants={staggerItem}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 3,
                mb: 4,
              }}
            >
              {[
                {
                  label: "Total Entries",
                  value: entries.length,
                  icon: "📝",
                  gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                },
                {
                  label: "This Week",
                  value: entries.filter((e) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(e.date) > weekAgo;
                  }).length,
                  icon: "📅",
                  gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                },
                {
                  label: "Mood Insights",
                  value: "AI Powered",
                  icon: "🧠",
                  gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        background: stat.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        boxShadow: `0 8px 20px ${
                          stat.gradient.includes("6366f1")
                            ? "rgba(99, 102, 241, 0.3)"
                            : stat.gradient.includes("10b981")
                            ? "rgba(16, 185, 129, 0.3)"
                            : "rgba(236, 72, 153, 0.3)"
                        }`,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </MotionBox>
          )}

          {/* Empty State */}
          {entries.length === 0 && (
            <MotionPaper
              variants={staggerItem}
              elevation={0}
              sx={{
                p: { xs: 4, sm: 6 },
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                textAlign: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "30%",
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <SparkleIcon sx={{ fontSize: 50, color: "white" }} />
                </Box>
              </motion.div>

              <Typography variant="h4" fontWeight={700} gutterBottom>
                Start Your Journey
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 400, mx: "auto", mb: 4 }}
              >
                Your journal is empty. Create your first entry and let AI help
                you understand your emotions better.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                {prompts.map((prompt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Chip
                      icon={<TipsIcon sx={{ fontSize: 18 }} />}
                      label={prompt}
                      onClick={() => {
                        setEntry(prompt);
                        setOpen(true);
                      }}
                      sx={{
                        px: 1,
                        borderRadius: 3,
                        background: "rgba(99, 102, 241, 0.1)",
                        border: "1px solid rgba(99, 102, 241, 0.2)",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgba(99, 102, 241, 0.15)",
                        },
                      }}
                    />
                  </motion.div>
                ))}
              </Box>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setOpen(true)}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  Create Your First Entry
                </Button>
              </motion.div>
            </MotionPaper>
          )}

          {/* Timeline */}
          {entries.length > 0 && (
            <MotionBox variants={staggerItem}>
              <Timeline
                entries={entries}
                handleDelete={handleDelete}
                setEntries={setEntries}
              />
            </MotionBox>
          )}
        </MotionBox>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Zoom in={true}>
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setOpen(true)}
              sx={{
                position: "fixed",
                bottom: 24,
                right: 24,
                width: 64,
                height: 64,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                },
              }}
            >
              <AddIcon sx={{ fontSize: 28 }} />
            </Fab>
          </Zoom>
        )}

        {/* Create Entry Dialog */}
        <AnimatePresence>
          {open && (
            <Dialog
              open={open}
              onClose={() => !creating && setOpen(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                },
              }}
            >
              <DialogTitle sx={{ pb: 0, pt: 3, px: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PsychologyIcon sx={{ color: "white" }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        New Journal Entry
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Express yourself freely, AI will analyze your mood
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => setOpen(false)}
                    disabled={creating}
                    sx={{
                      background: "rgba(0,0,0,0.05)",
                      "&:hover": { background: "rgba(0,0,0,0.1)" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>

              <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Need inspiration? Try one of these:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {prompts.map((prompt, index) => (
                      <Chip
                        key={index}
                        label={prompt}
                        size="small"
                        onClick={() => setEntry(prompt)}
                        sx={{
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { background: "rgba(99, 102, 241, 0.1)" },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <TextField
                  placeholder="What's on your mind today? How are you feeling?"
                  multiline
                  rows={8}
                  fullWidth
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                    },
                  }}
                />
              </DialogContent>

              <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
                <Button
                  onClick={() => setOpen(false)}
                  disabled={creating}
                  sx={{ px: 3, borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={creating || !entry.trim()}
                    startIcon={creating ? null : <SparkleIcon />}
                    sx={{
                      px: 4,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    }}
                  >
                    {creating ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          ✨
                        </motion.div>
                        Analyzing...
                      </Box>
                    ) : (
                      "Save & Analyze"
                    )}
                  </Button>
                </motion.div>
              </DialogActions>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
