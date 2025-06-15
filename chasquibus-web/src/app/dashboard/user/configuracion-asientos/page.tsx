"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Autocomplete, TextField, CircularProgress, Alert, Button, Snackbar } from "@mui/material";
import { busesService } from '@/services/buses';
import { configuracionAsientosService, ConfiguracionAsientos, PosicionAsiento } from '@/services/configuracionAsientos';
import { Bus } from '@/types/bus';
import AsientosGrid from './AsientosGrid';

export default function ConfiguracionAsientosPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [config, setConfig] = useState<ConfiguracionAsientos | null>(null);
  const [posiciones, setPosiciones] = useState<PosicionAsiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});

  useEffect(() => {
    busesService.getAll().then(setBuses).catch(() => setError('Error al cargar los buses.'));
  }, []);

  useEffect(() => {
    if (selectedBus) {
      setLoading(true);
      configuracionAsientosService.getByBusId(selectedBus.id)
        .then(cfg => {
          setConfig(cfg);
          if (cfg) {
            setPosiciones(JSON.parse(cfg.posicionesJson));
          } else {
            // Generar asientos automáticamente si no hay configuración
            const total = selectedBus.total_asientos;
            const columnas = 5;
            const filas = Math.ceil(total / 4); // 4 asientos por fila (col 1,2,4,5)
            let count = 1;
            const posiciones: PosicionAsiento[] = [];
            for (let fila = 1; fila <= filas; fila++) {
              for (let col = 1; col <= columnas; col++) {
                if (col === 3) continue; // Pasillo
                if (count > total) break;
                posiciones.push({
                  fila,
                  columna: col,
                  piso: 1,
                  tipoAsiento: 'NORMAL',
                  precio: '0',
                });
                count++;
              }
            }
            setPosiciones(posiciones);
          }
        })
        .catch(() => {
          setConfig(null);
          setPosiciones([]);
        })
        .finally(() => setLoading(false));
    } else {
      setConfig(null);
      setPosiciones([]);
    }
  }, [selectedBus]);

  const handleSave = async () => {
    if (!selectedBus) return;
    try {
      setLoading(true);
      if (config) {
        await configuracionAsientosService.update(config.id, { posiciones });
        setSnackbar({open: true, message: 'Configuración actualizada correctamente', severity: 'success'});
      } else {
        await configuracionAsientosService.create({ busId: selectedBus.id, posiciones });
        setSnackbar({open: true, message: 'Configuración creada correctamente', severity: 'success'});
      }
      // Recargar config
      const cfg = await configuracionAsientosService.getByBusId(selectedBus.id);
      setConfig(cfg);
      setPosiciones(cfg ? JSON.parse(cfg.posicionesJson) : []);
    } catch (e: any) {
      setSnackbar({open: true, message: e.message || 'Error al guardar', severity: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#000' }}>
        Configuración de Asientos
      </Typography>
      <Autocomplete
        options={buses}
        getOptionLabel={(option) => `${option.placa} - ${option.numero_bus}`}
        value={selectedBus}
        onChange={(_, value) => setSelectedBus(value)}
        renderInput={(params) => <TextField {...params} label="Selecciona un bus" />}
        sx={{ maxWidth: 400, mb: 3 }}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        disabled={buses.length === 0}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <CircularProgress />}
      {selectedBus && !loading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ color: '#000' }}>
            Bus seleccionado: {selectedBus.placa} - {selectedBus.numero_bus}
          </Typography>
          {config ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Configuración encontrada para este bus. (Asientos: {posiciones.length})
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Este bus no tiene configuración de asientos aún.
            </Alert>
          )}
          <AsientosGrid
            bus={selectedBus}
            posiciones={posiciones}
            onChange={setPosiciones}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleSave}
            disabled={posiciones.length === 0 || loading}
          >
            Guardar configuración
          </Button>
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({...s, open: false}))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
} 