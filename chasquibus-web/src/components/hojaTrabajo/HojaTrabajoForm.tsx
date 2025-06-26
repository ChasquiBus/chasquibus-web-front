import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import MuiAlert from '@mui/material/Alert';
import { HojaTrabajo, EstadoHojaTrabajo } from '@/services/hojaTrabajo';

interface HojaTrabajoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  buses: { id: number; placa: string }[];
  choferes: { id: number; nombre: string }[];
  frecuencias: { id: number; horaSalidaProg: string; horaLlegadaProg: string; rutaId: number }[];
  estados: EstadoHojaTrabajo[];
  initialData?: Partial<HojaTrabajo>;
  loading?: boolean;
  error?: string;
}

const HojaTrabajoForm: React.FC<HojaTrabajoFormProps> = ({ open, onClose, onSubmit, buses, choferes, frecuencias, estados, initialData, loading, error }) => {
  const [form, setForm] = useState<any>({ busId: '', choferId: '', frecDiaId: '', estado: 'programado', observaciones: '', fechaSalida: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        busId: initialData.busId || '',
        choferId: initialData.choferId || '',
        frecDiaId: initialData.frecDiaId || '',
        estado: initialData.estado || 'programado',
        observaciones: initialData.observaciones || '',
        fechaSalida: initialData.fechaSalida || '',
      });
    } else {
      setForm({ busId: '', choferId: '', frecDiaId: '', estado: 'programado', observaciones: '', fechaSalida: '' });
    }
    setFormError('');
  }, [initialData, open]);

  const validate = () => {
    if (!form.busId || !form.choferId || !form.frecDiaId || !form.estado) {
      setFormError('Todos los campos obligatorios deben estar completos.');
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      busId: Number(form.busId),
      choferId: Number(form.choferId),
      frecDiaId: Number(form.frecDiaId),
      fechaSalida: form.fechaSalida,
      observaciones: form.observaciones
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Hoja de Trabajo' : 'Nueva Hoja de Trabajo'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
        <TextField select label="Bus" name="busId" value={String(form.busId)} onChange={handleChange} fullWidth>
          <MenuItem value="">Selecciona un bus</MenuItem>
          {buses.map((bus) => (
            <MenuItem key={bus.id} value={String(bus.id)}>{bus.placa || 'SIN PLACA'}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Chofer" name="choferId" value={form.choferId} onChange={handleChange} fullWidth>
          {choferes.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Frecuencia" name="frecDiaId" value={form.frecDiaId} onChange={handleChange} fullWidth>
          {frecuencias.map((f) => (
            <MenuItem key={f.id} value={f.id}>{`[${f.horaSalidaProg} - ${f.horaLlegadaProg}] Ruta ${f.rutaId}`}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Estado" name="estado" value={form.estado} onChange={handleChange} fullWidth>
          {estados.map((e) => (
            <MenuItem key={e} value={e}>{e}</MenuItem>
          ))}
        </TextField>
        <TextField label="Fecha de Salida" name="fechaSalida" type="date" value={form.fechaSalida} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        <TextField label="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} fullWidth multiline minRows={2} />
        {(error || formError) && <MuiAlert severity="error">{error || formError}</MuiAlert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HojaTrabajoForm; 