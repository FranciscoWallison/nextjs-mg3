// src/components/EditCondominioDialog.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
  Divider,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCondominoUI } from "@/contexts/CondominoUIContext";

// Componente auxiliar para as abas
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EditCondominioDialog({
  open,
  onClose,
  onSave,
  condominio,
}) {
  const theme = useTheme();
  const { enterCronograma } = useCondominoUI();
  const router = useRouter();
  const [values, setValues] = useState(condominio || {});
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (condominio) setValues(condominio);
  }, [condominio]);

  if (!condominio) return null;

  const handleTabChange = (event, newValue) => setCurrentTab(newValue);

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSaveChanges = () => {
    onSave(values);
    onClose();
  };

  const handleOpenCronograma = () => {
    enterCronograma({
      id: condominio.id,
      name: condominio.name,
      logoUrl: condominio.imageUrl,
    });
    router.push(`/cronograma/${condominio.id}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={
              values.imageUrl ||
              "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop"
            }
            alt={`Foto de ${values.name}`}
            style={{
              width: 60,
              height: 60,
              borderRadius: "8px",
              objectFit: "cover",
              marginRight: 16,
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            {values.name}
          </Typography>
        </Box>
        <IconButton sx={{ color: theme.palette.text.secondary }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: theme.palette.divider }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="abas de edição"
          textColor="inherit"
          indicatorColor="primary"
        >
          <Tab label="Visão Geral" />
          <Tab label="Anexos" />
          <Tab label="Anotações" />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
          Detalhes do Condomínio
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome do condomínio"
                value={values.name || ""}
                onChange={handleChange("name")}
                fullWidth
                InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CNPJ"
                value={values.cnpj || ""}
                onChange={handleChange("cnpj")}
                fullWidth
                InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Endereço"
                value={values.address || ""}
                onChange={handleChange("address")}
                fullWidth
                InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bairro"
                value={values.neighborhood || ""}
                onChange={handleChange("neighborhood")}
                fullWidth
                InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="city-select-label" sx={{ color: theme.palette.text.secondary }}>
                  Cidade
                </InputLabel>
                <Select
                  labelId="city-select-label"
                  value={values.city || ""}
                  onChange={handleChange("city")}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value="sao_paulo">São Paulo</MenuItem>
                  <MenuItem value="rio">Rio de Janeiro</MenuItem>
                  <MenuItem value="Fortaleza">Fortaleza</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="state-select-label" sx={{ color: theme.palette.text.secondary }}>
                  Estado
                </InputLabel>
                <Select
                  labelId="state-select-label"
                  value={values.state || ""}
                  onChange={handleChange("state")}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value="SP">São Paulo</MenuItem>
                  <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                  <MenuItem value="CE">Ceará</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="type-select-label" sx={{ color: theme.palette.text.secondary }}>
                  Tipo
                </InputLabel>
                <Select
                  labelId="type-select-label"
                  value={values.type || ""}
                  onChange={handleChange("type")}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value="Residencial">Residencial</MenuItem>
                  <MenuItem value="Comercial">Comercial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleOpenCronograma}
          >
            Abrir Cronograma
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={handleSaveChanges}
          >
            Salvar Alterações
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Typography color={theme.palette.text.primary}>
          Gerenciamento de Anexos (Em construção)
        </Typography>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Typography color={theme.palette.text.primary}>
          Anotações (Em construção)
        </Typography>
      </TabPanel>
    </Dialog>
  );
}
