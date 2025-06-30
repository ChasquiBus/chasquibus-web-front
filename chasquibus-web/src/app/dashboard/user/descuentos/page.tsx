"use client";
import React, { useEffect, useState } from 'react';
import { getAllDescuentos, Descuento } from '@/services/descuentos';
import DescuentosTable from '@/components/descuentos/DescuentosTable';
import { Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';

export default function DescuentosPage() {
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{open: boolean, msg: string, type: 'success'|'error'}>({open: false, msg: '', type: 'success'});

  const cargarDescuentos = async () => {
    setLoading(true);
    try {
      const data = await getAllDescuentos();
      setDescuentos(data);
    } catch {
      setSnackbar({open: true, msg: 'Error al cargar descuentos', type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDescuentos(); }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'black' }}>Descuentos disponibles</Typography>
      {loading ? <CircularProgress /> : (
        <DescuentosTable descuentos={descuentos} onEdit={() => {}} onDelete={() => {}} />
      )}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({...s, open: false}))} anchorOrigin={{vertical:'top',horizontal:'center'}}>
        <Alert severity={snackbar.type} sx={{ width: '100%' }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
} 