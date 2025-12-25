import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

const AnimatedBackground = ({ variant = "default" }) => {
  const gradients = {
    default: [
      {
        color: "rgba(99, 102, 241, 0.15)",
        size: 600,
        x: "10%",
        y: "20%",
        duration: 20,
      },
      {
        color: "rgba(236, 72, 153, 0.12)",
        size: 500,
        x: "80%",
        y: "60%",
        duration: 25,
      },
      {
        color: "rgba(139, 92, 246, 0.1)",
        size: 400,
        x: "50%",
        y: "80%",
        duration: 22,
      },
    ],
    auth: [
      {
        color: "rgba(99, 102, 241, 0.2)",
        size: 800,
        x: "0%",
        y: "0%",
        duration: 30,
      },
      {
        color: "rgba(236, 72, 153, 0.15)",
        size: 600,
        x: "100%",
        y: "100%",
        duration: 35,
      },
      {
        color: "rgba(16, 185, 129, 0.1)",
        size: 500,
        x: "50%",
        y: "50%",
        duration: 28,
      },
    ],
    journal: [
      {
        color: "rgba(99, 102, 241, 0.08)",
        size: 700,
        x: "20%",
        y: "10%",
        duration: 25,
      },
      {
        color: "rgba(139, 92, 246, 0.06)",
        size: 500,
        x: "70%",
        y: "70%",
        duration: 30,
      },
      {
        color: "rgba(236, 72, 153, 0.05)",
        size: 400,
        x: "90%",
        y: "20%",
        duration: 22,
      },
    ],
  };

  const blobs = gradients[variant] || gradients.default;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: -1,
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          style={{
            position: "absolute",
            width: blob.size,
            height: blob.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            left: blob.x,
            top: blob.y,
            transform: "translate(-50%, -50%)",
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;
