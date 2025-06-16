"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ParadasTable, { Parada } from '@/components/paradas/ParadasTable';
import ParadasForm, { CiudadOption } from '@/components/paradas/ParadasForm';
import EditarParadaModal from '@/components/paradas/EditarParadaModal';
import ConfirmDialog from '@/components/paradas/ConfirmDialog';
import {
  getParadas,
  createParada,
  updateParada,
  deleteParada,
} from '@/services/paradas';
import { getCiudades } from '@/services/ciudades';
import { Typography, Box, Alert } from '@mui/material';

const ParadasPage: React.FC = () => {
  const { auth } = useAuth();
  const cooperativaId = auth.user?.cooperativaTransporte?.id;

  const [paradas, setParadas] = useState<Parada[]>([]);
  const [ciudades, setCiudades] = useState<CiudadOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [paradaAEditar, setParadaAEditar] = useState<Parada | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paradaAEliminar, setParadaAEliminar] = useState<Parada | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success');

  const mostrarMensaje = (msg: string, tipo: 'success' | 'error') => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(null), 3000);
  };

  const cargarParadas = async () => {
    if (!cooperativaId) return;
    setLoading(true);
    try {
      const data = await getParadas();
      setParadas(data.filter((p) => p.cooperativaId === cooperativaId));
    } catch (e) {
      mostrarMensaje('Error al cargar paradas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cargarCiudades = async () => {
    if (!cooperativaId) return;
    try {
      const data = await getCiudades();
      setCiudades(data.filter((c: any) => c.cooperativaId === cooperativaId));
    } catch (e) {
      setCiudades([]);
    }
  };

  useEffect(() => {
    cargarParadas();
    cargarCiudades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooperativaId]);

  const handleAgregarParada = async (data: { ciudadId: number; nombreParada: string; direccion: string; esTerminal: boolean; cooperativaId: number }) => {
    try {
      await createParada(data);
      mostrarMensaje('Parada creada exitosamente', 'success');
      cargarParadas();
    } catch (e) {
      mostrarMensaje('Error al crear parada', 'error');
    }
  };

  const handleEditar = (parada: Parada) => {
    setParadaAEditar(parada);
    setEditModalOpen(true);
  };

  const handleGuardarEdicion = async (data: Partial<Parada>) => {
    if (!data.id) return;
    try {
      await updateParada(data.id, {
        ciudadId: data.ciudadId,
        nombreParada: data.nombreParada,
        direccion: data.direccion,
        esTerminal: data.esTerminal,
      });
      mostrarMensaje('Parada actualizada correctamente', 'success');
      setEditModalOpen(false);
      setParadaAEditar(null);
      cargarParadas();
    } catch (e) {
      mostrarMensaje('Error al actualizar parada', 'error');
    }
  };

  const handleEliminar = (parada: Parada) => {
    setParadaAEliminar(parada);
    setConfirmOpen(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!paradaAEliminar) return;
    try {
      await deleteParada(paradaAEliminar.id);
      mostrarMensaje('Parada eliminada correctamente', 'success');
      setConfirmOpen(false);
      setParadaAEliminar(null);
      cargarParadas();
    } catch (e) {
      mostrarMensaje('Error al eliminar parada', 'error');
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
        Gestión de Paradas
      </Typography>
      <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, mb: 2 }}>
        Agregar Parada
      </Typography>
      <ParadasForm onSubmit={handleAgregarParada} cooperativaId={cooperativaId} ciudades={ciudades} />
      {loading ? (
        <div>Cargando paradas...</div>
      ) : (
        <ParadasTable paradas={paradas} onEdit={handleEditar} onDelete={handleEliminar} />
      )}
      <EditarParadaModal
        open={editModalOpen}
        parada={paradaAEditar}
        onSave={handleGuardarEdicion}
        onClose={() => setEditModalOpen(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        message={
          paradaAEliminar
            ? `¿Estás seguro de que deseas eliminar la parada "${paradaAEliminar.nombreParada}"?`
            : ''
        }
        onConfirm={handleConfirmarEliminar}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default ParadasPage; 