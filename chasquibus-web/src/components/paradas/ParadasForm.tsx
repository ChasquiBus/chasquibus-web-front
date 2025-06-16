import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Switch, FormControlLabel, MenuItem } from '@mui/material';

export interface CiudadOption {
  id: number;
  provincia: string;
  ciudad: string;
}

interface ParadasFormProps {
  onSubmit: (data: { ciudadId: number; nombreParada: string; direccion: string; esTerminal: boolean; cooperativaId: number }) => void;
  cooperativaId: number;
  ciudades: CiudadOption[];
}

const ParadasForm: React.FC<ParadasFormProps> = ({ onSubmit, cooperativaId, ciudades }) => {
  const [ciudadId, setCiudadId] = useState('');
  const [nombreParada, setNombreParada] = useState('');
  const [direccion, setDireccion] = useState('');
  const [esTerminal, setEsTerminal] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciudadId || !nombreParada || !direccion) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setError('');
    onSubmit({ ciudadId: Number(ciudadId), nombreParada, direccion, esTerminal, cooperativaId });
    setCiudadId('');
    setNombreParada('');
    setDireccion('');
    setEsTerminal(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, maxWidth: 400 }}>
      <TextField
        select
        label="Ciudad"
        value={ciudadId}
        onChange={e => setCiudadId(e.target.value)}
        required
        fullWidth
        margin="normal"
        helperText={ciudades.length === 0 ? 'No hay ciudades disponibles' : ''}
      >
        {ciudades.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.provincia} - {c.ciudad}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Nombre de Parada"
        value={nombreParada}
        onChange={e => setNombreParada(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Dirección"
        value={direccion}
        onChange={e => setDireccion(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={<Switch checked={esTerminal} onChange={e => setEsTerminal(e.target.checked)} />}
        label="¿Es Terminal?"
        sx={{ mt: 1 , color: '#111'}}
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Agregar Parada
      </Button>
    </Box>
  );
};

export default ParadasForm; 