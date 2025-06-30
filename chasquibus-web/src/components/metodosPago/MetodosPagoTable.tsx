import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export interface MetodoPago {
  id: number;
  cooperativaId: number;
  nombre: string;
  descripcion?: string;
  procesador?: string;
  configuracion?: string;
  activo: boolean;
}

interface MetodosPagoTableProps {
  metodosPago: MetodoPago[];
  onEdit: (metodo: MetodoPago) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
}

const MetodosPagoTable: React.FC<MetodosPagoTableProps> = ({ metodosPago, onEdit, onToggleActivo }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Procesador</TableCell>
            <TableCell>Configuración</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metodosPago.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="subtitle1" color="textSecondary" sx={{ py: 3 }}>
                  No hay métodos de pago registrados.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            metodosPago.map((metodo) => (
              <TableRow key={metodo.id}>
                <TableCell>{metodo.nombre}</TableCell>
                <TableCell>{metodo.descripcion || '-'}</TableCell>
                <TableCell>{metodo.procesador || '-'}</TableCell>
                <TableCell>
                  {metodo.configuracion ? (
                    <Tooltip title={metodo.configuracion}>
                      <span>{metodo.configuracion.length > 30 ? metodo.configuracion.slice(0, 30) + '…' : metodo.configuracion}</span>
                    </Tooltip>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Chip label={metodo.activo ? 'Activo' : 'Inactivo'} color={metodo.activo ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title={metodo.activo ? 'Desactivar' : 'Activar'}>
                      <Switch
                        checked={metodo.activo}
                        onChange={() => onToggleActivo(metodo.id, !metodo.activo)}
                        color="primary"
                        inputProps={{ 'aria-label': 'toggle activo' }}
                      />
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => onEdit(metodo)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MetodosPagoTable; 