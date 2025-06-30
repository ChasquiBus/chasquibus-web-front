import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Descuento } from '@/services/descuentos';

interface DescuentosTableProps {
  descuentos: Descuento[];
  onEdit: (descuento: Descuento) => void;
  onDelete: (id: number) => void;
}

export default function DescuentosTable({ descuentos }: DescuentosTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tipo de Descuento</TableCell>
            <TableCell>Requiere Validación</TableCell>
            <TableCell>Porcentaje (%)</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {descuentos.map((descuento) => (
            <TableRow key={descuento.id}>
              <TableCell>{descuento.tipoDescuento}</TableCell>
              <TableCell>{descuento.requiereValidacion ? 'Sí' : 'No'}</TableCell>
              <TableCell>{descuento.porcentaje}</TableCell>
              <TableCell>
                <Chip label={descuento.estado} color={descuento.estado === 'activo' ? 'success' : 'default'} size="small" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 