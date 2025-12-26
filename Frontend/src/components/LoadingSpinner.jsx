import React from "react";
import { Box, Typography } from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Lottie from "lottie-react";

// Custom animated loading component
const LoadingSpinner = ({ message = "Loading...", size = "medium" }) => {
  const sizes = {
    small: { spinner: 40, text: "body2" },
    medium: { spinner: 60, text: "body1" },
    large: { spinner: 80, text: "h6" },
  };

  const { spinner, text } = sizes[size];

  // Animated dots for the spinner
  const dotVariants = {
    initial: { y: 0 },
    animate: (i) => ({
      y: [-8, 0, -8],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: i * 0.1,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        py: 4,
      }}
    >
      {/* Animated spinner */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            style={{
              width: spinner / 4,
              height: spinner / 4,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${
                ["#6366f1", "#8b5cf6", "#ec4899", "#f472b6"][i]
              } 0%, ${["#4f46e5", "#7c3aed", "#db2777", "#ec4899"][i]} 100%)`,
              boxShadow: `0 4px 15px ${
                [
                  "rgba(99, 102, 241, 0.4)",
                  "rgba(139, 92, 246, 0.4)",
                  "rgba(236, 72, 153, 0.4)",
                  "rgba(244, 114, 182, 0.4)",
                ][i]
              }`,
            }}
          />
        ))}
      </Box>

      {/* Loading text with shimmer effect */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        <Typography
          variant={text}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 600,
          }}
        >
          {message}
        </Typography>
      </motion.div>
    </Box>
  );
};

// Full page loading overlay
export const FullPageLoader = ({ message = "Loading your journal..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(248, 250, 252, 0.9)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        {/* Main animated logo/spinner */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: 100,
            height: 100,
            margin: "0 auto 24px",
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            borderRadius: "30%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
          }}
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Typography variant="h3" sx={{ color: "white" }}>
              ✨
            </Typography>
          </motion.div>
        </motion.div>

        <LoadingSpinner message={message} size="large" />
      </Box>
    </motion.div>
  );
};

export default LoadingSpinner;
