"use client";
import React, { useEffect, useState } from 'react';
import { getAllBoletos, Boleto } from '@/services/boletos';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

export default function BoletosPage() {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllBoletos()
      .then(setBoletos)
      .catch(err => setError(err?.message || 'Error al cargar boletos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ color: '#000', mb: 2 }}>Boletos</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : boletos.length === 0 ? (
        <Typography>No hay boletos para mostrar.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Asiento</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Cédula</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Total sin descuento</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Descuento</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Total a pagar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boletos.map((boleto) => (
                <TableRow key={boleto.id}>
                  <TableCell>{boleto.id}</TableCell>
                  <TableCell>{boleto.asientoNumero}</TableCell>
                  <TableCell>{boleto.cedula}</TableCell>
                  <TableCell>{boleto.nombre}</TableCell>
                  <TableCell>${boleto.totalSinDescPorPers}</TableCell>
                  <TableCell>${boleto.totalDescPorPers}</TableCell>
                  <TableCell>${boleto.totalPorPer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
} 