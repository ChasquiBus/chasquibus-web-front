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
import { Bus, CreateBusDto } from '@/types/bus';
import { busesService } from '@/services/buses';
import BusForm from '@/components/buses/BusForm';
import BusesTable from '@/components/buses/BusesTable';

export default function UserBusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Datos de ejemplo para cooperativas y choferes
  const cooperativas = [
    { id: 1, nombre: 'Cooperativa 1' },
    { id: 2, nombre: 'Cooperativa 2' },
  ];

  const choferes = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'María', apellido: 'González' },
  ];

  const loadBuses = async () => {
    try {
      setLoading(true);
      const data = await busesService.getAll();
      setBuses(data);
      setError(null);
    } catch {
      setError('Error al cargar los buses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleCreate = async (values: CreateBusDto) => {
    try {
      await busesService.create(values);
      setSnackbar({
        open: true,
        message: 'Bus creado exitosamente',
        severity: 'success',
      });
      loadBuses();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al crear el bus',
        severity: 'error',
      });
    }
  };

  const handleEdit = async (values: CreateBusDto) => {
    if (!selectedBus) return;
    try {
      await busesService.update(selectedBus.id, values);
      setSnackbar({
        open: true,
        message: 'Bus actualizado exitosamente',
        severity: 'success',
      });
      loadBuses();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al actualizar el bus',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este bus?')) return;
    try {
      await busesService.delete(id);
      setSnackbar({
        open: true,
        message: 'Bus eliminado exitosamente',
        severity: 'success',
      });
      loadBuses();
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al eliminar el bus',
        severity: 'error',
      });
    }
  };

  const handleOpenForm = (bus?: Bus) => {
    if (bus) {
      setSelectedBus(bus);
    } else {
      setSelectedBus(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedBus(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Gestión de Buses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Bus
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
        <BusesTable
          buses={buses}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />
      )}

      <BusForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={selectedBus ? handleEdit : handleCreate}
        initialValues={selectedBus || undefined}
        title={selectedBus ? 'Editar Bus' : 'Nuevo Bus'}
        cooperativas={cooperativas}
        choferes={choferes}
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