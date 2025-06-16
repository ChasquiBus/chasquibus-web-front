import React, { useState, useEffect } from 'react';
import { Resolucion } from './ResolucionesTable';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';

interface EditarResolucionModalProps {
  open: boolean;
  resolucion: Resolucion | null;
  onSave: (data: FormData) => void;
  onClose: () => void;
}

const EditarResolucionModal: React.FC<EditarResolucionModalProps> = ({ open, resolucion, onSave, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEmision, setFechaEmision] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [estado, setEstado] = useState(true);
  const [enUso, setEnUso] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resolucion) {
      setNombre(resolucion.nombre || '');
      setDescripcion(resolucion.descripcion || '');
      setFechaEmision(resolucion.fechaEmision || '');
      setFechaVencimiento(resolucion.fechaVencimiento || '');
      setEstado(resolucion.estado);
      setEnUso(resolucion.enUso);
      setFile(null);
      setError('');
    }
  }, [resolucion]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type !== 'application/pdf') {
      setError('Solo se permite subir archivos PDF');
      setFile(null);
      return;
    }
    setError('');
    setFile(f || null);
  };

  const handleSave = () => {
    if (!nombre || !fechaEmision || !fechaVencimiento) {
      setError('Todos los campos obligatorios deben estar completos');
      return;
    }
    setError('');
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('fechaEmision', fechaEmision);
    formData.append('fechaVencimiento', fechaVencimiento);
    formData.append('estado', String(estado));
    formData.append('enUso', String(enUso));
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Editar Resolución</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Emisión"
          type="date"
          value={fechaEmision}
          onChange={e => setFechaEmision(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha de Vencimiento"
          type="date"
          value={fechaVencimiento}
          onChange={e => setFechaVencimiento(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControlLabel
          control={<Switch checked={estado} onChange={e => setEstado(e.target.checked)} />}
          label="¿Activa?"
          sx={{ mt: 1 }}
        />
        <FormControlLabel
          control={<Switch checked={enUso} onChange={e => setEnUso(e.target.checked)} />}
          label="¿En Uso?"
          sx={{ mt: 1 }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ mt: 2 }}
        >
          {file ? file.name : 'Subir nuevo PDF (opcional)'}
          <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarResolucionModal; 