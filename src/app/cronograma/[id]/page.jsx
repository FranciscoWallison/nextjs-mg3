"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Stack,
  Chip,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CondominoUIProvider, useCondominoUI } from "@/contexts/CondominoUIContext";
import { useAuth } from "@/contexts/AuthContext";
import ListaAtividades from "@/components/ListaAtividades";
import KanbanBoard from "@/components/KanbanBoard";
import CalendarView from "@/components/CalendarView";
import AddAtividadeDialog from "@/components/AddAtividadeDialog";
import { CondominiosProvider, useCondominios } from "@/contexts/CondominiosContext";
import { AtividadesProvider, useAtividades } from "@/contexts/AtividadesContext";

// Normaliza qualquer formato vindo do backend para boolean
const normalizeStatus = (s) => ["EM_ANDAMENTO", "IN_PROGRESS", 1, true].includes(s);

// >>> Ajuste conforme seu backend espera receber o status <<<
const BACKEND_STATUS_MODE = "boolean"; // ou "enum"
const encodeStatus = (bool) =>
  BACKEND_STATUS_MODE === "enum" ? (bool ? "EM_ANDAMENTO" : "PENDENTE") : !!bool;

// Componente do cabeçalho/resumo do condomínio
function HeaderResumo() {
  const theme = useTheme(); // para cores dinâmicas dark/light
  const { selected } = useCondominoUI();
  const { stats, loading, items = [] } = useAtividades();

  // fallback seguro baseado nos itens carregados
  const safe = useMemo(() => {
    const total = items.length;
    const emAndamento = items.filter((a) => normalizeStatus(a?.status)).length;
    const pendentes = total - emAndamento;
    return { total, emAndamento, pendentes };
  }, [items]);

  const total = Number.isFinite(stats?.total) ? stats.total : safe.total;
  const funcionando = Number.isFinite(stats?.emAndamento) ? stats.emAndamento : safe.emAndamento;
  const pendentes = Number.isFinite(stats?.pendentes) ? stats.pendentes : safe.pendentes;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      {/* Avatar + nome do condomínio */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={selected?.logoUrl || undefined}
          alt={selected?.name || ""}
          sx={{ bgcolor: theme.palette.action.selected }}
        />
        <Typography variant="h6" fontWeight={700} color={theme.palette.text.primary}>
          {selected?.name || "Condomínio"}
        </Typography>
      </Stack>

      {/* Chips de estatísticas */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          label={`Total: ${total}`}
          sx={{
            bgcolor: theme.palette.mode === "dark" ? theme.palette.background.paper : undefined,
            color: theme.palette.text.primary,
          }}
        />
        {!!funcionando && (
          <Chip
            color="success"
            label={`Funcionando: ${funcionando}`}
            sx={{ color: theme.palette.text.primary }}
          />
        )}
        <Chip
          color="warning"
          label={`Pendentes: ${pendentes}`}
          sx={{ color: theme.palette.text.primary }}
        />
        {loading && <CircularProgress size={18} />}
      </Stack>
    </Stack>
  );
}

// Componente principal do cronograma
function CronogramaInner() {
  const theme = useTheme(); // para cores dinâmicas dark/light
  const { selected, setSelected } = useCondominoUI();
  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const params = useParams();

  // Pega o ID do condomínio da rota
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;

  // Estados locais
  const [currentTab, setCurrentTab] = useState(0);
  const [loadingCondominio, setLoadingCondominio] = useState(true);
  const [addAtividadeOpen, setAddAtividadeOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // <- item sendo editado

  const { items: condominios } = useCondominios();
  const { load, createAtividade, updateAtividade, items } = useAtividades();

  // Função para trocar abas
  const handleTabChange = (_e, newValue) => setCurrentTab(newValue);

  // Abrir diálogo para criar nova atividade
  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setAddAtividadeOpen(true);
  }, []);

  // Abrir diálogo para editar atividade existente
  const handleOpenEdit = useCallback((item) => {
    setEditingItem(item || null);
    setAddAtividadeOpen(true);
  }, []);

  // Salvar (criar/editar) atividade
  const handleSaveDialog = useCallback(
    async (payload, { mode }) => {
      // Clona e normaliza/encode status se vier no payload
      const dto = { ...payload };
      if ("status" in dto) dto.status = encodeStatus(normalizeStatus(dto.status));

      const result =
        mode === "edit" && dto?.id
          ? await updateAtividade(dto.id, dto)
          : await createAtividade(dto, id);

      // Recarrega lista após salvar
      await load({ condominioId: id, reset: true });
      return result;
    },
    [updateAtividade, createAtividade, id, load]
  );

  // Fechar diálogo
  const handleCloseDialog = useCallback(() => setAddAtividadeOpen(false), []);

  // Carrega dados do condomínio e define selected
  useEffect(() => {
    if (!id) return;
    setSelected((prev) => prev ?? { id, name: "Carregando...", logoUrl: null });

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetchWithAuth(`/api/condominios/${id}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) {
          router.replace("/selecione-o-condominio");
          return;
        }

        const list = await res.json();
        const item = Array.isArray(list) ? list[0] : null;
        if (!item) {
          router.replace("/selecione-o-condominio");
          return;
        }

        setSelected({ id: item.id, name: item.name, logoUrl: item.imageUrl ?? null });
      } catch (err) {
        if (err?.name !== "AbortError") router.replace("/selecione-o-condominio");
      } finally {
        setLoadingCondominio(false);
      }
    })();
    return () => controller.abort();
  }, [id, fetchWithAuth, router, setSelected]);

  // Carrega atividades ao trocar o condomínio
  useEffect(() => {
    if (!id) return;
    load({ condominioId: id, reset: true });
  }, [id, load]);

  if (!id || loadingCondominio) return null;

  return (
    <>
      <HeaderResumo />

      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

      {/* Abas */}
      <Box sx={{ borderBottom: 1, borderColor: theme.palette.divider, mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} textColor="inherit" indicatorColor="primary">
          <Tab label="LISTA" />
          <Tab label="CALENDÁRIO" />
          <Tab label="KANBAN" />
        </Tabs>
      </Box>

      {/* Botões superiores */}
      <Stack direction="row" justifyContent="flex-end" spacing={2} mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Adicionar Atividade
        </Button>
        <Button variant="outlined">Filtros</Button>
      </Stack>

      {/* Conteúdo das abas */}
      <Box>
        {currentTab === 0 && <ListaAtividades onEdit={handleOpenEdit} />}
        {currentTab === 1 && <CalendarView onEdit={handleOpenEdit} />}
        {currentTab === 2 && <KanbanBoard onEdit={handleOpenEdit} />}
      </Box>

      {/* Diálogo de adicionar/editar atividade */}
      <AddAtividadeDialog
        open={addAtividadeOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveDialog}
        condominios={condominios}
        selectedCondominio={selected}
        mode={editingItem ? "edit" : "create"}
        initialData={editingItem}
      />
    </>
  );
}

// Página principal
export default function CronogramaPage() {
  return (
    <CondominoUIProvider>
      <Layout>
        <CondominiosProvider>
          <AtividadesProvider>
            <CronogramaInner />
          </AtividadesProvider>
        </CondominiosProvider>
      </Layout>
    </CondominoUIProvider>
  );
}
