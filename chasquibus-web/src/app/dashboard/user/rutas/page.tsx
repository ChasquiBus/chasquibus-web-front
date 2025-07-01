"use client";
import React, { useEffect, useState } from 'react';
import { getRutas, createRuta, updateRuta, deleteRuta, Ruta, DiaOperacion } from '@/services/rutas';
import { getParadas, Parada } from '@/services/paradas';
import { getRutaParadasByRutaId, createRutaParada, updateRutaParada, deleteRutaParada, RutaParada } from '@/services/rutaParada';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Checkbox, ListItemText, Select, FormControl, InputLabel, FormGroup, FormControlLabel, Switch, Snackbar, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DIAS_SEMANA = [
  { diaId: 1, nombre: 'Lunes' },
  { diaId: 2, nombre: 'Martes' },
  { diaId: 3, nombre: 'Miércoles' },
  { diaId: 4, nombre: 'Jueves' },
  { diaId: 5, nombre: 'Viernes' },
  { diaId: 6, nombre: 'Sábado' },
  { diaId: 7, nombre: 'Domingo' },
];
const TODOS_IDS = DIAS_SEMANA.map(d => d.diaId);

export default function RutasPage() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRuta, setEditRuta] = useState<Ruta | null>(null);
  const [form, setForm] = useState<any>({
    paradaOrigenId: '',
    paradaDestinoId: '',
    prioridad: '',
    fechaIniVigencia: '',
    fechaFinVigencia: '',
    estado: true,
    diasOperacion: [],
    file: null,
    esDirecto: false,
  });
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState<{open: boolean, msg: string, type: 'success'|'error'}>({open: false, msg: '', type: 'success'});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number|null>(null);
  const [detalleRuta, setDetalleRuta] = useState<Ruta | null>(null);
  const [paradasIntermedias, setParadasIntermedias] = useState<RutaParada[]>([]);
  const [modalParadasOpen, setModalParadasOpen] = useState(false);
  const [formRutaParada, setFormRutaParada] = useState<any>({ paradaId: '', orden: '', distanciaDesdeOrigenKm: '', tiempoDesdeOrigenMin: '' });
  const [savingParada, setSavingParada] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [rutasData, paradasData] = await Promise.all([getRutas(), getParadas()]);
      setRutas(rutasData);
      setParadas(paradasData);
    } catch {
      setSnackbar({open: true, msg: 'Error al cargar datos', type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleOpenModal = (ruta?: Ruta) => {
    if (ruta) {
      setEditRuta(ruta);
      setForm({
        paradaOrigenId: ruta.paradaOrigenId,
        paradaDestinoId: ruta.paradaDestinoId,
        prioridad: ruta.prioridad || '',
        fechaIniVigencia: ruta.fechaIniVigencia || '',
        fechaFinVigencia: ruta.fechaFinVigencia || '',
        estado: ruta.estado ?? true,
        diasOperacion: ruta.diasOperacion || [],
        file: null,
        esDirecto: ruta.esDirecto ?? false,
      });
      setDiasSeleccionados(ruta.diasOperacion.map(d => d.diaId));
    } else {
      setEditRuta(null);
      setForm({ paradaOrigenId: '', paradaDestinoId: '', prioridad: '', fechaIniVigencia: '', fechaFinVigencia: '', estado: true, diasOperacion: [], file: null, esDirecto: false });
      setDiasSeleccionados([]);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditRuta(null);
    setForm({ paradaOrigenId: '', paradaDestinoId: '', prioridad: '', fechaIniVigencia: '', fechaFinVigencia: '', estado: true, diasOperacion: [], file: null, esDirecto: false });
    setDiasSeleccionados([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prev: any) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setForm((prev: any) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleDiasChange = (event: any) => {
    const value = event.target.value;
    if (value.includes('todos')) {
      setDiasSeleccionados(TODOS_IDS);
    } else {
      setDiasSeleccionados(typeof value === 'string' ? value.split(',') : value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const diasOperacion: DiaOperacion[] = DIAS_SEMANA.map(dia => ({ diaId: dia.diaId, tipo: 'operacion' }));
      const payload = {
        ...form,
        paradaOrigenId: Number(form.paradaOrigenId),
        paradaDestinoId: Number(form.paradaDestinoId),
        prioridad: form.prioridad ? Number(form.prioridad) : undefined,
        estado: !!form.estado,
        diasOperacion,
        file: form.file,
      };
      if (editRuta) {
        await updateRuta(editRuta.id, payload);
        setSnackbar({open: true, msg: 'Ruta actualizada correctamente', type: 'success'});
      } else {
        await createRuta(payload);
        setSnackbar({open: true, msg: 'Ruta creada correctamente', type: 'success'});
      }
      handleCloseModal();
      cargarDatos();
    } catch {
      setSnackbar({open: true, msg: 'Error al guardar ruta', type: 'error'});
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRuta(id);
      setSnackbar({open: true, msg: 'Ruta eliminada', type: 'success'});
      cargarDatos();
    } catch {
      setSnackbar({open: true, msg: 'Error al eliminar ruta', type: 'error'});
    }
  };

  const abrirGestionParadas = async (ruta: Ruta) => {
    setDetalleRuta(ruta);
    setModalParadasOpen(true);
    try {
      const todas = await getRutaParadasByRutaId(ruta.id);
      setParadasIntermedias(todas.sort((a, b) => a.orden - b.orden));
    } catch {
      setParadasIntermedias([]);
    }
  };

  const cerrarGestionParadas = () => {
    setModalParadasOpen(false);
    setDetalleRuta(null);
    setParadasIntermedias([]);
  };

  const handleFormRutaParadaChange = (e: any) => {
    const { name, value } = e.target;
    setFormRutaParada((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleGuardarRutaParada = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingParada(true);
    try {
      const payload = {
        rutaId: detalleRuta?.id!,
        paradaId: Number(formRutaParada.paradaId),
        orden: Number(formRutaParada.orden),
        distanciaDesdeOrigenKm: formRutaParada.distanciaDesdeOrigenKm ? Number(formRutaParada.distanciaDesdeOrigenKm) : undefined,
        tiempoDesdeOrigenMin: formRutaParada.tiempoDesdeOrigenMin ? Number(formRutaParada.tiempoDesdeOrigenMin) : undefined,
      };
      await createRutaParada(payload);
      setSnackbar({open: true, msg: 'Parada intermedia agregada', type: 'success'});
      // Recargar paradas intermedias
      const todas = await getRutaParadasByRutaId(detalleRuta?.id!);
      setParadasIntermedias(todas.sort((a, b) => a.orden - b.orden));
      setFormRutaParada({ paradaId: '', orden: '', distanciaDesdeOrigenKm: '', tiempoDesdeOrigenMin: '' });
    } catch {
      setSnackbar({open: true, msg: 'Error al guardar parada intermedia', type: 'error'});
    } finally {
      setSavingParada(false);
    }
  };

  const handleEliminarRutaParada = async (id: number) => {
    try {
      await deleteRutaParada(id);
      setSnackbar({open: true, msg: 'Parada intermedia eliminada', type: 'success'});
      const todas = await getRutaParadasByRutaId(detalleRuta?.id!);
      setParadasIntermedias(todas.sort((a, b) => a.orden - b.orden));
    } catch {
      setSnackbar({open: true, msg: 'Error al eliminar parada intermedia', type: 'error'});
    }
  };

  // Calcular la fecha mínima permitida (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 ,color:'black'}}>Gestión de Rutas</Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal()} sx={{ mb: 3 }}>
        Crear nueva ruta
      </Button>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Origen</b></TableCell>
                <TableCell><b>Destino</b></TableCell>
                <TableCell><b>Prioridad</b></TableCell>
                <TableCell><b>Estado</b></TableCell>
                <TableCell><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rutas.map((ruta) => (
                <TableRow key={ruta.id}>
                  <TableCell>{ruta.id}</TableCell>
                  <TableCell>{paradas.find(p => p.id === ruta.paradaOrigenId)?.nombreParada || ruta.paradaOrigenId}</TableCell>
                  <TableCell>{paradas.find(p => p.id === ruta.paradaDestinoId)?.nombreParada || ruta.paradaDestinoId}</TableCell>
                  <TableCell>{ruta.prioridad ?? '-'}</TableCell>
                  <TableCell>{ruta.estado ? 'Activa' : 'Inactiva'}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenModal(ruta)}><EditIcon /></IconButton>
                    <Button variant="outlined" color="primary" size="small" onClick={() => abrirGestionParadas(ruta)} sx={{ ml: 1 }} disabled={ruta.esDirecto}>
                      Gestionar paradas
                    </Button>
                    <IconButton color="error" onClick={() => setDeleteId(ruta.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Modal de formulario */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editRuta ? 'Editar Ruta' : 'Crear Ruta'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Parada Origen</InputLabel>
              <Select
                name="paradaOrigenId"
                value={form.paradaOrigenId}
                onChange={handleChange}
                label="Parada Origen"
              >
                {paradas.filter(p => p.esTerminal).map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Parada Destino</InputLabel>
              <Select
                name="paradaDestinoId"
                value={form.paradaDestinoId}
                onChange={handleChange}
                label="Parada Destino"
              >
                {paradas.filter(p => p.esTerminal).map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Días de Operación</InputLabel>
              <Select
                multiple
                value={diasSeleccionados}
                onChange={handleDiasChange}
                renderValue={(selected) => {
                  if (selected.length === TODOS_IDS.length) return 'Todos';
                  return DIAS_SEMANA.filter(d => selected.includes(d.diaId)).map(d => d.nombre).join(', ');
                }}
              >
                <MenuItem value="todos">
                  <Checkbox checked={diasSeleccionados.length === TODOS_IDS.length} />
                  <ListItemText primary="Todos" />
                </MenuItem>
                {DIAS_SEMANA.map((dia) => (
                  <MenuItem key={dia.diaId} value={dia.diaId}>
                    <Checkbox checked={diasSeleccionados.indexOf(dia.diaId) > -1} />
                    <ListItemText primary={dia.nombre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="prioridad-label" shrink={true}>Prioridades</InputLabel>
              <Select
                labelId="prioridad-label"
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
                label="Prioridades"
                displayEmpty
                renderValue={selected => selected ? selected : 'Selecciona prioridad'}
                inputProps={{
                  'aria-label': 'Selecciona prioridad',
                }}
              >
                <MenuItem value="" disabled>
                  Selecciona prioridad
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Fecha Inicio Vigencia"
              name="fechaIniVigencia"
              type="date"
              value={form.fechaIniVigencia}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              inputProps={{ min: getMinDate() }}
            />
            <TextField
              label="Fecha Fin Vigencia"
              name="fechaFinVigencia"
              type="date"
              value={form.fechaFinVigencia}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              inputProps={{ min: getMinDate() }}
            />
            <FormControlLabel
              control={<Switch checked={form.estado} onChange={e => setForm((prev: any) => ({ ...prev, estado: e.target.checked }))} />}
              label="¿Activa?"
            />
            <FormControlLabel
              control={<Switch checked={form.esDirecto} onChange={e => setForm((prev: any) => ({ ...prev, esDirecto: e.target.checked }))} />}
              label="¿Es ruta directa?"
            />
            {form.esDirecto && (
              <Box sx={{ color: 'orange', fontWeight: 500, mb: 1 }}>
                Esta ruta es directa, no se podrán gestionar paradas intermedias.
              </Box>
            )}
            <Button variant="contained" component="label">
              {form.file ? form.file.name : 'Subir PDF de Resolución'}
              <input type="file" accept="application/pdf" hidden onChange={handleChange} name="file" />
            </Button>
            <DialogActions>
              <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>{editRuta ? 'Actualizar' : 'Guardar'}</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Confirmación de eliminación */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Eliminar ruta?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="secondary">Cancelar</Button>
          <Button onClick={() => { if(deleteId) { handleDelete(deleteId); setDeleteId(null); } }} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
      {/* Modal de gestión de paradas intermedias */}
      <Dialog open={modalParadasOpen} onClose={cerrarGestionParadas} maxWidth="md" fullWidth>
        <DialogTitle>Gestionar Paradas de la Ruta</DialogTitle>
        <DialogContent>
          {detalleRuta && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1"><b>Origen:</b> {paradas.find(p => p.id === detalleRuta.paradaOrigenId)?.nombreParada}</Typography>
              <Typography variant="subtitle1"><b>Destino:</b> {paradas.find(p => p.id === detalleRuta.paradaDestinoId)?.nombreParada}</Typography>
            </Box>
          )}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Orden</b></TableCell>
                  <TableCell><b>Parada</b></TableCell>
                  <TableCell><b>Distancia (km)</b></TableCell>
                  <TableCell><b>Tiempo (min)</b></TableCell>
                  <TableCell><b>Acciones</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paradasIntermedias.map((rp) => (
                  <TableRow key={rp.id}>
                    <TableCell>{rp.orden}</TableCell>
                    <TableCell>{paradas.find(p => p.id === rp.paradaId)?.nombreParada || rp.paradaId}</TableCell>
                    <TableCell>{rp.distanciaDesdeOrigenKm ?? '-'}</TableCell>
                    <TableCell>{rp.tiempoDesdeOrigenMin ?? '-'}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleEliminarRutaParada(rp.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Formulario para agregar parada intermedia */}
          <Box component="form" onSubmit={handleGuardarRutaParada} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }} required>
              <InputLabel>Parada</InputLabel>
              <Select
                name="paradaId"
                value={formRutaParada.paradaId}
                onChange={handleFormRutaParadaChange}
                label="Parada"
              >
                {paradas
                  .filter(p => p.id !== detalleRuta?.paradaOrigenId && p.id !== detalleRuta?.paradaDestinoId)
                  .map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Orden"
              name="orden"
              type="number"
              value={formRutaParada.orden}
              onChange={handleFormRutaParadaChange}
              required
              sx={{ minWidth: 100 }}
            />
            <TextField
              label="Distancia desde origen (km)"
              name="distanciaDesdeOrigenKm"
              type="number"
              value={formRutaParada.distanciaDesdeOrigenKm}
              onChange={handleFormRutaParadaChange}
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="Tiempo desde origen (min)"
              name="tiempoDesdeOrigenMin"
              type="number"
              value={formRutaParada.tiempoDesdeOrigenMin}
              onChange={handleFormRutaParadaChange}
              sx={{ minWidth: 180 }}
            />
            <DialogActions>
              <Button type="submit" variant="contained" color="primary" disabled={savingParada}>Agregar</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({...s, open: false}))} anchorOrigin={{vertical:'top',horizontal:'center'}}>
        <Alert severity={snackbar.type} sx={{ width: '100%' }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
} 