"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Box,
  Typography,
  FormHelperText,
  Stack,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachmentIcon from "@mui/icons-material/Attachment";

const INITIAL_VALUES = {
  name: "",
  cnpj: "",
  address: "",
  neighborhood: "",
  state: "",
  city: "",
  type: "",
  reference: "",
};

export default function AddCondominioDialog({ open, onClose, onSave }) {
  const theme = useTheme();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(INITIAL_VALUES);
      setErrors({});
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((err) => ({ ...err, [field]: undefined }));
    }
  };

  const handleClose = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    const requiredFields = ["name", "address", "neighborhood", "state", "city", "type"];
    requiredFields.forEach((f) => {
      if (!values[f]?.trim()) newErrors[f] = "Este campo é obrigatório";
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await onSave({ ...values, referenceId: values.reference || null });
      setValues(INITIAL_VALUES);
      setErrors({});
      onClose();
    } catch (e) {
      setErrors((err) => ({ ...err, form: e.message || "Falha ao salvar" }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
          Adicionar Condomínio
        </Typography>
        <IconButton onClick={onClose} aria-label="Fechar" sx={{ color: theme.palette.text.secondary }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Seção 1 */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: "8px",
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "medium", color: theme.palette.text.primary }}>
                Dados Básicos
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    label="*Nome do condomínio"
                    value={values.name}
                    onChange={handleChange("name")}
                    error={!!errors.name}
                    helperText={errors.name || " "}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    label="CNPJ"
                    value={values.cnpj}
                    onChange={handleChange("cnpj")}
                    fullWidth
                    helperText=" "
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Seção 2 */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: "8px",
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "medium", color: theme.palette.text.primary }}>
                Localização
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    label="*Endereço"
                    value={values.address}
                    onChange={handleChange("address")}
                    error={!!errors.address}
                    helperText={errors.address || " "}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    label="*Bairro"
                    value={values.neighborhood}
                    onChange={handleChange("neighborhood")}
                    error={!!errors.neighborhood}
                    helperText={errors.neighborhood || " "}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={!!errors.state} required>
                    <InputLabel id="state-select-label">*Estado</InputLabel>
                    <Select
                      labelId="state-select-label"
                      id="state-select"
                      value={values.state}
                      onChange={handleChange("state")}
                      label="*Estado"
                    >
                      <MenuItem value=""><em>Selecione</em></MenuItem>
                      <MenuItem value="SP">São Paulo</MenuItem>
                      <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                    </Select>
                    <FormHelperText>{errors.state || " "}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={!!errors.city} required>
                    <InputLabel id="city-select-label">*Cidade</InputLabel>
                    <Select
                      labelId="city-select-label"
                      id="city-select"
                      value={values.city}
                      onChange={handleChange("city")}
                      label="*Cidade"
                    >
                      <MenuItem value=""><em>Selecione</em></MenuItem>
                      <MenuItem value="sao_paulo">São Paulo</MenuItem>
                      <MenuItem value="rio">Rio de Janeiro</MenuItem>
                    </Select>
                    <FormHelperText>{errors.city || " "}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Seção 3 */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: "8px",
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "medium", color: theme.palette.text.primary }}>
                Detalhes Adicionais
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={!!errors.type} required>
                    <InputLabel id="type-select-label">*Tipo</InputLabel>
                    <Select
                      labelId="type-select-label"
                      id="type-select"
                      value={values.type}
                      onChange={handleChange("type")}
                      label="*Tipo"
                    >
                      <MenuItem value=""><em>Selecione</em></MenuItem>
                      <MenuItem value="Residencial">Residencial</MenuItem>
                      <MenuItem value="Comercial">Comercial</MenuItem>
                    </Select>
                    <FormHelperText>{errors.type || " "}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    label="Anexar foto"
                    disabled
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AttachmentIcon sx={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                      ),
                    }}
                    helperText=" "
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="reference-select-label">Condomínio de referência</InputLabel>
                    <Select
                      labelId="reference-select-label"
                      id="reference-select"
                      value={values.reference}
                      onChange={handleChange("reference")}
                      label="Condomínio de referência"
                    >
                      <MenuItem value=""><em>Nenhum</em></MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, bgcolor: theme.palette.background.default }}>
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
