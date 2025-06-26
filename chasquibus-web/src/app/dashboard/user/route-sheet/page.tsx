"use client";
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import HojaTrabajoTable from '@/components/hojaTrabajo/HojaTrabajoTable';
import HojaTrabajoForm from '@/components/hojaTrabajo/HojaTrabajoForm';
import { getHojasTrabajoViajes, createHojaTrabajo, updateHojaTrabajo, deleteHojaTrabajo, EstadoHojaTrabajo, HojaTrabajo } from '@/services/hojaTrabajo';
import { busesService } from '@/services/buses';
import { choferesService } from '@/services/choferes';
import { getFrequenciesByCooperativa } from '@/services/frequencies';
import { getRutas } from '@/services/rutas';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const estados: EstadoHojaTrabajo[] = ['programado', 'en curso', 'completado', 'suspendido', 'cancelado'];

export default function RouteSheetPage() {
  const [hojas, setHojas] = useState<HojaTrabajo[]>([]);
  const [buses, setBuses] = useState<{ id: number; placa: string }[]>([]);
  const [choferes, setChoferes] = useState<{ id: number; nombre: string }[]>([]);
  const [frecuencias, setFrecuencias] = useState<any[]>([]);
  const [rutas, setRutas] = useState<{ id: number; nombre: string }[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<HojaTrabajo | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
      // Asume que cooperativaId está disponible, si no, ajustar según contexto
      const cooperativaId = 1;
      const [hojasData, busesData, choferesData, frecData, rutasData] = await Promise.all([
        getHojasTrabajoViajes(filtroEstado as EstadoHojaTrabajo),
        busesService.getAll(),
        choferesService.getAllChoferes(cooperativaId, token),
        getFrequenciesByCooperativa(),
        getRutas(),
      ]);
      setHojas(hojasData);
      // DEBUG: Verificar datos de buses
      if (typeof window !== 'undefined') {
        // Solo loguear en cliente
        console.log('BUSES', busesData);
      }
      setBuses(busesData.map((b: any) => ({ id: b.id, placa: b.placa })));
      setChoferes(choferesData.map((c: any) => ({ id: c.id, nombre: c.usuario ? `${c.usuario.nombre} ${c.usuario.apellido || ''}`.trim() : c.id })));
      setFrecuencias(frecData);
      // Mapear rutas con nombre legible
      const rutasMapped = rutasData.map((r: any) => ({
        id: r.id,
        nombre: `Ruta ${r.id}: ${r.paradaOrigenId} → ${r.paradaDestinoId}`,
      }));
      setRutas(rutasMapped);
    } catch (e: any) {
      let msg = 'Error al cargar datos';
      if (e?.response?.data?.message) msg = e.response.data.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [filtroEstado]);

  const handleOpenForm = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (row: HojaTrabajo) => {
    setEditing(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (editing) {
        await updateHojaTrabajo(editing.id, data);
        setSuccess('Hoja de trabajo actualizada correctamente');
      } else {
        await createHojaTrabajo(data);
        setSuccess('Hoja de trabajo creada correctamente');
      }
      setOpenForm(false);
      loadData();
    } catch (e: any) {
      let msg = 'Error al guardar la hoja de trabajo';
      if (e?.response?.data?.message) msg = e.response.data.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteHojaTrabajo(deleteId);
      setSuccess('Hoja de trabajo eliminada correctamente');
      loadData();
    } catch (e: any) {
      let msg = 'Error al eliminar la hoja de trabajo';
      if (e?.response?.data?.message) msg = e.response.data.message;
      setError(msg);
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mt={2} mb={2}>
        <Typography variant="h4" component="h1">
          Hojas de Trabajo
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenForm} sx={{ ml: 'auto' }}>
          Nueva Hoja de Trabajo
        </Button>
        <TextField
          select
          label="Filtrar por estado"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          sx={{ minWidth: 180, ml: 2 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {estados.map(e => (
            <MenuItem key={e} value={e}>{e}</MenuItem>
          ))}
        </TextField>
      </Box>
      <HojaTrabajoTable
        hojas={hojas}
        buses={buses}
        choferes={choferes}
        rutas={rutas}
        frecuencias={frecuencias}
        onEdit={handleEdit}
        onDelete={setDeleteId}
        onView={() => {}}
      />
      <HojaTrabajoForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        buses={buses}
        choferes={choferes}
        frecuencias={frecuencias}
        estados={estados}
        initialData={editing || undefined}
        loading={loading}
      />
      {/* Confirmación de borrado */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Eliminar hoja de trabajo?</DialogTitle>
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

