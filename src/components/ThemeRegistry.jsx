"use client";

import { useState, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeSwitch from "@/components/ThemeSwitch";

export default function ThemeRegistry({ children }) {
  const [mode, setMode] = useState("light");

  // Detecta tema salvo ou do sistema
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setMode(saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeSwitch mode={mode} toggleTheme={toggleTheme} />
      {children}
    </ThemeProvider>
  );
}
