"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, Dialog } from "@mui/material";
import VentaPresencialModal from "@/components/ventas/VentaPresencialModal";
import { getHojasTrabajoCooperativa, HojaTrabajoDetallada } from '@/services/hojaTrabajo';
import axios from "axios";

export default function VentasPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [hojasTrabajo, setHojasTrabajo] = useState<HojaTrabajoDetallada[]>([]);
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [loadingHojas, setLoadingHojas] = useState(false);
  const [errorVentas, setErrorVentas] = useState<string | null>(null);
  const [openVentaModal, setOpenVentaModal] = useState(false);

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

  useEffect(() => {
    fetchData();
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
        <VentaPresencialModal onVentaExitosa={() => { fetchData(); setOpenVentaModal(false); }} />
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
    </Box>
  );
} 