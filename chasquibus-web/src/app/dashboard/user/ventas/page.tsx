"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import VentaPresencialModal from "@/components/ventas/VentaPresencialModal";
import { getHojasTrabajoCooperativa, HojaTrabajoDetallada } from '@/services/hojaTrabajo';
import axios from "axios";
import { getAllBoletos, Boleto } from '@/services/boletos';
import jsPDF from 'jspdf';

export default function VentasPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [hojasTrabajo, setHojasTrabajo] = useState<HojaTrabajoDetallada[]>([]);
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [loadingHojas, setLoadingHojas] = useState(false);
  const [errorVentas, setErrorVentas] = useState<string | null>(null);
  const [openVentaModal, setOpenVentaModal] = useState(false);
  const [boletoModal, setBoletoModal] = useState<Boleto | null>(null);
  const [openBoletoModal, setOpenBoletoModal] = useState(false);
  const [boletosModal, setBoletosModal] = useState<Boleto[]>([]);
  const [boletoIndex, setBoletoIndex] = useState(0);

  // Función para obtener el nombre de la hoja de trabajo por ID
  const getNombreHojaTrabajo = (hojaTrabajoId: number) => {
    const hoja = hojasTrabajo.find(h => h.id === hojaTrabajoId);
    return hoja ? hoja.codigo : `ID: ${hojaTrabajoId}`;
  };

  // --- NUEVO: función para recargar datos ---
  const fetchData = () => {
    // Cargar ventas
    setLoadingVentas(true);
    setErrorVentas(null);
    const token = localStorage.getItem('access_token');
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/ventas/cooperativa/tipo/presencial`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res: any) => setVentas(res.data))
      .catch((err: any) => setErrorVentas(err?.message || 'Error al cargar ventas'))
      .finally(() => setLoadingVentas(false));

    // Cargar hojas de trabajo
    setLoadingHojas(true);
    getHojasTrabajoCooperativa()
      .then(setHojasTrabajo)
      .catch((err: any) => console.error('Error al cargar hojas de trabajo:', err))
      .finally(() => setLoadingHojas(false));
  };

  // Decodificar el contenido del QR si es posible (copiado de boletos/page.tsx)
  function decodeQRContent(qr: string | null): any {
    if (!qr) return null;
    try {
      const base64 = qr.split(',')[1];
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8ClampedArray(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const imgData = ctx.createImageData(200, 200);
      imgData.data.set(bytes);
      ctx.putImageData(imgData, 0, 0);
      const imageData = ctx.getImageData(0, 0, 200, 200);
      // @ts-ignore
      const jsQR = require('jsqr');
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        return JSON.parse(code.data);
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // Función para mostrar el modal de todos los boletos de la última venta
  const mostrarModalBoletoUltimaVenta = () => {
    const ultimaVentaId = localStorage.getItem('ultima_venta_id');
    if (ultimaVentaId) {
      getAllBoletos().then(boletosData => {
        const boletosVenta = boletosData.filter(b => String(b.ventaId) === ultimaVentaId);
        if (boletosVenta.length > 0) {
          setBoletosModal(boletosVenta);
          setBoletoIndex(0);
          setOpenBoletoModal(true);
          localStorage.removeItem('ultima_venta_id');
        }
      });
    }
  };

  // Función para imprimir el boleto actual
  const handleImprimirBoleto = () => {
    if (boletosModal.length === 0) return;
    const boleto = boletosModal[boletoIndex];
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text('Boleto de viaje', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`ID: ${boleto.id}`, 20, y); y += 8;
    doc.text(`Nombre: ${boleto.nombre} ${boleto.apellido}`, 20, y); y += 8;
    doc.text(`Cédula: ${boleto.cedula}`, 20, y); y += 8;
    doc.text(`Asiento: ${boleto.asientoNumero}`, 20, y); y += 8;
    doc.text(`Tarifa: $${boleto.totalSinDescPorPers}`, 20, y); y += 8;
    doc.text(`Descuento: $${boleto.totalDescPorPers}`, 20, y); y += 8;
    doc.text(`Total a pagar: $${boleto.totalPorPer}`, 20, y); y += 8;
    if (boleto.codigoQr) {
      doc.addImage(boleto.codigoQr, 'PNG', 20, y, 50, 50);
      y += 55;
    }
    doc.save(`boleto_${boleto.id}.pdf`);
    // Abrir el PDF en una nueva pestaña
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
  };

  useEffect(() => {
    fetchData();
    mostrarModalBoletoUltimaVenta();
  }, []);

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1100, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#000' }}>Ventas Presenciales</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenVentaModal(true)}>
          Nueva venta presencial
        </Button>
      </Box>
      {/* Modal de venta presencial */}
      <Dialog open={openVentaModal} onClose={() => setOpenVentaModal(false)} maxWidth="md" fullWidth>
        <VentaPresencialModal onVentaExitosa={() => { fetchData(); setOpenVentaModal(false); mostrarModalBoletoUltimaVenta(); }} />
      </Dialog>
      {/* Tabla de ventas presenciales */}
      <Box sx={{ maxWidth: 1000, mx: "auto", my: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>Historial de Ventas Presenciales</Typography>
        {loadingVentas || loadingHojas ? <CircularProgress /> : errorVentas ? (
          <Typography color="error">{errorVentas}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#000', fontWeight: 700 }}>ID</TableCell>
                  <TableCell sx={{ color: '#000', fontWeight: 700 }}>Hoja Trabajo</TableCell>
                  <TableCell sx={{ color: '#000', fontWeight: 700 }}>Fecha Venta</TableCell>
                  <TableCell sx={{ color: '#000', fontWeight: 700 }}>Total sin Descuento</TableCell>
                  <TableCell sx={{ color: '#000', fontWeight: 700 }}>Total Descuentos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell>{venta.id}</TableCell>
                    <TableCell>{getNombreHojaTrabajo(venta.hojaTrabajoId)}</TableCell>
                    <TableCell>{venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleString() : ''}</TableCell>
                    <TableCell>${venta.totalSinDescuento}</TableCell>
                    <TableCell>${venta.totalDescuentos}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {/* Modal para mostrar los boletos generados automáticamente */}
      <Dialog open={openBoletoModal} onClose={() => setOpenBoletoModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>QR del Boleto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          {boletosModal.length > 0 && boletosModal[boletoIndex]?.codigoQr && (
            <img src={boletosModal[boletoIndex].codigoQr} alt="QR Boleto" style={{ width: 200, height: 200, marginBottom: 16 }} />
          )}
          {boletosModal.length > 0 && (() => {
            const boleto = boletosModal[boletoIndex];
            const qrContent = decodeQRContent(boleto.codigoQr);
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
                  <div><b>ID:</b> {boleto.id}</div>
                  <div><b>Nombre:</b> {boleto.nombre} {boleto.apellido}</div>
                  <div><b>Cédula:</b> {boleto.cedula}</div>
                  <div><b>Asiento:</b> {boleto.asientoNumero}</div>
                </div>
              );
            }
          })()}
          {boletosModal.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
              <Button onClick={() => setBoletoIndex(i => Math.max(0, i - 1))} disabled={boletoIndex === 0}>Anterior</Button>
              <Typography variant="body2">Boleto {boletoIndex + 1} de {boletosModal.length}</Typography>
              <Button onClick={() => setBoletoIndex(i => Math.min(boletosModal.length - 1, i + 1))} disabled={boletoIndex === boletosModal.length - 1}>Siguiente</Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBoletoModal(false)} color="primary">Cerrar</Button>
          <Button onClick={handleImprimirBoleto} color="secondary" variant="contained">Imprimir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 