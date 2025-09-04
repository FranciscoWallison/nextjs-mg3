"use client";

import { useEffect, useState } from "react";

export default function ThemeSwitch({ mode, toggleTheme }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      onClick={toggleTheme}
      style={{
        width: 70,
        height: 34,
        borderRadius: 30,
        background: mode === "light" ? "#e0e0e0" : "#222",
        position: "fixed",
        top: 20,
        right: 20,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px",
        transition: "background 0.3s",
        zIndex: 1000,
        color: mode === "light" ? "#000" : "#fff",
        fontSize: 14,
      }}
    >
      <span role="img" aria-label="sun">
        ☀️
      </span>

      <div
        style={{
          position: "absolute",
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#fff",
          transform: mode === "light" ? "translateX(4px)" : "translateX(40px)",
          transition: "transform 0.3s",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      />

      <span role="img" aria-label="moon">
        🌙
      </span>
    </div>
  );
}
