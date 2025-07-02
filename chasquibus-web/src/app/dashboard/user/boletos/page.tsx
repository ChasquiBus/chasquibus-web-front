"use client";
import React, { useEffect, useState } from 'react';
import { getAllBoletos, Boleto } from '@/services/boletos';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import jsQR from 'jsqr';

export default function BoletosPage() {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [boletoQr, setBoletoQr] = useState<Boleto | null>(null);
  const [filtroCedula, setFiltroCedula] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllBoletos()
      .then(boletosData => {
        setBoletos(boletosData);
        // Lógica para mostrar automáticamente el modal del último boleto generado
        const ultimaVentaId = localStorage.getItem('ultima_venta_id');
        if (ultimaVentaId) {
          const boleto = boletosData.find(b => String(b.ventaId) === ultimaVentaId);
          if (boleto) {
            setBoletoQr(boleto);
            setQrOpen(true);
            localStorage.removeItem('ultima_venta_id');
          }
        }
      })
      .catch(err => setError(err?.message || 'Error al cargar boletos'))
      .finally(() => setLoading(false));
  }, []);

  // Decodificar el contenido del QR si es posible
  function decodeQRContent(qr: string | null): any {
    if (!qr) return null;
    try {
      // Extraer solo la parte base64
      const base64 = qr.split(',')[1];
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8ClampedArray(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      // Crear un canvas temporal para leer el QR
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const imgData = ctx.createImageData(200, 200);
      imgData.data.set(bytes);
      ctx.putImageData(imgData, 0, 0);
      const imageData = ctx.getImageData(0, 0, 200, 200);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        return JSON.parse(code.data);
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  const boletosFiltrados = filtroCedula.trim() === ''
    ? boletos
    : boletos.filter(b => b.cedula && b.cedula.includes(filtroCedula.trim()));

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ color: '#000', mb: 2 }}>Boletos</Typography>
      <TextField
        label="Filtrar por cédula"
        value={filtroCedula}
        onChange={e => setFiltroCedula(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 2, width: 250 }}
      />
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
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Apellido</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Total sin descuento</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Descuento</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>Total a pagar</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700 }}>QR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boletosFiltrados.map((boleto) => (
                <TableRow key={boleto.id}>
                  <TableCell>{boleto.id}</TableCell>
                  <TableCell>{boleto.asientoNumero}</TableCell>
                  <TableCell>{boleto.cedula}</TableCell>
                  <TableCell>{boleto.nombre}</TableCell>
                  <TableCell>{boleto.apellido}</TableCell>
                  <TableCell>${boleto.totalSinDescPorPers}</TableCell>
                  <TableCell>${boleto.totalDescPorPers}</TableCell>
                  <TableCell>${boleto.totalPorPer}</TableCell>
                  <TableCell>
                    {boleto.codigoQr && (
                      <Button size="small" variant="outlined" onClick={() => { setBoletoQr(boleto); setQrOpen(true); }}>Ver QR</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={qrOpen} onClose={() => setQrOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>QR del Boleto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          {boletoQr?.codigoQr && (
            <img src={boletoQr.codigoQr} alt="QR Boleto" style={{ width: 200, height: 200, marginBottom: 16 }} />
          )}
          {boletoQr && (() => {
            const qrContent = decodeQRContent(boletoQr.codigoQr);
            if (qrContent) {
              return (
                <div style={{ textAlign: 'center' }}>
                  <div><b>ID Boleto:</b> {qrContent.idBoleto}</div>
                  <div><b>Nombre:</b> {qrContent.nombre} {qrContent.apellido}</div>
                  <div><b>Cédula:</b> {qrContent.cedula}</div>
                  <div><b>Usado:</b> {qrContent.usado ? 'Sí' : 'No'}</div>
                  <div><b>Cooperativa:</b> {qrContent.cooperativa}</div>
                  <div><b>Aplica Descuento:</b> {qrContent.aplicoDescuento ? 'Sí' : 'No'}</div>
                </div>
              );
            } else {
              return (
                <div style={{ textAlign: 'center' }}>
                  <div><b>ID:</b> {boletoQr.id}</div>
                  <div><b>Nombre:</b> {boletoQr.nombre} {boletoQr.apellido}</div>
                  <div><b>Cédula:</b> {boletoQr.cedula}</div>
                  <div><b>Asiento:</b> {boletoQr.asientoNumero}</div>
                </div>
              );
            }
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrOpen(false)} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 