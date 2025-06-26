"use client";
import React, { useEffect, useState } from 'react';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FrequenciesTable from '@/components/frequencies/FrequenciesTable';
import FrequencyForm from '@/components/frequencies/FrequencyForm';
import { getRutas } from '@/services/rutas';
import {
  getFrequenciesByCooperativa,
  createFrequency,
  updateFrequency,
  deleteFrequency,
  Frequency
} from '@/services/frequencies';
import { getParadas } from '@/services/paradas';

export default function FrequenciesPage() {
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);
  const [rutas, setRutas] = useState<{ id: number; nombre: string }[]>([]);
  const [paradas, setParadas] = useState<{ id: number; nombreParada: string }[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Frequency | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Cargar rutas y frecuencias
  const loadData = async () => {
    try {
      setLoading(true);
      const [rutasData, freqData, paradasData] = await Promise.all([
        getRutas(),
        getFrequenciesByCooperativa(),
        getParadas(),
      ]);
      setParadas(paradasData);
      // Mapear rutas para que tengan id y nombre legible con nombre de paradas
      const rutasMapped = rutasData.map((r) => {
        const origen = paradasData.find((p) => p.id === r.paradaOrigenId)?.nombreParada || r.paradaOrigenId;
        const destino = paradasData.find((p) => p.id === r.paradaDestinoId)?.nombreParada || r.paradaDestinoId;
        return {
          id: r.id,
          nombre: `Ruta ${r.id}: ${origen} → ${destino}`,
        };
      });
      setRutas(rutasMapped);
      setFrequencies(freqData);
    } catch (e) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Abrir formulario para crear
  const handleOpenForm = () => {
    setEditing(null);
    setOpenForm(true);
  };

  // Abrir formulario para editar
  const handleEdit = (row: Frequency) => {
    setEditing(row);
    setOpenForm(true);
  };

  // Guardar frecuencia (crear o editar)
  const handleSubmit = async (data: { rutaId: string; horaSalidaProg: string; horaLlegadaProg: string }) => {
    setLoading(true);
    try {
      if (editing) {
        await updateFrequency(editing.id, {
          horaSalidaProg: data.horaSalidaProg,
          horaLlegadaProg: data.horaLlegadaProg,
        });
        setSuccess('Frecuencia actualizada correctamente');
      } else {
        await createFrequency({
          rutaId: Number(data.rutaId),
          horaSalidaProg: data.horaSalidaProg,
          horaLlegadaProg: data.horaLlegadaProg,
        });
        setSuccess('Frecuencia creada correctamente');
      }
      setOpenForm(false);
      loadData();
    } catch (e) {
      setError('Error al guardar la frecuencia');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar frecuencia
  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteFrequency(deleteId);
      setSuccess('Frecuencia eliminada correctamente');
      loadData();
    } catch {
      setError('Error al eliminar la frecuencia');
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mt={2} mb={2}>
        <ScheduleIcon color="primary" fontSize="large" />
        <Typography variant="h4" component="h1">
          Gestión de Frecuencias
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenForm} sx={{ ml: 'auto' }}>
          Nueva Frecuencia
        </Button>
      </Box>
      <FrequenciesTable
        frequencies={frequencies}
        rutas={rutas}
        onEdit={handleEdit}
        onDelete={setDeleteId}
      />
      <FrequencyForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        rutas={rutas}
        initialData={editing || undefined}
        loading={loading}
      />
      {/* Confirmación de borrado */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Eliminar frecuencia?</DialogTitle>
        <DialogContent>Esta acción no se puede deshacer.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete} disabled={loading}>Eliminar</Button>
        </DialogActions>
      </Dialog>
      {/* Mensajes de éxito y error */}
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
        <MuiAlert severity="success" onClose={() => setSuccess('')}>
          {success}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <MuiAlert severity="error" onClose={() => setError('')}>
          {error}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
} 