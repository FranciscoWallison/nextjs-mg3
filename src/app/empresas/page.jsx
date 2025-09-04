"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function EmpresasPage() {
  const theme = useTheme(); // pega o tema atual
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState("form");

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          cnpj: cnpj || undefined,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        const backendMsg =
          data?.error ||
          (data?.issues?.fieldErrors &&
            Object.values(data.issues.fieldErrors).flat().join(", ")) ||
          "Erro ao criar empresa";

        if (res.status >= 500) {
          setError(backendMsg);
          setView("error");
          return;
        }

        throw new Error(backendMsg);
      }

      setResult(data);
      setView("result");
    } catch (err) {
      setError(err.message || "Falha ao criar empresa");
      setView("form");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setError("Não consegui copiar para a área de transferência.");
    }
  };

  const linkCadastro = result ? `/cadastro/${result.empresaToken}` : "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Lado esquerdo */}
      <Box
        component="form"
        onSubmit={handleCreate}
        sx={{
          flex: 1,
          padding: { xs: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box mb={2}>
          <img src="/simple-logo.png" alt="Logo" style={{ width: 100 }} />
        </Box>

        {view === "form" && (
          <>
            <Typography
              variant="h5"
              sx={{ mb: 2, fontWeight: "bold", color: theme.palette.text.primary }}
            >
              Nova empresa
            </Typography>

            <TextField
              placeholder="Nome da empresa"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ maxWidth: 400 }}
            />

            <TextField
              placeholder="E-mail da empresa"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ maxWidth: 400 }}
            />

            <TextField
              placeholder="CNPJ (opcional)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              sx={{ maxWidth: 400 }}
            />

            {error && (
              <Typography
                color="error"
                sx={{ mt: 1, maxWidth: 400, textAlign: "center" }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: theme.palette.mode === "light" ? "#545454" : "#ccc",
                color: theme.palette.getContrastText(theme.palette.mode === "light" ? "#545454" : "#ccc"),
                fontWeight: "bold",
                maxWidth: 400,
                borderRadius: 2,
                padding: "10px 0",
                "&:hover": {
                  backgroundColor: theme.palette.mode === "light" ? "#333" : "#999",
                },
              }}
            >
              {submitting ? "CRIANDO..." : "CRIAR EMPRESA"}
            </Button>
          </>
        )}

        {view === "error" && (
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || "Erro interno do servidor. Tente novamente mais tarde."}
            </Alert>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setError("");
                setView("form");
              }}
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.mode === "light" ? "#545454" : "#ccc",
                "&:hover": { backgroundColor: theme.palette.mode === "light" ? "#333" : "#999" },
              }}
            >
              Tentar novamente
            </Button>
          </Box>
        )}

        {view === "result" && result && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", mb: 1, color: theme.palette.text.primary }}
            >
              Empresa criada
            </Typography>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Token da empresa
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  mt: 0.5,
                }}
              >
                <Typography
                  component="code"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: 13,
                    flex: 1,
                    wordBreak: "break-all",
                    color: theme.palette.text.primary,
                  }}
                >
                  {result.empresaToken}
                </Typography>

                <Tooltip title="Copiar token">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(result.empresaToken, "Token copiado!")}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Link de cadastro
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  mt: 0.5,
                }}
              >
                <Typography
                  component="code"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: 13,
                    flex: 1,
                    wordBreak: "break-all",
                    color: theme.palette.text.primary,
                  }}
                >
                  {linkCadastro}
                </Typography>

                <Tooltip title="Copiar link">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(linkCadastro, "Link copiado!")}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                component={Link}
                href={linkCadastro}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Abrir página de cadastro
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{ borderRadius: 2 }}
                onClick={() => {
                  setName("");
                  setEmail("");
                  setCnpj("");
                  setResult(null);
                  setError("");
                  setView("form");
                }}
              >
                Criar outra
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2, width: "100%", maxWidth: 400 }}>OU</Divider>

        <Button
          variant="outlined"
          fullWidth
          sx={{ maxWidth: 400, borderRadius: 2, padding: "10px 0" }}
          component={Link}
          href="/login"
        >
          VOLTAR AO LOGIN
        </Button>
      </Box>

      {/* Lado direito */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: "url(/town-image.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: { xs: "contain", md: "cover" },
          backgroundPosition: "center",
          height: { xs: 250, md: "auto" },
          minHeight: { xs: 250, md: "100vh" },
          backgroundColor: theme.palette.background.default,
        }}
      />

      {/* Snackbar de cópia */}
      <Snackbar
        open={!!copied}
        autoHideDuration={2000}
        onClose={() => setCopied("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setCopied("")}
        >
          {copied}
        </Alert>
      </Snackbar>
    </Box>
  );
}
