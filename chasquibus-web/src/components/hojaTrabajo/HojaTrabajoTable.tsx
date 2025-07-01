import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Chip from '@mui/material/Chip';
import { HojaTrabajoDetallada, EstadoHojaTrabajo } from '@/services/hojaTrabajo';
import MuiAlert from '@mui/material/Alert';

interface HojaTrabajoTableProps {
  hojas: HojaTrabajoDetallada[];
  onEdit: (row: HojaTrabajoDetallada) => void;
  onDelete: (id: number) => void;
  onView: (row: HojaTrabajoDetallada) => void;
  error?: string;
}

const estadoColor: Record<EstadoHojaTrabajo, 'success' | 'info' | 'default' | 'error' | 'warning'> = {
  programado: 'success',
  'en curso': 'info',
  completado: 'default',
  suspendido: 'warning',
  cancelado: 'error',
};

const HojaTrabajoTable: React.FC<HojaTrabajoTableProps> = ({ hojas, onEdit, onDelete, onView, error }) => {
  return (
    <>
      {error && <MuiAlert severity="error">{error}</MuiAlert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bus</TableCell>
              <TableCell>Piso Doble</TableCell>
              <TableCell>Ruta</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Hora Salida</TableCell>
              <TableCell>Hora Llegada</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hojas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">No hay hojas de trabajo para mostrar.</TableCell>
              </TableRow>
            ) : (
              hojas.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {row.imagen && <img src={row.imagen} alt={row.placa} style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4 }} />}
                      <span>{row.placa}</span>
                    </div>
                  </TableCell>
                  <TableCell>{row.piso_doble ? 'Sí' : 'No'}</TableCell>
                  <TableCell>{`${row.ciudad_origen} → ${row.ciudad_destino}`}</TableCell>
                  <TableCell>{row.codigo}</TableCell>
                  <TableCell>{row.horaSalidaProg || '-'}</TableCell>
                  <TableCell>{row.horaLlegadaProg || '-'}</TableCell>
                  <TableCell>
                    <Chip label={row.estado} color={estadoColor[row.estado]} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onView(row)}><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => onEdit(row)} disabled={row.estado !== 'programado'}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => onDelete(row.id)} disabled={!(row.estado === 'programado' || row.estado === 'suspendido' || row.estado === 'cancelado')}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default HojaTrabajoTable; 