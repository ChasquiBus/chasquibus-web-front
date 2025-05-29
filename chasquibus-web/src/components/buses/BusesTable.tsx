import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Chip,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Bus } from '@/types/bus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface BusesTableProps {
  buses: Bus[];
  onEdit: (bus: Bus) => void;
  onDelete: (id: number) => void;
}

export default function BusesTable({ buses, onEdit, onDelete }: BusesTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Imagen</TableCell>
            <TableCell>Placa</TableCell>
            <TableCell>Número de Bus</TableCell>
            <TableCell>Cooperativa</TableCell>
            <TableCell>Chofer</TableCell>
            <TableCell>Marca Chasis</TableCell>
            <TableCell>Marca Carrocería</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {buses.map((bus) => (
            <TableRow key={bus.id}>
              <TableCell>
                <Avatar
                  src={bus.imagen ? `${API_URL}/upload/buses/${bus.imagen}` : undefined}
                  alt={`Bus ${bus.placa}`}
                  sx={{ width: 50, height: 50 }}
                >
                  {bus.placa.charAt(0)}
                </Avatar>
              </TableCell>
              <TableCell>{bus.placa}</TableCell>
              <TableCell>{bus.numero_bus}</TableCell>
              <TableCell>{bus.cooperativa_id}</TableCell>
              <TableCell>{bus.chofer_id}</TableCell>
              <TableCell>{bus.marca_chasis || '-'}</TableCell>
              <TableCell>{bus.marca_carroceria || '-'}</TableCell>
              <TableCell>
                <Chip
                  label={bus.piso_doble ? 'Piso Doble' : 'Piso Simple'}
                  color={bus.piso_doble ? 'primary' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(bus)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(bus.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {buses.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography variant="body1" color="text.secondary">
                  No hay buses registrados
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 