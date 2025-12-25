import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Paper,
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import axios from "axios";
import MoodIcon from "@mui/icons-material/Mood";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentSadIcon from "@mui/icons-material/MoodBad";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../config/api";

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

const moodConfig = {
  happy: {
    icon: SentimentVerySatisfiedIcon,
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
  },
  sad: {
    icon: SentimentSadIcon,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
  },
  stressed: {
    icon: SentimentDissatisfiedIcon,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
  },
  angry: {
    icon: SentimentVeryDissatisfiedIcon,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
  },
  neutral: {
    icon: SentimentNeutralIcon,
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.1)",
    gradient: "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)",
  },
  content: {
    icon: SentimentSatisfiedAltIcon,
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
    gradient: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
  },
  anxious: {
    icon: SentimentDissatisfiedIcon,
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.1)",
    gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
  },
  default: {
    icon: MoodIcon,
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.1)",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
};

const getMoodConfig = (mood) => {
  return moodConfig[mood?.toLowerCase()] || moodConfig.default;
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: {
    opacity: 0,
    x: -100,
    transition: { duration: 0.3 },
  },
};

export default function Timeline({ entries, handleDelete, setEntries }) {
  const [editingEntry, setEditingEntry] = useState(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEditOpen = (entry) => {
    setEditingEntry(entry);
    setEditText(entry.content);
  };

  const handleEditSave = async () => {
    if (!editingEntry || !editText.trim()) return;
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        API_ENDPOINTS.editEntry(editingEntry._id),
        { content: editText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEntries((prev) =>
        prev.map((e) => (e._id === editingEntry._id ? res.data : e))
      );

      setEditingEntry(null);
      setEditText("");
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <>
      <Stack spacing={3} sx={{ maxWidth: 900, mx: "auto" }}>
        <AnimatePresence mode="popLayout">
          {entries.map((entry, index) => {
            const mood = getMoodConfig(entry.mood);
            const MoodIconComponent = mood.icon;

            return (
              <MotionCard
                key={entry._id || entry.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                elevation={0}
                sx={{
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  overflow: "hidden",
                  position: "relative",
                  "&:hover": {
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-4px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {/* Mood accent bar */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: mood.gradient,
                  }}
                />

                <CardContent
                  sx={{ p: { xs: 2.5, sm: 4 }, pl: { xs: 3.5, sm: 5 } }}
                >
                  {/* Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 3 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background:
                            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          fontWeight: 600,
                          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                        }}
                      >
                        U
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Your Entry
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarTodayIcon
                            sx={{ fontSize: 14, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(entry.date)}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        icon={
                          <MoodIconComponent
                            sx={{
                              fontSize: 18,
                              color: `${mood.color} !important`,
                            }}
                          />
                        }
                        label={entry.mood}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          borderColor: mood.color,
                          color: mood.color,
                          background: mood.bgColor,
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      />
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEditOpen(entry)}
                          size="small"
                          sx={{
                            background: "rgba(99, 102, 241, 0.1)",
                            "&:hover": {
                              background: "rgba(99, 102, 241, 0.2)",
                            },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 18, color: "#6366f1" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(entry._id)}
                          size="small"
                          sx={{
                            background: "rgba(239, 68, 68, 0.1)",
                            "&:hover": { background: "rgba(239, 68, 68, 0.2)" },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {/* Content */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "rgba(248, 250, 252, 0.8)",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.8,
                        color: "text.primary",
                      }}
                    >
                      {entry.content}
                    </Typography>
                  </Paper>

                  {/* AI Summary */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)",
                      border: "1px solid rgba(99, 102, 241, 0.1)",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background:
                            "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                        }}
                      >
                        <AutoAwesomeIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#6366f1",
                            fontWeight: 600,
                            mb: 0.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          AI Insight ✨
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.7,
                            color: "text.secondary",
                          }}
                        >
                          {entry.summary}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </MotionCard>
            );
          })}
        </AnimatePresence>
      </Stack>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingEntry}
        onClose={() => !saving && setEditingEntry(null)}
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
                <EditIcon sx={{ color: "white" }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Edit Entry
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your journal entry and AI will re-analyze it
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setEditingEntry(null)}
              disabled={saving}
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
          <TextField
            multiline
            fullWidth
            rows={8}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Update your thoughts..."
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
            onClick={() => setEditingEntry(null)}
            disabled={saving}
            sx={{ px: 3, borderRadius: 2 }}
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              onClick={handleEditSave}
              disabled={saving || !editText.trim()}
              sx={{
                px: 4,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              {saving ? (
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
                  Updating...
                </Box>
              ) : (
                "Save Changes"
              )}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </>
  );
}
