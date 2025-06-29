"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminCooperativasService } from '@/services/adminCooperativas';
import { cooperativesService } from '@/services/cooperatives';
import { AdminCooperativa } from '@/types/adminCooperativa';
import { Cooperativa } from '@/types/cooperatives';

// Colores para las gráficas
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdminDashboard() {
  const [data, setData] = useState<{ admins: AdminCooperativa[]; cooperativas: Cooperativa[] }>(
    {
      admins: [],
      cooperativas: [],
    }
  );
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    estado: 'todos',
    rol: 'todos',
    ciudad: 'todos',
  });

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [admins, cooperativas] = await Promise.all([
          adminCooperativasService.getAll(),
          cooperativesService.getAll(),
        ]);
        setData({ admins, cooperativas });
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // KPIs
  const totalAdmins = data.admins.length;
  const totalCooperativas = data.cooperativas.length;
  const cooperativasActivas = data.cooperativas.filter(c => c.activo).length;

  // Datos para gráfica de torta (cooperativas por ciudad)
  const cooperativasPorCiudad = data.cooperativas.reduce((acc, coop) => {
    const ciudad = coop.direccion?.split(',')[0] || 'Sin ciudad';
    acc[ciudad] = (acc[ciudad] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(cooperativasPorCiudad).map(([ciudad, count]) => ({
    name: ciudad,
    value: count,
  }));

  // Filtrar datos
  const filteredAdmins = data.admins.filter(admin => {
    const matchesSearch = admin.usuario.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                         admin.usuario.apellido.toLowerCase().includes(filters.search.toLowerCase()) ||
                         admin.usuario.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesEstado = filters.estado === 'todos' || 
                         (filters.estado === 'activo' && admin.usuario.activo) ||
                         (filters.estado === 'inactivo' && !admin.usuario.activo);
    return matchesSearch && matchesEstado;
  });

  const filteredCooperativas = data.cooperativas.filter(coop => {
    const matchesSearch = coop.nombre.toLowerCase().includes(filters.search.toLowerCase());
    const matchesEstado = filters.estado === 'todos' || 
                         (filters.estado === 'activo' && coop.activo) ||
                         (filters.estado === 'inactivo' && !coop.activo);
    return matchesSearch && matchesEstado;
  });

  const handleFilterChange = (field: string) => (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Cargando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Título */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1976d2' }}>
        Dashboard Administrativo
      </Typography>

      {/* KPIs y Gráfica de Torta */}
      <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
        {/* KPIs */}
        <Grid size={12}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <AdminIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        {totalAdmins}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Administradores
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: '#e8f5e8' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <BusinessIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                        {totalCooperativas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cooperativas
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: '#fff3e0' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <PeopleIcon sx={{ fontSize: 40, color: '#f57c00', mr: 2 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>
                        {cooperativasActivas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cooperativas Activas
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        {/* Gráfica de pastel */}
        <Grid size={12}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cooperativas por Ciudad
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla de Usuarios */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Administradores de cooperativas
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Cooperativa</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Creación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdmins.map((admin) => {
                const cooperativa = data.cooperativas.find(c => c.id === admin.cooperativaTransporteId);
                return (
                  <TableRow key={`admin-${admin.id}`}>
                    <TableCell>{`${admin.usuario.nombre} ${admin.usuario.apellido}`}</TableCell>
                    <TableCell>{admin.usuario.email}</TableCell>
                    <TableCell>{admin.cooperativaTransporte?.nombre || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={admin.usuario.activo ? 'Activo' : 'Inactivo'} 
                        color={admin.usuario.activo ? 'success' : 'error'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{new Date(admin.usuario.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Tabla de Cooperativas */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Cooperativas
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>RUC</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Creación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCooperativas.map((cooperativa) => (
                <TableRow key={cooperativa.id}>
                  <TableCell>{cooperativa.nombre}</TableCell>
                  <TableCell>{cooperativa.ruc || 'N/A'}</TableCell>
                  <TableCell>{cooperativa.email || 'N/A'}</TableCell>
                  <TableCell>{cooperativa.telefono || 'N/A'}</TableCell>
                  <TableCell>{cooperativa.direccion || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={cooperativa.activo ? 'Activa' : 'Inactiva'} 
                      color={cooperativa.activo ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{new Date(cooperativa.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}