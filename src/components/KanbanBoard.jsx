// src/components/KanbanBoard.jsx
"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Divider,
  useTheme,       // Importe useTheme
  useMediaQuery   // Importe useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Share as ShareIcon,
  InfoOutlined as InfoIcon,
  LowPriority as LowPriorityIcon,
} from '@mui/icons-material';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { styled } from '@mui/material/styles'; 
// --- Estilos para o Kanban Board ---

const KanbanContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

// Removendo 'marginRight' fixo para permitir flexibilidade
const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '20px',
  // marginRight: theme.spacing(1), // Removido para controle em flexbox
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
}));

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  // Em telas pequenas (xs, sm), mostra apenas 1 coluna por vez, com rolagem
  // Em telas médias (md), pode mostrar 2 ou mais
  // Em telas grandes (lg e xl), mantém a regra original de minmax(280px, 1fr)
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr', // Uma coluna por vez em telas muito pequenas
    overflowX: 'hidden', // Remove a rolagem horizontal, empilha as colunas
  },
  [theme.breakpoints.between('sm', 'md')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Permite 2 colunas se houver espaço, mas ainda rolável
    overflowX: 'auto', // Rolagem para telas sm-md se não couberem
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Layout original em desktop
    overflowX: 'hidden', // Normalmente não precisa de rolagem horizontal aqui
  },
  gap: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const Column = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  // Adiciona margem inferior para colunas quando empilhadas
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

const ColumnHeaderStatusSpan = styled('span')(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: color || theme.palette.text.primary,
  fontWeight: 'bold',
  fontSize: '1rem',
}));

const ColumnHeaderStatusCircle = styled('div')(({ theme, color }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: color || theme.palette.grey[500],
  marginRight: theme.spacing(1),
}));

// --- Estilos e Componente para os Cards do Kanban ---

const CardContainer = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  border: '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
  // Ajusta padding em telas menores para melhor uso do espaço
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

const IdTag = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$isClickable',
})(({ theme, $isClickable }) => ({
  fontSize: '0.75rem',
  color: $isClickable ? theme.palette.text.secondary : theme.palette.text.primary,
  cursor: $isClickable ? 'pointer' : 'default',
  '&:hover': {
    textDecoration: $isClickable ? 'underline' : 'none',
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
  color: theme.palette.text.primary,
  flexGrow: 1,
  // Reduz o tamanho da fonte do título do card em telas pequenas
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  },
}));

const CardMiddleElement = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
  // Permite que o conteúdo quebre em várias linhas se não houver espaço
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
}));

const CardLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

const CardContent = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

const CardStatusWrapper = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
}));

const CardStatusSpan = styled('span')(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  color: color || theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 'bold',
}));

const CardStatusCircle = styled('div')(({ theme, color }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: color || theme.palette.grey[500],
  marginRight: theme.spacing(0.5),
}));


// Componente Card para o Kanban
const KanbanActivityCard = ({ activity }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Breakpoint específico para cards

  const getStatusColor = (status) => {
    switch (status) {
      case 'Próximas': return '#787878';
      case 'Em andamento': return '#2d96ff';
      case 'Pendente': return '#FF5959';
      case 'Histórico': return '#87E76A';
      case 'A fazer': return '#787878';
      default: return '#787878';
    }
  };

  return (
    <CardContainer elevation={1}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <IdTag>#{activity.id}</IdTag>
        <Box>
          <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
        </Box>
      </Box>

      <CardTitle>{activity.title}</CardTitle>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <CardMiddleElement>
          <LowPriorityIcon sx={{ marginRight: '8px', fontSize: '16px' }} />
          <CardLabel>Condomínio:</CardLabel>
          <CardContent>{activity.condominium}</CardContent>
        </CardMiddleElement>
        <CardMiddleElement>
          <CardLabel>Orçamento:</CardLabel>
          <CardContent>{activity.budgetStatus}</CardContent>
        </CardMiddleElement>
        <CardMiddleElement>
          <CardLabel>Data Prevista:</CardLabel>
          <CardContent>{activity.expectedDate}</CardContent>
        </CardMiddleElement>
      </Box>

      <Box sx={{
          display: 'flex',
          // Empilha botões e status em telas pequenas
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isSmallScreen ? 'flex-start' : 'center',
          mt: 2,
          gap: isSmallScreen ? 1 : 0, // Espaçamento quando empilhado
      }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<InfoIcon />}
          sx={{
            color: '#545454',
            borderColor: '#545454',
            // Ocupa largura total em telas pequenas
            width: isSmallScreen ? '100%' : 'auto',
          }}
        >
          Ver mais
        </Button>
        <CardStatusWrapper sx={{ mt: isSmallScreen ? 1 : 0, width: isSmallScreen ? '100%' : 'auto', justifyContent: isSmallScreen ? 'flex-start' : 'flex-end' }}>
            <CardStatusSpan color={getStatusColor(activity.status)}>
                <CardStatusCircle color={getStatusColor(activity.status)} />
                <Typography variant="body2">{activity.status}</Typography>
            </CardStatusSpan>
        </CardStatusWrapper>
      </Box>

      <Box sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
          justifyContent: 'flex-end',
          // Empilha botões de ação em telas pequenas
          flexDirection: isSmallScreen ? 'column' : 'row',
          width: isSmallScreen ? '100%' : 'auto',
      }}>
        {activity.status === 'Próximas' && (
          <Button variant="contained" size="small" sx={{
              backgroundColor: '#E6EAED',
              color: '#545454',
              width: isSmallScreen ? '100%' : 'auto', // Ocupa largura total
          }}>
            Iniciar atividade
          </Button>
        )}
        {activity.status === 'Em andamento' && (
          <Button variant="contained" size="small" sx={{
              backgroundColor: '#E6EAED',
              color: '#545454',
              width: isSmallScreen ? '100%' : 'auto', // Ocupa largura total
          }}>
            Concluir atividade
          </Button>
        )}
      </Box>
    </CardContainer>
  );
};


// --- Componente Principal KanbanBoard ---
const KanbanBoard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Para a seção de filtros

  const [activities, setActivities] = useState([
    {
      id: '6283dc8d-229e-4a91-8678-afc9372e705f',
      title: 'Manutenção Preventiva Bloco C',
      status: 'Próximas',
      condominium: 'Condomínio XYZ',
      budgetStatus: 'sem orçamento',
      expectedDate: '12/07/2025',
    },
    {
      id: '409c2be3-ef67-42b3-8dd7-6691e5c9f229',
      title: 'Inspeção de Segurança Predial',
      status: 'Próximas',
      condominium: 'Condomínio ABC',
      budgetStatus: 'aprovado',
      expectedDate: '15/07/2025',
    },
    {
      id: 'task-003',
      title: 'Reparo de Portão Eletrônico',
      status: 'Em andamento',
      condominium: 'Condomínio Boa Vista',
      budgetStatus: 'aprovado',
      expectedDate: '18/07/2025',
    },
    {
      id: 'task-004',
      title: 'Limpeza de Cisternas',
      status: 'Pendente',
      condominium: 'Condomínio Sol Nascente',
      budgetStatus: 'pendente',
      expectedDate: '25/07/2025',
    },
    {
      id: 'task-005',
      title: 'Revisão do Sistema de Incêndio',
      status: 'Histórico',
      condominium: 'Condomínio Alto Padrão',
      budgetStatus: 'aprovado',
      expectedDate: '01/06/2025',
    },
  ]);

  const getActivitiesByStatus = (status) => {
    return activities.filter(activity => activity.status === status);
  };

  const getColumnColor = (status) => {
    switch (status) {
      case 'Próximas': return '#787878';
      case 'Em andamento': return '#2d96ff';
      case 'Pendente': return '#FF5959';
      case 'Histórico': return '#87E76A';
      default: return '#787878';
    }
  };

  const kanbanColumns = [
    { id: 'next', title: 'Próximas', color: '#787878' },
    { id: 'ongoing', title: 'Em andamento', color: '#2d96ff' },
    { id: 'pending', title: 'Pendente', color: '#FF5959' },
    { id: 'history', title: 'Histórico', color: '#87E76A' },
  ];

  return (
    <KanbanContainer>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Obs: Após recarregar a página, os cards serão mostrados novamente em ordem cronológica
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          mb: 3,
          justifyContent: 'space-between',
          alignItems: 'center',
          // Empilha o chip e o botão de filtros em telas pequenas
          flexDirection: isSmallScreen ? 'column' : 'row',
          alignItems: isSmallScreen ? 'flex-start' : 'center',
          gap: isSmallScreen ? 2 : 0, // Aumenta o gap em coluna
        }}
      >
        {/* Chip de Data */}
        <StyledChip
          label="12/04/2025 - 12/10/2025"
          clickable // Certifique-se que esta prop está sendo tratada via shouldForwardProp se StyledChip for customizado
          sx={{
            // Ocupa a largura total e centraliza o texto em telas pequenas
            width: isSmallScreen ? '100%' : 'auto',
            textAlign: isSmallScreen ? 'center' : 'left',
            mr: isSmallScreen ? 0 : 1, // Remove margin-right quando em coluna
          }}
        />

        {/* Botão de Filtros */}
        <Button
          variant="text"
          sx={{
            color: '#EA6037',
            width: isSmallScreen ? '100%' : 'auto', // Ocupa a largura total em telas pequenas
            justifyContent: isSmallScreen ? 'center' : 'flex-start', // Centraliza o ícone e texto
          }}
          startIcon={<HomeRepairServiceIcon sx={{ width: 20, height: 20 }} />}
        >
          Filtros
        </Button>
      </Box>

      <GridContainer>
        {kanbanColumns.map(column => (
          <Column key={column.id}>
            <ColumnHeaderStatusSpan color={getColumnColor(column.title)}>
              <ColumnHeaderStatusCircle color={getColumnColor(column.title)} />
              <Typography>{column.title}</Typography>
            </ColumnHeaderStatusSpan>
            {getActivitiesByStatus(column.title).length > 0 ? (
              getActivitiesByStatus(column.title).map((activity) => (
                <KanbanActivityCard key={activity.id} activity={activity} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                Não há atividades para mostrar
              </Typography>
            )}
          </Column>
        ))}
      </GridContainer>
    </KanbanContainer>
  );
};

export default KanbanBoard;