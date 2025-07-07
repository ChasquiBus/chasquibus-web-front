"use client";
import React, { useEffect, useState } from 'react';
import TarifasTable from '@/components/tarifas/TarifasTable';
import TarifaForm from '@/components/tarifas/TarifaForm';
import { getTarifasParadas, createTarifaParada, updateTarifaParada, deleteTarifaParada, TarifaParada, CreateTarifaParadaDto, UpdateTarifaParadaDto } from '@/services/tarifasParadas';
import { getRutas, Ruta } from '@/services/rutas';
import { getParadas, Parada } from '@/services/paradas';
import { Button, Box, Snackbar, Alert, Typography, MenuItem, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function TarifasPage() {
  const [tarifas, setTarifas] = useState<TarifaParada[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarifa, setEditTarifa] = useState<TarifaParada | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  // Filtros
  const [filtroRuta, setFiltroRuta] = useState('');
  const [filtroOrigen, setFiltroOrigen] = useState('');
  const [filtroDestino, setFiltroDestino] = useState('');
  const [filtroTipoAsiento, setFiltroTipoAsiento] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [tarifasRes, rutasRes, paradasRes] = await Promise.all([
        getTarifasParadas(),
        getRutas(),
        getParadas(),
      ]);
      setTarifas(tarifasRes);
      setRutas(rutasRes);
      setParadas(paradasRes);
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al cargar datos', severity: 'error' });
    }
    setLoading(false);
  };

  const handleAgregar = () => {
    setEditTarifa(null);
    setModalOpen(true);
  };

  const handleEditar = (tarifa: TarifaParada) => {
    setEditTarifa(tarifa);
    setModalOpen(true);
  };

  const handleEliminar = (id: number) => {
    setConfirmDialog({ open: true, id });
  };

  const confirmarEliminar = async () => {
    if (!confirmDialog.id) return;
    setLoading(true);
    try {
      await deleteTarifaParada(confirmDialog.id);
      setSnackbar({ open: true, message: 'Tarifa eliminada correctamente', severity: 'success' });
      cargarDatos();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al eliminar tarifa', severity: 'error' });
    }
    setLoading(false);
    setConfirmDialog({ open: false, id: null });
  };

  const handleGuardar = async (data: CreateTarifaParadaDto | UpdateTarifaParadaDto) => {
    setLoading(true);
    try {
      if (editTarifa) {
        await updateTarifaParada(editTarifa.id, data as UpdateTarifaParadaDto);
        setSnackbar({ open: true, message: 'Tarifa actualizada correctamente', severity: 'success' });
      } else {
        await createTarifaParada(data as CreateTarifaParadaDto);
        setSnackbar({ open: true, message: 'Tarifa creada correctamente', severity: 'success' });
      }
      setModalOpen(false);
      cargarDatos();
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.response?.data?.message || 'Error al guardar tarifa', severity: 'error' });
    }
    setLoading(false);
  };

  // Filtrado de tarifas
  const tarifasFiltradas = tarifas.filter(t =>
    (!filtroRuta || t.rutaId === Number(filtroRuta)) &&
    (!filtroOrigen || t.paradaOrigenId === Number(filtroOrigen)) &&
    (!filtroDestino || t.paradaDestinoId === Number(filtroDestino)) &&
    (!filtroTipoAsiento || (t.tipoAsiento || '').toUpperCase() === filtroTipoAsiento.toUpperCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" mb={2} sx={{ fontWeight: 700, color: '#222' }}>Gestión de Tarifas</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
        <TextField
          select
          label="Ruta"
          value={filtroRuta}
          onChange={e => setFiltroRuta(e.target.value)}
          size="small"
          sx={{ minWidth: 180, background: '#fff' }}
        >
          <MenuItem value="">Todas</MenuItem>
          {rutas.map(r => {
            const origen = paradas.find(p => p.id === r.paradaOrigenId)?.nombreParada || '';
            const destino = paradas.find(p => p.id === r.paradaDestinoId)?.nombreParada || '';
            return (
              <MenuItem key={r.id} value={r.id}>{`Ruta ${r.id} (${origen} - ${destino})`}</MenuItem>
            );
          })}
        </TextField>
        <TextField
          select
          label="Parada Origen"
          value={filtroOrigen}
          onChange={e => setFiltroOrigen(e.target.value)}
          size="small"
          sx={{ minWidth: 180, background: '#fff' }}
        >
          <MenuItem value="">Todas</MenuItem>
          {paradas.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Parada Destino"
          value={filtroDestino}
          onChange={e => setFiltroDestino(e.target.value)}
          size="small"
          sx={{ minWidth: 180, background: '#fff' }}
        >
          <MenuItem value="">Todas</MenuItem>
          {paradas.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Tipo de Asiento"
          value={filtroTipoAsiento}
          onChange={e => setFiltroTipoAsiento(e.target.value)}
          size="small"
          sx={{ minWidth: 180, background: '#fff' }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="NORMAL">Normal</MenuItem>
          <MenuItem value="VIP">VIP</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAgregar}
          sx={{ height: 40, fontWeight: 700, boxShadow: 2, ml: 2 }}
        >
          Agregar Tarifa
        </Button>
      </Box>
      <TarifasTable tarifas={tarifasFiltradas} paradas={paradas} onEdit={handleEditar} onDelete={handleEliminar} />
      <TarifaForm
        open={modalOpen}
        rutas={rutas.map(r => {
          const origen = paradas.find(p => p.id === r.paradaOrigenId)?.nombreParada || '';
          const destino = paradas.find(p => p.id === r.paradaDestinoId)?.nombreParada || '';
          return {
            id: r.id,
            nombre: `${origen} → ${destino}`
          };
        })}
        paradas={paradas}
        initialValues={editTarifa || undefined}
        onSave={handleGuardar}
        onClose={() => setModalOpen(false)}
        isEdit={!!editTarifa}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Seguro que deseas eliminar esta tarifa?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: null })} color="inherit">Cancelar</Button>
          <Button onClick={confirmarEliminar} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 