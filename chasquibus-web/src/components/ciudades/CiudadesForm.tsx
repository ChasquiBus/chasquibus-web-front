import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

interface CiudadesFormProps {
  onSubmit: (data: { provincia: string; ciudad: string; cooperativaId: number }) => void;
  cooperativaId: number;
}

const CiudadesForm: React.FC<CiudadesFormProps> = ({ onSubmit, cooperativaId }) => {
  const [provincia, setProvincia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provincia || !ciudad) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setError('');
    onSubmit({ provincia, ciudad, cooperativaId });
    setProvincia('');
    setCiudad('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, maxWidth: 400 }}>
      <TextField
        label="Provincia"
        value={provincia}
        onChange={e => setProvincia(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ciudad"
        value={ciudad}
        onChange={e => setCiudad(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Agregar Ciudad
      </Button>
    </Box>
  );
};

export default CiudadesForm; 