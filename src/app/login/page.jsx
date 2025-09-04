"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Box,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (!loading && user) {
      router.push("/selecione-o-condominio");
    }
  }, [user, loading, router]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
      router.push("/selecione-o-condominio");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreatAccout = () => {
    setError("");
    router.push("/cadastro");
  };

  if (loading || user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: theme.palette.background.default,
        }}
      >
        <Image src="/simple-logo.png" alt="Logo" width={150} height={150} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={0}
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
        <Box mb={4}>
          <img src="/simple-logo.png" alt="Logo" style={{ width: 100 }} />
        </Box>

        <TextField
          placeholder="Digite seu e-mail"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          <Typography
            color="error"
            sx={{ mt: 2, maxWidth: 400, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        {/* Botão Entrar */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            mb: 1,
            backgroundColor:
              theme.palette.mode === "light" ? "#545454" : "#ccc",
            color: theme.palette.getContrastText(
              theme.palette.mode === "light" ? "#545454" : "#ccc"
            ),
            textTransform: "uppercase",
            fontWeight: "bold",
            maxWidth: 400,
            borderRadius: 2,
            padding: "10px 0",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light" ? "#333" : "#999",
            },
          }}
          onClick={handleLogin}
        >
          LOGAR
        </Button>

        {/* Esqueci minha senha */}
        <Button
          variant="text"
          fullWidth
          sx={{
            color: theme.palette.error.main,
            textTransform: "uppercase",
            fontWeight: "bold",
            mt: 1,
            maxWidth: 400,
          }}
        >
          Esqueci minha senha
        </Button>

        <Divider
          sx={{
            my: 3,
            width: "100%",
            maxWidth: 400,
            color: theme.palette.text.secondary,
          }}
        >
          OU
        </Divider>

        {/* Botão Criar Conta */}
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
          onClick={handleCreatAccout}
        >
          NÃO TENHO UMA CONTA
        </Button>
      </Paper>

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
