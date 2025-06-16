"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ResolucionesTable, { Resolucion } from '@/components/resoluciones/ResolucionesTable';
import ResolucionesForm from '@/components/resoluciones/ResolucionesForm';
import EditarResolucionModal from '@/components/resoluciones/EditarResolucionModal';
import ConfirmDialog from '@/components/resoluciones/ConfirmDialog';
import {
  getResoluciones,
  createResolucion,
  updateResolucion,
  deleteResolucion,
} from '@/services/resoluciones';
import { Typography, Box, Alert } from '@mui/material';

const ResolucionPage: React.FC = () => {
  const { auth } = useAuth();
  const cooperativaId = auth.user?.cooperativaTransporte?.id;

  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resolucionAEditar, setResolucionAEditar] = useState<Resolucion | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resolucionAEliminar, setResolucionAEliminar] = useState<Resolucion | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success');

  const mostrarMensaje = (msg: string, tipo: 'success' | 'error') => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(null), 3000);
  };

  const cargarResoluciones = async () => {
    if (!cooperativaId) return;
    setLoading(true);
    try {
      const data = await getResoluciones(cooperativaId);
      setResoluciones(data);
    } catch (e) {
      mostrarMensaje('Error al cargar resoluciones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResoluciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooperativaId]);

  const handleAgregarResolucion = async (formData: FormData) => {
    try {
      await createResolucion(formData);
      mostrarMensaje('Resolución creada exitosamente', 'success');
      cargarResoluciones();
    } catch (e) {
      mostrarMensaje('Error al crear resolución', 'error');
    }
  };

  const handleEditar = (resolucion: Resolucion) => {
    setResolucionAEditar(resolucion);
    setEditModalOpen(true);
  };

  const handleGuardarEdicion = async (formData: FormData) => {
    if (!resolucionAEditar) return;
    try {
      await updateResolucion(resolucionAEditar.id, formData);
      mostrarMensaje('Resolución actualizada correctamente', 'success');
      setEditModalOpen(false);
      setResolucionAEditar(null);
      cargarResoluciones();
    } catch (e) {
      mostrarMensaje('Error al actualizar resolución', 'error');
    }
  };

  const handleEliminar = (resolucion: Resolucion) => {
    setResolucionAEliminar(resolucion);
    setConfirmOpen(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!resolucionAEliminar) return;
    try {
      await deleteResolucion(resolucionAEliminar.id);
      mostrarMensaje('Resolución eliminada correctamente', 'success');
      setConfirmOpen(false);
      setResolucionAEliminar(null);
      cargarResoluciones();
    } catch (e) {
      mostrarMensaje('Error al eliminar resolución', 'error');
    }
  };

  if (!cooperativaId) {
    return <div style={{ padding: 32, color: 'red' }}>No tienes una cooperativa asignada.</div>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      {mensaje && (
        <Alert severity={tipoMensaje} sx={{ mb: 2 }}>{mensaje}</Alert>
      )}
      <Typography variant="h5" sx={{ color: '#111', fontWeight: 700, mb: 1 }}>
        Gestión de Resoluciones
      </Typography>
      <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, mb: 2 }}>
        Agregar Resolución
      </Typography>
      <ResolucionesForm onSubmit={handleAgregarResolucion} cooperativaId={cooperativaId} />
      {loading ? (
        <div>Cargando resoluciones...</div>
      ) : (
        <ResolucionesTable resoluciones={resoluciones} onEdit={handleEditar} onDelete={handleEliminar} />
      )}
      <EditarResolucionModal
        open={editModalOpen}
        resolucion={resolucionAEditar}
        onSave={handleGuardarEdicion}
        onClose={() => setEditModalOpen(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        message={
          resolucionAEliminar
            ? `¿Estás seguro de que deseas eliminar la resolución "${resolucionAEliminar.nombre}"?`
            : ''
        }
        onConfirm={handleConfirmarEliminar}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default ResolucionPage; 