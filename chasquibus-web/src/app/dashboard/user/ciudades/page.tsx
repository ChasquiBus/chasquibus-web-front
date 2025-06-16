"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import CiudadesTable, { Ciudad } from '@/components/ciudades/CiudadesTable';
import CiudadesForm from '@/components/ciudades/CiudadesForm';
import EditarCiudadModal from '@/components/ciudades/EditarCiudadModal';
import ConfirmDialog from '@/components/ciudades/ConfirmDialog';
import {
  getCiudades,
  createCiudad,
  updateCiudad,
  deleteCiudad,
} from '@/services/ciudades';
import { Typography, Box, Alert } from '@mui/material';

const CiudadesPage: React.FC = () => {
  const { auth } = useAuth();
  const cooperativaId = auth.user?.cooperativaTransporte?.id;

  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ciudadAEditar, setCiudadAEditar] = useState<Ciudad | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ciudadAEliminar, setCiudadAEliminar] = useState<Ciudad | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success');

  const mostrarMensaje = (msg: string, tipo: 'success' | 'error') => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(null), 3000);
  };

  const cargarCiudades = async () => {
    if (!cooperativaId) return;
    setLoading(true);
    try {
      const data = await getCiudades();
      // Filtrar por cooperativaId por si el backend no lo hace
      setCiudades(data.filter((c) => c.cooperativaId === cooperativaId));
    } catch (e) {
      mostrarMensaje('Error al cargar ciudades', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCiudades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooperativaId]);

  const handleAgregarCiudad = async (data: { provincia: string; ciudad: string; cooperativaId: number }) => {
    try {
      await createCiudad(data);
      mostrarMensaje('Ciudad creada exitosamente', 'success');
      cargarCiudades();
    } catch (e) {
      mostrarMensaje('Error al crear ciudad', 'error');
    }
  };

  const handleEditar = (ciudad: Ciudad) => {
    setCiudadAEditar(ciudad);
    setEditModalOpen(true);
  };

  const handleGuardarEdicion = async (data: Partial<Ciudad>) => {
    if (!data.id) return;
    try {
      await updateCiudad(data.id, {
        provincia: data.provincia,
        ciudad: data.ciudad,
      });
      mostrarMensaje('Ciudad actualizada correctamente', 'success');
      setEditModalOpen(false);
      setCiudadAEditar(null);
      cargarCiudades();
    } catch (e) {
      mostrarMensaje('Error al actualizar ciudad', 'error');
    }
  };

  const handleEliminar = (ciudad: Ciudad) => {
    setCiudadAEliminar(ciudad);
    setConfirmOpen(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!ciudadAEliminar) return;
    try {
      await deleteCiudad(ciudadAEliminar.id);
      mostrarMensaje('Ciudad eliminada correctamente', 'success');
      setConfirmOpen(false);
      setCiudadAEliminar(null);
      cargarCiudades();
    } catch (e) {
      mostrarMensaje('Error al eliminar ciudad', 'error');
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
        Gestión de Ciudades
      </Typography>
      <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, mb: 2 }}>
        Agregar Ciudad
      </Typography>
      <CiudadesForm onSubmit={handleAgregarCiudad} cooperativaId={cooperativaId} />
      {loading ? (
        <div>Cargando ciudades...</div>
      ) : (
        <CiudadesTable ciudades={ciudades} onEdit={handleEditar} onDelete={handleEliminar} />
      )}
      <EditarCiudadModal
        open={editModalOpen}
        ciudad={ciudadAEditar}
        onSave={handleGuardarEdicion}
        onClose={() => setEditModalOpen(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        message={
          ciudadAEliminar
            ? `¿Estás seguro de que deseas eliminar la ciudad "${ciudadAEliminar.ciudad}"?`
            : ''
        }
        onConfirm={handleConfirmarEliminar}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default CiudadesPage; 