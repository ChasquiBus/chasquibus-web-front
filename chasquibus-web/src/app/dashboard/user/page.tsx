"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { busesService } from '@/services/buses';
import { oficinistasService } from '@/services/oficinistas';
import { choferesService } from '@/services/choferes';
import axios from 'axios';
import { getHojasTrabajoCooperativa, HojaTrabajoDetallada } from '@/services/hojaTrabajo';
import { Chofer } from '@/types/chofer';

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [busesCount, setBusesCount] = useState<number | null>(null);
  const [oficinistasCount, setOficinistasCount] = useState<number | null>(null);
  const [choferesCount, setChoferesCount] = useState<number | null>(null);
  const [ventasCount, setVentasCount] = useState<number | null>(null);
  const [ganancia, setGanancia] = useState<number | null>(null);
  const [ventas, setVentas] = useState<any[]>([]);
  const [hojasTrabajo, setHojasTrabajo] = useState<HojaTrabajoDetallada[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token') || '';
        const [buses, oficinistas, ventasRes, hojas] = await Promise.all([
          busesService.getAll(),
          oficinistasService.getAllOficinistas(),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/ventas/cooperativa/tipo/presencial`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          getHojasTrabajoCooperativa()
        ]);
        setBusesCount(buses.filter((bus: any) => bus.activo).length);
        setOficinistasCount(oficinistas.length);
        setVentasCount(Array.isArray(ventasRes.data) ? ventasRes.data.length : 0);
        // Calcular la ganancia total sumando totalFinal de cada venta
        const ventasArr = Array.isArray(ventasRes.data) ? ventasRes.data : [];
        setVentas(ventasArr);
        setHojasTrabajo(hojas);
        const totalGanancia = ventasArr.reduce((acc, v) => acc + Number(v.totalFinal || 0), 0);
        setGanancia(totalGanancia);
        // Para choferes, si tienes cooperativaId, pásalo, si no, solo cuenta 0
        let choferes: Chofer[] = [];
        try {
          choferes = await choferesService.getAllChoferes(1, token); // Cambia 1 por el cooperativaId real si lo tienes
        } catch {
          choferes = [];
        }
        setChoferesCount(Array.isArray(choferes) ? choferes.length : 0);
      } catch {
        setBusesCount(null);
        setOficinistasCount(null);
        setChoferesCount(null);
        setVentasCount(null);
        setGanancia(null);
        setVentas([]);
        setHojasTrabajo([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Helper para obtener hoja de trabajo por id
  const getHojaTrabajo = (id: number) => hojasTrabajo.find(h => h.id === id);

  // 1. Últimas ventas realizadas (máximo 5)
  const ultimasVentas = [...ventas]
    .sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime())
    .slice(0, 5);

  // 2. Buses más utilizados
  const busVentasMap: Record<string, any> = {};
  ventas.forEach(v => {
    const hoja = getHojaTrabajo(v.hojaTrabajoId);
    if (hoja) {
      busVentasMap[hoja.placa] = busVentasMap[hoja.placa] || { placa: hoja.placa, estado: hoja.estado, count: 0 };
      busVentasMap[hoja.placa].count++;
    }
  });
  const busesMasUtilizados = Object.values(busVentasMap)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);

  // 3. Rutas más vendidas
  const rutaVentasMap: Record<string, any> = {};
  ventas.forEach(v => {
    const hoja = getHojaTrabajo(v.hojaTrabajoId);
    if (hoja) {
      const ruta = `${hoja.ciudad_origen} → ${hoja.ciudad_destino}`;
      if (!rutaVentasMap[ruta]) rutaVentasMap[ruta] = { ruta, count: 0, ganancia: 0 };
      rutaVentasMap[ruta].count++;
      rutaVentasMap[ruta].ganancia += Number(v.totalFinal || 0);
    }
  });
  const rutasMasVendidas = Object.values(rutaVentasMap)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#1976d2' }}>
        Dashboard Usuario
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 3, mb: 4, alignItems: 'stretch' }}>
        <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <DirectionsBusIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {loading ? <CircularProgress size={32} /> : busesCount ?? '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Buses
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#e8f5e8', height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PeopleIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {loading ? <CircularProgress size={32} /> : oficinistasCount ?? '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Oficinistas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#fff3e0', height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PersonIcon sx={{ fontSize: 40, color: '#f57c00', mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>
                  {loading ? <CircularProgress size={32} /> : choferesCount ?? '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choferes
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#ede7f6', height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ReceiptLongIcon sx={{ fontSize: 40, color: '#7c4dff', mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#7c4dff' }}>
                  {loading ? <CircularProgress size={32} /> : ventasCount ?? '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ventas realizadas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#fffde7', height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <MonetizationOnIcon sx={{ fontSize: 40, color: '#fbc02d', mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbc02d' }}>
                  {loading ? <CircularProgress size={32} /> : ganancia !== null ? `$${ganancia.toFixed(2)}` : '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ganancia total
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Tablas informativas */}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>Últimas ventas realizadas</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hoja de trabajo</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Cliente</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ultimasVentas.map((v) => {
                  const hoja = getHojaTrabajo(v.hojaTrabajoId);
                  return (
                    <TableRow key={v.id}>
                      <TableCell>{v.id}</TableCell>
                      <TableCell>{v.fechaVenta ? new Date(v.fechaVenta).toLocaleString() : ''}</TableCell>
                      <TableCell>{hoja ? hoja.codigo : v.hojaTrabajoId}</TableCell>
                      <TableCell>${v.totalFinal}</TableCell>
                      <TableCell>{v.clienteId || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>Buses más utilizados</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Bus (placa)</TableCell>
                  <TableCell>Cant. ventas</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {busesMasUtilizados.map((b: any) => (
                  <TableRow key={b.placa}>
                    <TableCell>{b.placa}</TableCell>
                    <TableCell>{b.count}</TableCell>
                    <TableCell>{b.estado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1', lg: '3' } }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>Rutas más vendidas</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ruta</TableCell>
                  <TableCell>Ventas realizadas</TableCell>
                  <TableCell>Ganancia generada</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rutasMasVendidas.map((r: any) => (
                  <TableRow key={r.ruta}>
                    <TableCell>{r.ruta}</TableCell>
                    <TableCell>{r.count}</TableCell>
                    <TableCell>${r.ganancia.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
} 