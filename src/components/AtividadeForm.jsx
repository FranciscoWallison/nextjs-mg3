"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";

export default function FormAtividade({ open, onClose, onSave }) {
  const [condominios, setCondominios] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    status: "Pendente",
    condominioId: "",
    budgetStatus: "sem orçamento",
    budget: "",
    expectedDate: "",
    frequency: "",
    team: "",
    appliedStandard: "",
    location: "",
    responsibles: "",
    observations: "",
  });

  useEffect(() => {
    // buscar os condomínios do banco
    async function fetchCondominios() {
      const res = await fetch("/api/condominios");
      const data = await res.json();
      setCondominios(data);
    }
    fetchCondominios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await fetch("/api/cronograma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Adicionar Atividade</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {/* Título */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              name="title"
              label="Título"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Manutenção da piscina"
            />
          </Grid>

          {/* Status da atividade */}
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="Próximas">Próximas</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Histórico">Histórico</MenuItem>
            </TextField>
          </Grid>

          {/* Condomínio */}
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              name="condominioId"
              label="Condomínio"
              value={formData.condominioId}
              onChange={handleChange}
            >
              {condominios.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Status do Orçamento */}
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              name="budgetStatus"
              label="Status do Orçamento"
              value={formData.budgetStatus}
              onChange={handleChange}
            >
              <MenuItem value="sem orçamento">Sem orçamento</MenuItem>
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="aprovado">Aprovado</MenuItem>
            </TextField>
          </Grid>

          {/* Valor do orçamento (aparece só se aprovado) */}
          {formData.budgetStatus === "aprovado" && (
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="budget"
                label="Valor do Orçamento (R$)"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Ex: 1500.00"
              />
            </Grid>
          )}

          {/* Data prevista */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="date"
              name="expectedDate"
              label="Data Prevista"
              InputLabelProps={{ shrink: true }}
              value={formData.expectedDate}
              onChange={handleChange}
            />
          </Grid>

          {/* Frequência */}
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              name="frequency"
              label="Frequência"
              value={formData.frequency}
              onChange={handleChange}
            >
              <MenuItem value="Não se repete">Não se repete</MenuItem>
              <MenuItem value="Mensal">Mensal</MenuItem>
              <MenuItem value="Anual">Anual</MenuItem>
            </TextField>
          </Grid>

          {/* Equipe */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              name="team"
              label="Equipe"
              value={formData.team}
              onChange={handleChange}
              placeholder="Ex: Equipe interna, Terceirizada"
            />
          </Grid>

          {/* Norma aplicada */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              name="appliedStandard"
              label="Norma Aplicada"
              value={formData.appliedStandard}
              onChange={handleChange}
              placeholder="Ex: NR-35, ABNT NBR 1604"
            />
          </Grid>

          {/* Local */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              name="location"
              label="Local"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Área comum, Piscina"
            />
          </Grid>

          {/* Responsáveis */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              name="responsibles"
              label="Responsáveis"
              value={formData.responsibles}
              onChange={handleChange}
              placeholder="Ex: João, Maria, José"
            />
          </Grid>

          {/* Observações */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="observations"
              label="Observações"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Ex: Atividade precisa de autorização do síndico..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
