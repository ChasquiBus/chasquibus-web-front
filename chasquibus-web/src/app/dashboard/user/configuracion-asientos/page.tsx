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

  // Helper para generar asientos
  const generateSeats = (numSeats: number, pisoNum: number): PosicionAsiento[] => {
    const columnasGrid = 5; // Columnas visuales totales incluyendo pasillo
    const asientosPorFilaUtil = 4; // Asientos reales por fila (excluyendo pasillo)
    const filas = Math.ceil(numSeats / asientosPorFilaUtil);
    let count = 1;
    const newPosiciones: PosicionAsiento[] = [];

    for (let fila = 1; fila <= filas; fila++) {
      for (let col = 1; col <= columnasGrid; col++) {
        if (col === 3) continue; // Pasillo en la columna 3
        if (count > numSeats) break;
        newPosiciones.push({
          fila,
          columna: col,
          piso: pisoNum,
          tipoAsiento: 'NORMAL',
          precio: '0',
        });
        count++;
      }
      if (count > numSeats) break;
    }
    return newPosiciones;
  };

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
            let generatedPosiciones: PosicionAsiento[] = [];
            if (selectedBus.piso_doble) {
              // Piso 1 con total_asientos del bus
              generatedPosiciones = generatedPosiciones.concat(generateSeats(selectedBus.total_asientos, 1));
              // Piso 2 con total_asientos_piso2 del bus
              generatedPosiciones = generatedPosiciones.concat(generateSeats(selectedBus.total_asientos_piso2 || 0, 2));
            } else {
              // Piso 1 (bus de un solo piso) con total_asientos del bus
              generatedPosiciones = generateSeats(selectedBus.total_asientos, 1);
            }
            setPosiciones(generatedPosiciones);
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
      setError(null);

      // Validar que no haya posiciones duplicadas
      const posicionesUnicas = new Set(posiciones.map(p => `${p.fila}-${p.columna}-${p.piso}`));
      if (posicionesUnicas.size !== posiciones.length) {
        setError('Hay posiciones de asientos duplicadas');
        return;
      }

      // Validar que todos los precios sean números positivos con máximo 2 decimales
      const preciosInvalidos = posiciones.some(p => {
        const precio = parseFloat(p.precio);
        return isNaN(precio) || precio < 0 || !/^\d+(\.\d{1,2})?$/.test(p.precio);
      });

      if (preciosInvalidos) {
        setError('Todos los precios deben ser números positivos con máximo 2 decimales');
        return;
      }

      // Validar que en el piso 1 solo haya asientos NORMAL
      const asientosPiso1 = posiciones.filter(p => p.piso === 1);
      const asientosInvalidosPiso1 = asientosPiso1.some(p => p.tipoAsiento !== 'NORMAL');
      if (asientosInvalidosPiso1) {
        setError('En el piso 1 solo se permiten asientos de tipo NORMAL');
        return;
      }

      // Validar que los precios VIP sean mayores que los NORMAL en el piso 2
      const asientosPiso2 = posiciones.filter(p => p.piso === 2);
      const preciosVIP = asientosPiso2.filter(p => p.tipoAsiento === 'VIP').map(p => parseFloat(p.precio));
      const preciosNORMAL = asientosPiso2.filter(p => p.tipoAsiento === 'NORMAL').map(p => parseFloat(p.precio));

      if (preciosVIP.length > 0 && preciosNORMAL.length > 0) {
        const minPrecioVIP = Math.min(...preciosVIP);
        const maxPrecioNORMAL = Math.max(...preciosNORMAL);

        if (minPrecioVIP <= maxPrecioNORMAL) {
          setError('Los precios de los asientos VIP deben ser mayores que los asientos NORMAL');
          return;
        }
      }

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
        options={buses.filter(b => b.activo)}
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