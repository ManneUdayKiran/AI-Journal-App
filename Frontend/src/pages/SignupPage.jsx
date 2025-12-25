// src/pages/SignupPage.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  AutoAwesome as SparkleIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { staggerContainer, staggerItem } from "../utils/animations";
import { API_ENDPOINTS } from "../config/api";

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

// Password strength calculator
const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
  if (password.match(/\d/)) strength += 25;
  if (password.match(/[^a-zA-Z\d]/)) strength += 25;
  return strength;
};

const getStrengthLabel = (strength) => {
  if (strength <= 25) return { label: "Weak", color: "#ef4444" };
  if (strength <= 50) return { label: "Fair", color: "#f59e0b" };
  if (strength <= 75) return { label: "Good", color: "#10b981" };
  return { label: "Strong", color: "#059669" };
};

export default function SignupPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getStrengthLabel(passwordStrength);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 50) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.signup, {
        email,
        password,
      });
      login(res.data.token);
      navigate("/journal");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Analysis",
      desc: "Get insights from your entries",
    },
    {
      icon: "📊",
      title: "Mood Tracking",
      desc: "Visualize your emotional journey",
    },
    {
      icon: "🔒",
      title: "Private & Secure",
      desc: "Your data is encrypted and safe",
    },
  ];

  return (
    <>
      <AnimatedBackground variant="auth" />
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <MotionBox
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 6,
            width: "100%",
            maxWidth: 1000,
          }}
        >
          {/* Left side - Features */}
          <MotionBox
            variants={staggerItem}
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
              mb: { xs: 2, md: 0 },
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: { xs: "auto", md: 0 },
                  mb: 3,
                  boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)",
                }}
              >
                <SparkleIcon sx={{ fontSize: 40, color: "white" }} />
              </Box>
            </motion.div>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Start Your Journey
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                mb: 4,
                maxWidth: 400,
                mx: { xs: "auto", md: 0 },
              }}
            >
              Join thousands of people who are already improving their mental
              wellness with AI Journal
            </Typography>

            {/* Feature cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.15 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 3,
                      background: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </MotionBox>

          {/* Right side - Signup Form */}
          <MotionPaper
            variants={staggerItem}
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: 450,
              width: "100%",
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Start your journaling journey today
            </Typography>

            <Box component="form" onSubmit={handleSignup}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Password strength
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: strengthInfo.color, fontWeight: 600 }}
                        >
                          {strengthInfo.label}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(0,0,0,0.1)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor: strengthInfo.color,
                          },
                        }}
                      />
                    </Box>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: confirmPassword &&
                      password === confirmPassword && (
                        <InputAdornment position="end">
                          <CheckIcon sx={{ color: "#10b981" }} />
                        </InputAdornment>
                      ),
                  }}
                  error={confirmPassword !== "" && password !== confirmPassword}
                  helperText={
                    confirmPassword !== "" && password !== confirmPassword
                      ? "Passwords do not match"
                      : ""
                  }
                  sx={{ mb: 3 }}
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        "& .MuiAlert-icon": { alignItems: "center" },
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    background:
                      "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                    boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)",
                    "&:hover": {
                      boxShadow: "0 15px 40px rgba(236, 72, 153, 0.4)",
                      background:
                        "linear-gradient(135deg, #db2777 0%, #7c3aed 100%)",
                    },
                  }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✨
                    </motion.div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already a member?
                </Typography>
              </Divider>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/"
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    borderWidth: 2,
                    borderColor: "#ec4899",
                    color: "#ec4899",
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "#ec4899",
                      background: "rgba(236, 72, 153, 0.05)",
                    },
                  }}
                >
                  Sign In Instead
                </Button>
              </motion.div>
            </Box>
          </MotionPaper>
        </MotionBox>
      </Container>
    </>
  );
}
