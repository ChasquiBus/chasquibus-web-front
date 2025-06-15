'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { choferesService } from '@/services/choferes';
import { Chofer, CreateChoferDto, UpdateChoferDto } from '@/types/chofer';
import ChoferForm from '@/components/choferes/ChoferForm';
import ChoferesTable from '@/components/choferes/ChoferesTable';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function (
  props, ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ChoferesPage = () => {
  const { auth } = useAuth();
  const user = auth.user;
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedChofer, setSelectedChofer] = useState<Chofer | null>(null);
  const [choferToDeleteId, setChoferToDeleteId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const userCooperativaId = user?.cooperativaTransporte?.id;

  const fetchChoferes = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No hay token de autenticación disponible.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await choferesService.getAllChoferes(userCooperativaId!, token);
      setChoferes(data);
    } catch (err) {
      console.error('Error al obtener choferes:', err);
      setError('Error al cargar los choferes.');
    } finally {
      setLoading(false);
    }
  }, [userCooperativaId]);

  useEffect(() => {
    if (userCooperativaId) {
      fetchChoferes();
    } else if (!user && !auth.isLoading) {
      setLoading(false);
      setError('Usuario no autenticado o ID de cooperativa no disponible.');
    }
  }, [userCooperativaId, fetchChoferes, user, auth.isLoading]);

  const handleCreate = async (values: CreateChoferDto | UpdateChoferDto) => {
    const token = localStorage.getItem('access_token');
    if (!token || !userCooperativaId) {
      setError('Falta el token de autenticación o la ID de la cooperativa.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const choferToCreate = { ...values, cooperativaTransporteId: userCooperativaId } as CreateChoferDto;
      await choferesService.createChofer(choferToCreate, token);
      fetchChoferes();
      setIsFormModalOpen(false);
      setSnackbarMessage('Chofer creado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error('Error al crear chofer:', err);
      setError(err.response?.data?.message || 'Error al crear el chofer.');
      setSnackbarMessage(err.response?.data?.message || 'Error al crear el chofer.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values: CreateChoferDto | UpdateChoferDto) => {
    const token = localStorage.getItem('access_token');
    if (!selectedChofer?.id || !token) {
      setError('No se ha seleccionado ningún chofer para editar o falta el token.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await choferesService.updateChofer(selectedChofer.id, values as UpdateChoferDto, token);
      fetchChoferes();
      setIsFormModalOpen(false);
      setSelectedChofer(null);
      setSnackbarMessage('Chofer actualizado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error('Error al actualizar chofer:', err);
      setError(err.response?.data?.message || 'Error al actualizar el chofer.');
      setSnackbarMessage(err.response?.data?.message || 'Error al actualizar el chofer.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('access_token');
    if (!choferToDeleteId || !token) {
      setError('No se ha seleccionado ningún chofer para eliminar o falta el token.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await choferesService.deleteChofer(choferToDeleteId, token);
      fetchChoferes();
      setIsConfirmModalOpen(false);
      setChoferToDeleteId(null);
      setSnackbarMessage('Chofer eliminado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error('Error al eliminar chofer:', err);
      setError(err.response?.data?.message || 'Error al eliminar el chofer.');
      setSnackbarMessage(err.response?.data?.message || 'Error al eliminar el chofer.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedChofer(null);
    setIsFormModalOpen(true);
    setError(null);
  };

  const openEditModal = (chofer: Chofer) => {
    setSelectedChofer(chofer);
    setIsFormModalOpen(true);
  };

  const openViewModal = (chofer: Chofer) => {
    setSelectedChofer(chofer);
    setIsViewModalOpen(true);
  };

  const openConfirmDeleteModal = (id: number) => {
    setChoferToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsViewModalOpen(false);
    setIsConfirmModalOpen(false);
    setSelectedChofer(null);
    setChoferToDeleteId(null);
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
          Gestión de Choferes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openCreateModal}
        >
          Añadir Chofer
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <ChoferesTable
          choferes={choferes}
          onEdit={openEditModal}
          onView={openViewModal}
          onDelete={openConfirmDeleteModal}
        />
      )}

      {/* Formulario de Creación/Edición */}
      <Dialog open={isFormModalOpen} onClose={handleCloseModals} maxWidth="sm" fullWidth>
        <DialogContent>
          <ChoferForm
            initialData={selectedChofer}
            onSubmit={selectedChofer ? handleEdit : handleCreate}
            onCancel={handleCloseModals}
            cooperativaId={userCooperativaId || 0}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Vista de Detalles */}
      <Dialog open={isViewModalOpen} onClose={handleCloseModals} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles del Chofer</DialogTitle>
        <DialogContent dividers>
          {selectedChofer ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="subtitle1"><strong>Email:</strong></Typography>
                <Typography>{selectedChofer.usuario.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Nombre:</strong></Typography>
                <Typography>{selectedChofer.usuario.nombre} {selectedChofer.usuario.apellido}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Cédula:</strong></Typography>
                <Typography>{selectedChofer.usuario.cedula}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Teléfono:</strong></Typography>
                <Typography>{selectedChofer.usuario.telefono || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Activo:</strong></Typography>
                <Typography>{selectedChofer.usuario.activo ? 'Sí' : 'No'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Número de Licencia:</strong></Typography>
                <Typography>{selectedChofer.numeroLicencia}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Tipo de Licencia:</strong></Typography>
                <Typography>{selectedChofer.tipoLicencia}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Tipo de Sangre:</strong></Typography>
                <Typography>{selectedChofer.tipoSangre || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Fecha de Nacimiento:</strong></Typography>
                <Typography>{selectedChofer.fechaNacimiento ? new Date(selectedChofer.fechaNacimiento).toLocaleDateString() : 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>ID Cooperativa:</strong></Typography>
                <Typography>{selectedChofer.cooperativaTransporteId}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Creado:</strong></Typography>
                <Typography>{new Date(selectedChofer.usuario.createdAt).toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1"><strong>Actualizado:</strong></Typography>
                <Typography>{new Date(selectedChofer.usuario.updatedAt).toLocaleString()}</Typography>
              </Box>
            </Box>
          ) : (
            <Typography>No hay información disponible para este chofer.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={isConfirmModalOpen}
        onClose={handleCloseModals}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            ¿Estás seguro de que quieres eliminar este chofer? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de Notificaciones */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChoferesPage; 