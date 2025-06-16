import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Switch, FormControlLabel } from '@mui/material';

interface ResolucionesFormProps {
  onSubmit: (data: FormData) => void;
  cooperativaId: number;
}

const ResolucionesForm: React.FC<ResolucionesFormProps> = ({ onSubmit, cooperativaId }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEmision, setFechaEmision] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [estado, setEstado] = useState(true);
  const [enUso, setEnUso] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !fechaEmision || !fechaVencimiento) {
      setError('Todos los campos obligatorios deben estar completos');
      return;
    }
    if (!file) {
      setError('Debes adjuntar un archivo PDF');
      return;
    }
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cooperativaId', String(cooperativaId));
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('fechaEmision', fechaEmision);
    formData.append('fechaVencimiento', fechaVencimiento);
    formData.append('estado', String(estado));
    formData.append('enUso', String(enUso));
    onSubmit(formData);
    setNombre('');
    setDescripcion('');
    setFechaEmision('');
    setFechaVencimiento('');
    setEstado(true);
    setEnUso(false);
    setFile(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, maxWidth: 500 }}>
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
        {file ? file.name : 'Subir PDF'}
        <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Agregar Resolución
      </Button>
    </Box>
  );
};

export default ResolucionesForm; 



