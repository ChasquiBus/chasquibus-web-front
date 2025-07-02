import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box, Typography } from "@mui/material";
import { TarifaParada } from '@/services/tarifasParadas';
import { Descuento } from '@/services/descuentos';

interface ModalPasajeroProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  value: any;
  tarifas: TarifaParada[];
  descuentos: Descuento[];
  asientoNumero: number;
}

const ModalPasajero: React.FC<ModalPasajeroProps> = ({ open, onClose, onSave, value, tarifas, descuentos, asientoNumero }) => {
  const [form, setForm] = React.useState<any>(value || {});

  React.useEffect(() => {
    setForm(value || {});
  }, [value]);

  // Calcular tarifa y descuento
  const tarifa = tarifas.find(t => t.id === form.tarifaId);
  const valorTarifa = tarifa ? Number(tarifa.valor) : 0;
  const descuento = descuentos.find(d => d.id === form.descuentoId);
  const porcentajeDesc = descuento ? Number(descuento.porcentaje) : 0;
  const totalSinDesc = valorTarifa;
  const totalDesc = porcentajeDesc ? (valorTarifa * porcentajeDesc) : 0;
  const totalFinal = valorTarifa - totalDesc;

  const handleSave = () => {
    onSave({
      ...form,
      asientoNumero,
      totalSinDescPorPers: totalSinDesc.toFixed(2),
      totalDescPorPers: totalDesc.toFixed(2),
      totalPorPer: totalFinal.toFixed(2),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ mb: 3 }}>Datos del pasajero (Asiento {asientoNumero})</DialogTitle>
      <DialogContent sx={{ p: 6 }}>
        <TextField
          label="Nombre"
          value={form.nombre || ''}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          fullWidth sx={{ mt: 3, mb: 2 }}
        />
        <TextField
          label="Apellido"
          value={form.apellido || ''}
          onChange={e => setForm({ ...form, apellido: e.target.value })}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          label="Cédula"
          value={form.cedula || ''}
          onChange={e => setForm({ ...form, cedula: e.target.value })}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Tarifa"
          value={form.tarifaId || ''}
          onChange={e => setForm({ ...form, tarifaId: e.target.value })}
          fullWidth sx={{ mb: 2 }}
        >
          {tarifas.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.tipoAsiento || 'General'} - ${t.valor}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Descuento"
          value={form.descuentoId || ''}
          onChange={e => setForm({ ...form, descuentoId: e.target.value })}
          fullWidth sx={{ mb: 2 }}
        >
          <MenuItem value="">Sin descuento</MenuItem>
          {descuentos.map(d => (
            <MenuItem key={d.id} value={d.id}>{d.tipoDescuento} - {(Number(d.porcentaje) * 100).toFixed(0)}%</MenuItem>
          ))}
        </TextField>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">Total sin descuento: ${totalSinDesc.toFixed(2)}</Typography>
          <Typography variant="body2">Descuento: -${totalDesc.toFixed(2)}</Typography>
          <Typography variant="subtitle2">Total a pagar: ${totalFinal.toFixed(2)}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!(form.nombre && form.apellido && form.cedula && form.tarifaId)}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalPasajero; 