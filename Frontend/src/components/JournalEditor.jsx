import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  Chip,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  AutoAwesome as SparkleIcon,
  ArrowBack as BackIcon,
  TipsAndUpdates as TipsIcon,
} from "@mui/icons-material";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import AnimatedBackground from "./AnimatedBackground";
import { staggerContainer, staggerItem } from "../utils/animations";
import { API_ENDPOINTS } from "../config/api";

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

export default function JournalEditor() {
  const [entry, setEntry] = useState("");
  const [summary, setSummary] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const prompts = [
    "What made you smile today?",
    "What's one thing you're grateful for?",
    "What's been on your mind lately?",
    "Describe a challenge you overcame today.",
  ];

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API_ENDPOINTS.createEntry,
        { content: entry },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data.summary);
      setMood(res.data.mood);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze your entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMoodGradient = (mood) => {
    const moods = {
      happy: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
      sad: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
      angry: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      anxious: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
      stressed: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
      neutral: "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)",
      content: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
    };
    return (
      moods[mood?.toLowerCase()] ||
      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
    );
  };

  return (
    <>
      <AnimatedBackground variant="journal" />
      <Navbar />

      <Container
        maxWidth="md"
        sx={{
          pt: { xs: 10, sm: 12 },
          pb: 6,
          minHeight: "100vh",
        }}
      >
        <MotionBox
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Back Button */}
          <MotionBox variants={staggerItem}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate("/journal")}
              sx={{
                mb: 3,
                color: "text.secondary",
                "&:hover": {
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                },
              }}
            >
              Back to Journal
            </Button>
          </MotionBox>

          {/* Header */}
          <MotionBox variants={staggerItem} sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              What's on your mind?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Express yourself freely. Our AI will analyze your emotions and
              provide insights.
            </Typography>
          </MotionBox>

          {/* Writing Prompts */}
          <MotionBox variants={staggerItem} sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <TipsIcon sx={{ fontSize: 18 }} /> Need inspiration?
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {prompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Chip
                    label={prompt}
                    onClick={() => setEntry(prompt)}
                    sx={{
                      borderRadius: 3,
                      cursor: "pointer",
                      background: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      "&:hover": {
                        background: "rgba(99, 102, 241, 0.15)",
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </MotionBox>

          {/* Editor Card */}
          <MotionPaper
            variants={staggerItem}
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
            }}
          >
            <TextField
              placeholder="Start writing your thoughts here..."
              multiline
              fullWidth
              rows={10}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  background: "rgba(248, 250, 252, 0.8)",
                  "&:hover": {
                    background: "rgba(248, 250, 252, 1)",
                  },
                  "&.Mui-focused": {
                    background: "#ffffff",
                  },
                },
              }}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={loading ? null : <SparkleIcon />}
                onClick={handleSubmit}
                disabled={loading || !entry.trim()}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "1rem",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
                  "&:hover": {
                    boxShadow: "0 15px 40px rgba(99, 102, 241, 0.4)",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    Analyzing your entry...
                  </Box>
                ) : (
                  "Save & Analyze with AI"
                )}
              </Button>
            </motion.div>
          </MotionPaper>

          {/* Results Section */}
          <AnimatePresence>
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    mt: 4,
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <SparkleIcon sx={{ color: "#6366f1" }} />
                    AI Analysis Results
                  </Typography>

                  {/* Mood Section */}
                  <Box
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: 3,
                      background: getMoodGradient(mood),
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ opacity: 0.9, mb: 1 }}
                    >
                      Detected Mood
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {mood}
                    </Typography>
                  </Box>

                  {/* Summary Section */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)",
                      border: "1px solid rgba(99, 102, 241, 0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background:
                            "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                        }}
                      >
                        <SparkleIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ color: "#6366f1" }}
                      >
                        AI Summary
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      {summary}
                    </Typography>
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate("/journal")}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 3,
                        borderWidth: 2,
                        "&:hover": {
                          borderWidth: 2,
                        },
                      }}
                    >
                      View All Entries
                    </Button>
                  </motion.div>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionBox>
      </Container>
    </>
  );
}
