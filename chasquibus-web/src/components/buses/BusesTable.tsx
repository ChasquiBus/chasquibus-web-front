// src/components/buses/BusesTable.tsx
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
            <TableCell>Placa</TableCell>
            <TableCell>Número de Bus</TableCell>
            <TableCell>Cooperativa</TableCell>
            <TableCell>Marca Chasis</TableCell>
            <TableCell>Marca Carrocería</TableCell>
            <TableCell>Total Asientos</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {buses.map((bus) => {
            const imageUrl = bus.imagen
              ? `${API_URL}/${bus.imagen.startsWith('upload/buses/') ? bus.imagen : `upload/buses/${bus.imagen}`}`
              : undefined;
            console.log(`Image URL for bus ${bus.id}: ${imageUrl}`); // Debug log
            return (
              <TableRow key={bus.id}>
                <TableCell>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Bus ${bus.placa}`}
                      style={{
                        width: '120px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '4px', // Optional: slight rounding for aesthetics
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = ''; // Clear the broken image
                        console.log(`Failed to load image: ${imageUrl}`); // Debug error
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {bus.placa.charAt(0)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{bus.placa}</TableCell>
                <TableCell>{bus.cooperativa_id}</TableCell>
                <TableCell>{bus.marca_chasis || '-'}</TableCell>
                <TableCell>{bus.marca_carroceria || '-'}</TableCell>
                <TableCell>{bus.total_asientos}</TableCell>
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
            );
          })}
          {buses.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
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