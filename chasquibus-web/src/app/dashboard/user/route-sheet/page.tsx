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
import { getHojasTrabajoCooperativa, createHojaTrabajoManual, createHojaTrabajoAuto, updateHojaTrabajo, deleteHojaTrabajo, EstadoHojaTrabajo, HojaTrabajoDetallada } from '@/services/hojaTrabajo';
import { busesService } from '@/services/buses';
import { choferesService } from '@/services/choferes';
import { getFrequenciesByCooperativa } from '@/services/frequencies';
import { getRutas } from '@/services/rutas';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const estados: EstadoHojaTrabajo[] = ['programado', 'en curso', 'completado', 'suspendido', 'cancelado'];

export default function RouteSheetPage() {
  const [hojas, setHojas] = useState<HojaTrabajoDetallada[]>([]);
  const [buses, setBuses] = useState<{ id: number; placa: string }[]>([]);
  const [choferes, setChoferes] = useState<{ id: number; nombre: string }[]>([]);
  const [frecuencias, setFrecuencias] = useState<any[]>([]);
  const [rutas, setRutas] = useState<{ id: number; nombre: string }[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<HojaTrabajoDetallada | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroFecha, setFiltroFecha] = useState<string>('');
  const [filtroRuta, setFiltroRuta] = useState<string>('');
  const [openAuto, setOpenAuto] = useState(false);
  const [autoForm, setAutoForm] = useState({ numDias: 1, fechaInicial: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
      const cooperativaId = 1;
      const [hojasData, busesData, choferesData, frecData, rutasData] = await Promise.all([
        getHojasTrabajoCooperativa(),
        busesService.getAll(),
        choferesService.getAllChoferes(cooperativaId, token),
        getFrequenciesByCooperativa(),
        getRutas(),
      ]);
      let hojasFiltradas = Array.isArray(hojasData) ? hojasData : [];
      if (filtroEstado) hojasFiltradas = hojasFiltradas.filter(h => h.estado === filtroEstado);
      if (filtroFecha) hojasFiltradas = hojasFiltradas.filter(h => h.horaSalidaProg && h.horaSalidaProg.startsWith(filtroFecha));
      if (filtroRuta) hojasFiltradas = hojasFiltradas.filter(h => String(h.rutaId) === filtroRuta);
      setHojas(hojasFiltradas);
      setBuses(busesData.filter((b: any) => b.activo).map((b: any) => ({ id: b.id, placa: b.placa })));
      setChoferes(choferesData.map((c: any) => ({ id: c.id, nombre: c.usuario ? `${c.usuario.nombre} ${c.usuario.apellido || ''}`.trim() : c.id })));
      setFrecuencias(frecData);
      const rutasMapped = rutasData.map((r: any) => ({
        id: r.id,
        nombre: `Ruta ${r.id}: ${r.paradaOrigenId} → ${r.paradaDestinoId}`,
      }));
      setRutas(rutasMapped);
    } catch (e: any) {
      let msg = 'Error al cargar datos';
      if (e?.response?.data?.message) msg = e.response.data.message;
      setError(msg);
      setHojas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [filtroEstado, filtroFecha, filtroRuta]);

  const handleOpenForm = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (row: HojaTrabajoDetallada) => {
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
        await createHojaTrabajoManual(data);
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
      <Box display="flex" alignItems="center" gap={1.5} mt={2} mb={2}>
        <Typography variant="h4" component="h1">
          Hojas de Trabajo
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button variant="contained" color="primary" size="small" onClick={handleOpenForm}>
            Crear manualmente
          </Button>
          <Button variant="outlined" color="secondary" size="small" onClick={() => setOpenAuto(true)}>
            Crear automáticamente
          </Button>
        </Box>
        <TextField
          select
          label="Filtrar por estado"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          sx={{ minWidth: 130, ml: 2 }}
          size="small"
        >
          <MenuItem value="">Todos</MenuItem>
          {estados.map(e => (
            <MenuItem key={e} value={e}>{e}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Filtrar por fecha"
          type="date"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
          sx={{ minWidth: 130 }}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          select
          label="Filtrar por ruta"
          value={filtroRuta}
          onChange={e => setFiltroRuta(e.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          <MenuItem value="">Todas</MenuItem>
          {rutas.map(r => (
            <MenuItem key={r.id} value={String(r.id)}>{r.nombre}</MenuItem>
          ))}
        </TextField>
      </Box>
      <HojaTrabajoTable
        hojas={hojas}
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
      {/* Modal para creación automática */}
      <Dialog open={openAuto} onClose={() => setOpenAuto(false)}>
        <DialogTitle>Crear hojas de trabajo automáticamente</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
          <TextField
            label="Número de días"
            type="number"
            value={autoForm.numDias}
            onChange={e => setAutoForm({ ...autoForm, numDias: Number(e.target.value) })}
            fullWidth
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Fecha inicial"
            type="date"
            value={autoForm.fechaInicial}
            onChange={e => setAutoForm({ ...autoForm, fechaInicial: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAuto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              setLoading(true);
              try {
                await createHojaTrabajoAuto(autoForm);
                setSuccess('Hojas de trabajo creadas automáticamente');
                setOpenAuto(false);
                loadData();
              } catch (e: any) {
                let msg = 'Error al crear hojas automáticamente';
                if (e?.response?.data?.message) msg = e.response.data.message;
                setError(msg);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !autoForm.numDias || !autoForm.fechaInicial}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

