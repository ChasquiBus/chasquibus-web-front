// src/components/buses/BusesTable.tsx
import React, { useState } from 'react';
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
  Dialog,
  DialogContent,
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
  // Estado para controlar imágenes que fallaron
  const [erroresImagen, setErroresImagen] = useState<{ [id: number]: boolean }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);

  const handleImageError = (busId: number) => {
    setErroresImagen((prev) => ({ ...prev, [busId]: true }));
  };

  // Filtrar solo buses activos
  const busesActivos = buses.filter(b => b.activo);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Número de Bus</TableCell>
              {/* <TableCell>Cooperativa</TableCell> */}
              <TableCell>Marca Chasis</TableCell>
              <TableCell>Marca Carrocería</TableCell>
              <TableCell>Total Asientos</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {busesActivos.map((bus) => {
              let imageUrl = undefined;
              if (bus.imagen) {
                if (/^https?:\/\//.test(bus.imagen)) {
                  imageUrl = bus.imagen;
                } else {
                  imageUrl = `https://ufhaisffqpipuafnitry.supabase.co/storage/v1/object/public/almacenamiento/imagenes/buses/${bus.imagen}`;
                }
              }
              return (
                <TableRow key={bus.id}>
                  <TableCell>
                    {imageUrl && !erroresImagen[bus.id] ? (
                      <img
                        src={imageUrl}
                        alt={`Bus ${bus.placa}`}
                        style={{
                          width: '120px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onError={() => handleImageError(bus.id)}
                        onClick={() => {
                          setModalImg(imageUrl);
                          setModalOpen(true);
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin imagen
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{bus.placa}</TableCell>
                  <TableCell>{bus.numero_bus}</TableCell>
                  {/* <TableCell>{bus.cooperativa_id}</TableCell> */}
                  <TableCell>{bus.marca_chasis || '-'}</TableCell>
                  <TableCell>{bus.marca_carroceria || '-'}</TableCell>
                  <TableCell>
                    {bus.piso_doble
                      ? Number(bus.total_asientos || 0) + Number(bus.total_asientos_piso2 || 0)
                      : bus.total_asientos}
                  </TableCell>
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
            {busesActivos.length === 0 && (
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
      {/* Modal para ver imagen en grande */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md">
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          {modalImg && (
            <img src={modalImg} alt="Bus" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}