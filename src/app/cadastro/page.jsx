"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword((v) => !v);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao criar conta.");
      }

      // login automático após cadastro
      login(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleReturnLogin = (event) => {
    event.preventDefault();
    setError("");
    router.push("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          flex: 1,
          padding: { xs: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box mb={2}>
          <img src="/simple-logo.png" alt="Logo" style={{ width: 100 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", color: theme.palette.text.primary }}
        >
          Crie sua conta
        </Typography>

        <TextField
          placeholder="Digite seu nome completo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
            },
          }}
        />

        <TextField
          placeholder="Digite seu e-mail"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
            },
          }}
        />

        <TextField
          placeholder="Digite sua senha"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Mostrar ou ocultar senha"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" sx={{ mt: 2, maxWidth: 400 }}>
            {error}
          </Typography>
        )}

        {/* Botão Cadastrar */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor:
              theme.palette.mode === "light" ? "#545454" : "#ccc",
            color: theme.palette.getContrastText(
              theme.palette.mode === "light" ? "#545454" : "#ccc"
            ),
            fontWeight: "bold",
            textTransform: "uppercase",
            maxWidth: 400,
            borderRadius: 2,
            padding: "10px 0",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light" ? "#333" : "#999",
            },
          }}
        >
          CADASTRAR
        </Button>

        <Divider
          sx={{
            my: 2,
            width: "100%",
            maxWidth: 400,
            color: theme.palette.text.secondary,
          }}
        >
          OU
        </Divider>

        {/* Botão Já tenho conta */}
        <Button
          variant="outlined"
          fullWidth
          sx={{
            maxWidth: 400,
            borderRadius: 2,
            padding: "10px 0",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
          onClick={handleReturnLogin}
        >
          JÁ TENHO UMA CONTA
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          backgroundImage: "url(/town-image.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: { xs: "contain", md: "cover" },
          backgroundPosition: "center",
          height: { xs: 250, md: "auto" },
          minHeight: { xs: 250, md: "100vh" },
          bgcolor: theme.palette.background.default,
        }}
      />
    </Box>
  );
}
