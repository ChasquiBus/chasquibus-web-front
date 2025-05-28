"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Cooperativa, CreateCooperativaDto } from '@/types/cooperatives';
import { cooperativesService } from '@/services/cooperatives';
import CooperativasTable from '@/components/cooperatives/CooperativasTable';
import CooperativaForm from '@/components/cooperatives/CooperativaForm';

export default function AdminCooperativesPage() {
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedCooperativa, setSelectedCooperativa] = useState<CreateCooperativaDto | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadCooperativas = async () => {
    try {
      setLoading(true);
      const data = await cooperativesService.getAll();
      setCooperativas(data);
      setError(null);
    } catch {
      setError('Error al cargar las cooperativas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCooperativas();
  }, []);

  const handleCreate = async (values: CreateCooperativaDto) => {
    try {
      await cooperativesService.create(values);
      setSnackbar({
        open: true,
        message: 'Cooperativa creada exitosamente',
        severity: 'success',
      });
      loadCooperativas();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al crear la cooperativa',
        severity: 'error',
      });
    }
  };

  const handleEdit = async (values: CreateCooperativaDto) => {
    if (editId === null) return;
    try {
      await cooperativesService.update(editId, values);
      setSnackbar({
        open: true,
        message: 'Cooperativa actualizada exitosamente',
        severity: 'success',
      });
      loadCooperativas();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al actualizar la cooperativa',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta cooperativa?')) return;
    try {
      await cooperativesService.delete(id);
      setSnackbar({
        open: true,
        message: 'Cooperativa eliminada exitosamente',
        severity: 'success',
      });
      loadCooperativas();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al eliminar la cooperativa',
        severity: 'error',
      });
    }
  };

  const handleOpenForm = (cooperativa?: Cooperativa) => {
    if (cooperativa) {
      setSelectedCooperativa({
        nombre: cooperativa.nombre,
        ruc: cooperativa.ruc,
        logo: cooperativa.logo,
        colorPrimario: cooperativa.colorPrimario,
        colorSecundario: cooperativa.colorSecundario,
        sitioWeb: cooperativa.sitioWeb,
        email: cooperativa.email,
        telefono: cooperativa.telefono,
        direccion: cooperativa.direccion,
      });
      setEditId(cooperativa.id);
    } else {
      setSelectedCooperativa(null);
      setEditId(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCooperativa(null);
    setEditId(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Gestión de Cooperativas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nueva Cooperativa
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CooperativasTable
          cooperativas={cooperativas}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />
      )}

      <CooperativaForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={selectedCooperativa ? handleEdit : handleCreate}
        initialValues={selectedCooperativa || undefined}
        title={selectedCooperativa ? 'Editar Cooperativa' : 'Nueva Cooperativa'}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 