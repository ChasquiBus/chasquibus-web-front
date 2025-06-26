"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { oficinistasService } from '@/services/oficinistas';
import { Oficinista, CreateOficinistaDto, UpdateOficinistaDto } from '@/types/oficinista';
import OficinistasTable from './OficinistasTable';
import OficinistaForm from './OficinistaForm';
import { Container, Typography, Button, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function OficinistasPage() {
  const { auth } = useAuth();
  const user = auth.user;
  const [oficinistas, setOficinistas] = useState<Oficinista[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedOficinista, setSelectedOficinista] = useState<Oficinista | null>(null);
  const [oficinistaToDeleteId, setOficinistaToDeleteId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const userCooperativaId = user?.cooperativaTransporte?.id;

  const fetchOficinistas = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No hay token de autenticación.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data: Oficinista[] = await oficinistasService.getAllOficinistas(token);
      setOficinistas(data as Oficinista[]);
    } catch (err) {
      setError('Error al cargar los oficinistas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userCooperativaId) fetchOficinistas();
  }, [userCooperativaId, fetchOficinistas]);

  const handleCreate = async (values: CreateOficinistaDto) => {
    const token = localStorage.getItem('access_token');
    if (!token || !userCooperativaId) {
      setError('Falta el token de autenticación o la ID de la cooperativa.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await oficinistasService.createOficinista(values, token);
      fetchOficinistas();
      setIsFormModalOpen(false);
      setSnackbarMessage('Oficinista creado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      setError('Error al crear el oficinista.');
      setSnackbarMessage('Error al crear el oficinista.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values: UpdateOficinistaDto) => {
    const token = localStorage.getItem('access_token');
    if (!selectedOficinista?.id || !token) {
      setError('No se ha seleccionado ningún oficinista para editar o falta el token.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await oficinistasService.updateOficinista(selectedOficinista.id, values, token);
      fetchOficinistas();
      setIsFormModalOpen(false);
      setSelectedOficinista(null);
      setSnackbarMessage('Oficinista actualizado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      setError('Error al actualizar el oficinista.');
      setSnackbarMessage('Error al actualizar el oficinista.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('access_token');
    if (!oficinistaToDeleteId || !token) {
      setError('No se ha seleccionado ningún oficinista para eliminar o falta el token.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await oficinistasService.deleteOficinista(oficinistaToDeleteId, token);
      fetchOficinistas();
      setIsConfirmModalOpen(false);
      setOficinistaToDeleteId(null);
      setSnackbarMessage('Oficinista eliminado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      setError('Error al eliminar el oficinista.');
      setSnackbarMessage('Error al eliminar el oficinista.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedOficinista(null);
    setIsFormModalOpen(true);
    setError(null);
  };

  const openEditModal = (oficinista: Oficinista) => {
    setSelectedOficinista(oficinista);
    setIsFormModalOpen(true);
  };

  const openConfirmDeleteModal = (id: number) => {
    setOficinistaToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsConfirmModalOpen(false);
    setSelectedOficinista(null);
    setOficinistaToDeleteId(null);
    setError(null);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Gestión de Oficinistas
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreateModal}>
          Añadir Oficinista
        </Button>
      </Box>
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      {!loading && !error && (
        <OficinistasTable
          oficinistas={oficinistas}
          onEdit={openEditModal}
          onDelete={openConfirmDeleteModal}
        />
      )}
      {/* Formulario de Creación/Edición */}
      <Dialog open={isFormModalOpen} onClose={handleCloseModals} maxWidth="sm" fullWidth>
        <DialogContent>
          <OficinistaForm
            initialData={selectedOficinista}
            onSubmit={async (values) => {
              if (selectedOficinista) {
                await handleEdit(values as UpdateOficinistaDto);
              } else {
                await handleCreate(values as CreateOficinistaDto);
              }
            }}
            onCancel={handleCloseModals}
            cooperativaId={userCooperativaId || 0}
            isEdit={!!selectedOficinista}
          />
        </DialogContent>
      </Dialog>
      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={isConfirmModalOpen} onClose={handleCloseModals}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar este oficinista? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals} color="secondary">Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Eliminar</Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar de Notificaciones */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
} 