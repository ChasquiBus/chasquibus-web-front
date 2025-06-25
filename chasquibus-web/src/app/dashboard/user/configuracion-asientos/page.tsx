"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Autocomplete, TextField, CircularProgress, Alert, Button, Snackbar, Grid, FormControl, RadioGroup, FormControlLabel, Radio, Dialog, DialogActions, DialogContent } from "@mui/material";
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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('plantilla1');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const templates = [
    { id: 'plantilla1', src: '/images/plantilla1.jpg', label: 'Plantilla 1' },
    { id: 'plantilla2', src: '/images/plantilla2.jpg', label: 'Plantilla 2' },
    { id: 'plantilla3', src: '/images/plantilla3.jpg', label: 'Plantilla 3' },
  ];

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  // Helper para generar asientos para la Plantilla 1
  const generateSeatsPlantilla1 = (numSeats: number, pisoNum: number): PosicionAsiento[] => {
    const newPosiciones: PosicionAsiento[] = [];
    if (numSeats <= 0) return [];

    const seatsInLastRow = 3; // La última fila siempre tendrá 3 asientos en esta plantilla.
    const regularSeatsCount = numSeats - seatsInLastRow;
    let numeroAsientoCounter = 1;
    let fila = 1;

    // Generar filas regulares de 4 asientos (de izquierda a derecha)
    while (numeroAsientoCounter <= regularSeatsCount) {
        const seatsToPlace = Math.min(4, regularSeatsCount - numeroAsientoCounter + 1);
        if (seatsToPlace >= 1) newPosiciones.push({ fila, columna: 1, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: numeroAsientoCounter });
        if (seatsToPlace >= 2) newPosiciones.push({ fila, columna: 2, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: numeroAsientoCounter + 1 });
        if (seatsToPlace >= 3) newPosiciones.push({ fila, columna: 4, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: numeroAsientoCounter + 2 });
        if (seatsToPlace >= 4) newPosiciones.push({ fila, columna: 5, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: numeroAsientoCounter + 3 });
        
        numeroAsientoCounter += 4;
        fila++;
    }

    // Generar la última fila con 3 asientos a la izquierda
    if (regularSeatsCount >= 0) { // Siempre generar la última fila si hay asientos.
        const lastRowStartNumber = regularSeatsCount + 1;
        newPosiciones.push({ fila, columna: 1, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: lastRowStartNumber });
        newPosiciones.push({ fila, columna: 2, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: lastRowStartNumber + 1 });
        newPosiciones.push({ fila, columna: 3, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: lastRowStartNumber + 2 });
    }
    
    return newPosiciones.sort((a, b) => a.numeroAsiento - b.numeroAsiento).filter(a => a.numeroAsiento <= numSeats);
  }

  // Helper para generar asientos para la Plantilla 2 (última fila con 5)
  const generateSeatsPlantilla2 = (numSeats: number, pisoNum: number): PosicionAsiento[] => {
    const newPosiciones: PosicionAsiento[] = [];
    if (numSeats <= 0) return [];
    
    const seatsInLastRow = 5;
    const regularSeatsCount = numSeats - seatsInLastRow;
    let numeroAsientoCounter = 1;
    let fila = 1;

    // Generar filas regulares de 4 asientos (2, pasillo, 2)
    while (numeroAsientoCounter <= regularSeatsCount) {
        const seatsToPlace = Math.min(4, regularSeatsCount - numeroAsientoCounter + 1);
            if (seatsToPlace >= 1) newPosiciones.push({ fila, columna: 1, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: numeroAsientoCounter });
            if (seatsToPlace >= 2) newPosiciones.push({ fila, columna: 2, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: numeroAsientoCounter + 1 });
            if (seatsToPlace >= 3) newPosiciones.push({ fila, columna: 4, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: numeroAsientoCounter + 2 });
            if (seatsToPlace >= 4) newPosiciones.push({ fila, columna: 5, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: numeroAsientoCounter + 3 });
        
            numeroAsientoCounter += 4;
            fila++;
        }

    // Generar la última fila con 5 asientos
    const lastRowStartNumber = regularSeatsCount + 1;
    for (let i = 0; i < seatsInLastRow; i++) {
        // Asegurarse de no exceder el número total de asientos
        if (lastRowStartNumber + i <= numSeats) {
            newPosiciones.push({ fila, columna: i + 1, piso: pisoNum, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: lastRowStartNumber + i });
        }
    }
    
    return newPosiciones.sort((a, b) => a.numeroAsiento - b.numeroAsiento);
  }

  // Helper para generar asientos para la Plantilla 3
  const generateSeatsPlantilla3 = (numSeats: number, pisoNum: number): PosicionAsiento[] => {
    // Generar con 2 asientos extra para poder quitarlos
    let allSeats = generateSeatsPlantilla2(numSeats + 2, pisoNum);
    
    // Quitar asientos de la primera fila, columnas 2 y 4 (segundo y tercer asiento visual)
    allSeats = allSeats.filter(p => !(p.fila === 1 && (p.columna === 2 || p.columna === 4)));
      
    // Re-numerar todos los asientos para que sean consecutivos
    let seatCounter = 1;
    const finalSeats = allSeats.map(seat => ({
      ...seat,
      numeroAsiento: seatCounter++
    }));
    
    // Devolver solo la cantidad de asientos solicitada
    return finalSeats.slice(0, numSeats);
  }

  // Helper para generar asientos
  const generateSeats = (numSeats: number, pisoNum: number, startSeatNumber: number = 1): PosicionAsiento[] => {
    const columnasGrid = 5; // Columnas visuales totales incluyendo pasillo
    const asientosPorFilaUtil = 4; // Asientos reales por fila (excluyendo pasillo)
    const filas = Math.ceil(numSeats / asientosPorFilaUtil);
    let count = 1;
    const newPosiciones: PosicionAsiento[] = [];
    let numeroAsientoCounter = startSeatNumber;

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
          numeroAsiento: numeroAsientoCounter++,
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
            // No hay configuración, generar una basada en la plantilla actual
            let generatedPosiciones: PosicionAsiento[] = [];
            if (selectedTemplate === 'plantilla1') {
                generatedPosiciones = generateSeatsPlantilla1(selectedBus.total_asientos, 1);
            } else if (selectedTemplate === 'plantilla2') {
                generatedPosiciones = generateSeatsPlantilla2(selectedBus.total_asientos, 1);
            } else if (selectedTemplate === 'plantilla3') {
                generatedPosiciones = generateSeatsPlantilla3(selectedBus.total_asientos, 1);
            } else {
                if (selectedBus.piso_doble) {
                    const piso1Seats = generateSeats(selectedBus.total_asientos, 1);
                    const nextSeatNumber = piso1Seats.length > 0 ? Math.max(...piso1Seats.map(p => p.numeroAsiento)) + 1 : 1;
                    generatedPosiciones = [...piso1Seats, ...generateSeats(selectedBus.total_asientos_piso2 || 0, 2, nextSeatNumber)];
                } else {
                    generatedPosiciones = generateSeats(selectedBus.total_asientos, 1);
                }
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
  }, [selectedBus, selectedTemplate]);

  // Efecto para generar asientos por defecto según la plantilla
  useEffect(() => {
    if (selectedBus && !config) {
      let generatedPosiciones: PosicionAsiento[] = [];
      
      if (selectedTemplate === 'plantilla1') {
        // Lógica para Plantilla 1: Bus de un solo piso
        generatedPosiciones = generateSeatsPlantilla1(selectedBus.total_asientos, 1);
      } else if (selectedTemplate === 'plantilla2') {
        generatedPosiciones = generateSeatsPlantilla2(selectedBus.total_asientos, 1);
      } else if (selectedTemplate === 'plantilla3') {
        generatedPosiciones = generateSeatsPlantilla3(selectedBus.total_asientos, 1);
      } else {
        // Lógica por defecto o para otras plantillas
        if (selectedBus.piso_doble) {
          const piso1Seats = generateSeats(selectedBus.total_asientos, 1);
          const nextSeatNumber = piso1Seats.length > 0 ? Math.max(...piso1Seats.map(p => p.numeroAsiento)) + 1 : 1;
          const piso2Seats = generateSeats(selectedBus.total_asientos_piso2 || 0, 2, nextSeatNumber);
          generatedPosiciones = [...piso1Seats, ...piso2Seats];
        } else {
          generatedPosiciones = generateSeats(selectedBus.total_asientos, 1);
        }
      }
      setPosiciones(generatedPosiciones);
    }
  }, [selectedTemplate, config]); // Se quita selectedBus para evitar re-generación innecesaria

  const handleAddRow = () => {
    if (!selectedBus) return;

    setPosiciones(prevPosiciones => {
      const pos = [...prevPosiciones];
      const maxFila = pos.length > 0 ? Math.max(...pos.map(p => p.fila)) : 0;
      if (maxFila === 0) return pos;

      // Lógica para agregar fila antes de la última
      if (selectedTemplate === 'plantilla1' || selectedTemplate === 'plantilla2' || selectedTemplate === 'plantilla3') {
      const lastRow = pos.filter(p => p.fila === maxFila);
        const seatsBeforeLastRow = pos.filter(p => p.fila < maxFila);
      
        let currentSeatNumber = seatsBeforeLastRow.length > 0 ? Math.max(...seatsBeforeLastRow.map(p => p.numeroAsiento)) + 1 : 1;
      const newRowFila = maxFila;
      
        // Agregar la nueva fila
        let newRowSeats: PosicionAsiento[] = [];
        if (selectedTemplate === 'plantilla2' || selectedTemplate === 'plantilla3') {
          // Para Plantilla 2 y 3, agregar solo un asiento en la nueva fila
          newRowSeats = [
            { fila: newRowFila, columna: 1, piso: 1, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: currentSeatNumber++ },
          ];
        } else {
           // Para Plantilla 1, agregar una fila completa de 4 asientos
           newRowSeats = [
            { fila: newRowFila, columna: 1, piso: 1, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: currentSeatNumber++ },
            { fila: newRowFila, columna: 2, piso: 1, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: currentSeatNumber++ },
            { fila: newRowFila, columna: 4, piso: 1, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: currentSeatNumber++ },
            { fila: newRowFila, columna: 5, piso: 1, tipoAsiento: 'NORMAL', precio: '0', numeroAsiento: currentSeatNumber++ },
      ];
        }

        // Mover la última fila hacia abajo y re-numerar sus asientos
        const updatedLastRow = lastRow
          .sort((a, b) => a.columna - b.columna)
          .map(seat => ({
        ...seat,
            fila: maxFila + 1,
            numeroAsiento: currentSeatNumber++,
      }));

        const finalPosiciones = [...seatsBeforeLastRow, ...newRowSeats, ...updatedLastRow];
        return finalPosiciones.sort((a, b) => a.numeroAsiento - b.numeroAsiento);
      }

      return pos; // No hacer nada para otras plantillas o si no hay selección
    });
  };

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

      // --- TRANSFORMACIÓN PARA EL BACKEND ---
      const posicionesParaBackend = posiciones.map(p => ({
        fila: p.fila,
        columna: p.columna,
        piso: p.piso,
        tipoAsiento: p.tipoAsiento,
        numeroAsiento: p.numeroAsiento,
        ocupado: false // por defecto
      }));

      if (config) {
        await configuracionAsientosService.update(config.id, { posiciones: posicionesParaBackend });
        setSnackbar({open: true, message: 'Configuración actualizada correctamente', severity: 'success'});
      } else {
        await configuracionAsientosService.create({ busId: selectedBus.id, posiciones: posicionesParaBackend });
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

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
              Escoja la distribución
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                row
                aria-label="plantilla"
                name="plantilla-radio-buttons-group"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}
              >
                {templates.map((template) => (
                  <Box
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    sx={{
                      border: '2px solid',
                      borderColor: selectedTemplate === template.id ? 'primary.main' : '#ddd',
                      borderRadius: 2,
                      p: 1,
                      textAlign: 'center',
                      cursor: 'pointer',
                      width: { xs: 'calc(50% - 8px)', sm: '350px' },
                      boxSizing: 'border-box'
                    }}
                  >
                    <Box
                      component="img"
                      src={template.src}
                      alt={template.label}
                      sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 1 }}
                      onClick={(e) => { e.stopPropagation(); handleImageClick(template.src); }}
                    />
                    <FormControlLabel
                      value={template.id}
                      control={<Radio />}
                      label={template.label}
                      sx={{
                        '& .MuiFormControlLabel-label': { color: '#000' },
                        pointerEvents: 'none',
                        margin: 0,
                        width: '100%'
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

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
            onAddRow={handleAddRow}
            template={selectedTemplate}
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

      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="Plantilla ampliada" style={{ width: '100%', height: 'auto' }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 