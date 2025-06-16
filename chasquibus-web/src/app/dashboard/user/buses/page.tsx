"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Bus, CreateBusDto, UpdateBusDto } from '@/types/bus';
import { busesService } from '@/services/buses';
import BusForm from '@/components/buses/BusForm';
import BusesTable from '@/components/buses/BusesTable';
import { useAuth } from '@/hooks/useAuth';

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

  const { auth } = useAuth();
  const userCooperativaId = auth.user?.cooperativaTransporte?.id;

  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await busesService.getAll();
      setBuses(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los buses');
      setSnackbar({
        open: true,
        message: 'Error al cargar los buses',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [setBuses, setLoading, setError]);

  useEffect(() => {
    if (userCooperativaId) {
      fetchBuses();
    } else {
      setError('No se pudo obtener la información de la cooperativa del usuario.');
      setLoading(false);
    }
  }, [userCooperativaId, fetchBuses]);

  const handleCreate = async (values: CreateBusDto, imagen?: File) => {
    if (!userCooperativaId) {
      setSnackbar({
        open: true,
        message: 'Error: No se pudo obtener la cooperativa del usuario.',
        severity: 'error',
      });
      return;
    }
    try {
      await busesService.create({ ...values, cooperativa_id: userCooperativaId }, imagen);
      setSnackbar({
        open: true,
        message: 'Bus creado exitosamente',
        severity: 'success',
      });
      fetchBuses();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al crear el bus',
        severity: 'error',
      });
    }
  };

  const handleEdit = async (values: CreateBusDto, imagen?: File) => {
    if (!selectedBus) return;
    if (!userCooperativaId) {
      setSnackbar({
        open: true,
        message: 'Error: No se pudo obtener la cooperativa del usuario.',
        severity: 'error',
      });
      return;
    }
    try {
      await busesService.update(selectedBus.id, { ...values, cooperativa_id: userCooperativaId }, imagen);
      setSnackbar({
        open: true,
        message: 'Bus actualizado exitosamente',
        severity: 'success',
      });
      fetchBuses();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar el bus',
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

  // Lógica para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [busToDeleteId, setBusToDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setBusToDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (busToDeleteId !== null) {
      try {
        await busesService.delete(busToDeleteId);
        setSnackbar({ open: true, message: 'Bus eliminado correctamente', severity: 'success' });
        fetchBuses();
      } catch (err: any) {
        console.error('Error al eliminar el bus:', err);
        setSnackbar({ open: true, message: err.message || 'Error al eliminar el bus.', severity: 'error' });
      } finally {
        setOpenDeleteDialog(false);
        setBusToDeleteId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setBusToDeleteId(null);
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
          onDelete={handleDeleteClick}
        />
      )}

      {userCooperativaId && (
        <BusForm
          open={openForm}
          onClose={handleCloseForm}
          onSubmit={selectedBus ? handleEdit : handleCreate}
          initialValues={selectedBus || undefined}
          title={selectedBus ? 'Editar Bus' : 'Crear Nuevo Bus'}
          cooperativaId={userCooperativaId}
        />
      )}

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            ¿Está seguro de que desea eliminar este bus?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({...s, open: false}))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
} 