import React, { useEffect, useState } from "react";
import { Box, Typography, Stepper, Step, StepLabel, Button, TextField, MenuItem, CircularProgress, Autocomplete } from "@mui/material";
import { Ruta, getRutas } from '@/services/rutas';
import { busesService } from '@/services/buses';
import { Bus } from '@/types/bus';
import { Parada, getParadas } from '@/services/paradas';
import { getHojasTrabajoCooperativa, HojaTrabajoDetallada } from '@/services/hojaTrabajo';
import { configuracionAsientosService, PosicionAsiento } from '@/services/configuracionAsientos';
import SeleccionAsientosGrid from '@/components/ventas/SeleccionAsientosGrid';
import { getTarifasParadasByRutaId, TarifaParada } from '@/services/tarifasParadas';
import { getAllDescuentos, Descuento } from '@/services/descuentos';
import { createVentaPresencial } from '@/services/ventas';
import ModalPasajero from './ModalPasajero';
import ConfirmDialog from '../resoluciones/ConfirmDialog';

const steps = [
  "Selecciona Ruta",
  "Selecciona Hoja de Trabajo",
  "Selecciona Asientos",
  "Datos de Pasajeros",
  "Resumen y Confirmación"
];

// Extiende el tipo para incluir 'ocupado' en el contexto local
type PosicionAsientoConOcupado = PosicionAsiento & { ocupado?: boolean };

interface VentaPresencialModalProps {
  onVentaExitosa?: () => void;
}

const VentaPresencialModal: React.FC<VentaPresencialModalProps> = ({ onVentaExitosa }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  // Paso 1: rutas
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<Ruta | null>(null);
  const [loadingRutas, setLoadingRutas] = useState(false);
  const [loadingParadas, setLoadingParadas] = useState(false);

  // Paso 2: hoja de trabajo
  const [hojasTrabajo, setHojasTrabajo] = useState<HojaTrabajoDetallada[]>([]);
  const [loadingHojas, setLoadingHojas] = useState(false);
  const [hojaSeleccionada, setHojaSeleccionada] = useState<HojaTrabajoDetallada | null>(null);

  // Paso 3: asientos
  const [configAsientos, setConfigAsientos] = useState<PosicionAsiento[]>([]);
  const [loadingAsientos, setLoadingAsientos] = useState(false);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<PosicionAsiento[]>([]);
  const [busDeHoja, setBusDeHoja] = useState<Bus | null>(null);

  // Paso 4: tarifas y descuentos
  const [tarifas, setTarifas] = useState<TarifaParada[]>([]);
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [boletos, setBoletos] = useState<Record<string, any>>({});
  // Estado para modal de pasajero
  const [modalOpen, setModalOpen] = useState(false);
  const [asientoEditando, setAsientoEditando] = useState<any>(null);

  // Paso 5: Resumen y confirmación
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [errorVenta, setErrorVenta] = useState<string | null>(null);
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [idConfigAsientos, setIdConfigAsientos] = useState<number | null>(null);
  // Guardar la configuración original para actualizarla tras la venta
  const [configAsientosOriginal, setConfigAsientosOriginal] = useState<PosicionAsiento[]>([]);

  // Declarar formulariosCompletos aquí para que esté disponible
  const formulariosCompletos =
    Object.keys(boletos).length === asientosSeleccionados.length &&
    asientosSeleccionados.every(asiento => {
      const key = `p${asiento.piso}-f${asiento.fila}-c${asiento.columna}-n${asiento.numeroAsiento}`;
      const b = boletos[key];
      return b && b.nombre && b.apellido && b.cedula && b.tarifaId;
    });

  // Estado para el diálogo de confirmación de cancelación
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);

  useEffect(() => {
    setLoadingRutas(true);
    getRutas().then(data => setRutas(data)).finally(() => setLoadingRutas(false));
    setLoadingParadas(true);
    getParadas().then(data => setParadas(data)).finally(() => setLoadingParadas(false));
  }, []);

  // Cargar hojas de trabajo cuando se selecciona ruta
  useEffect(() => {
    if (activeStep === 1 && rutaSeleccionada) {
      setLoadingHojas(true);
      getHojasTrabajoCooperativa()
        .then(data => setHojasTrabajo(data))
        .finally(() => setLoadingHojas(false));
    }
  }, [activeStep, rutaSeleccionada]);

  // Cuando se selecciona hoja de trabajo, obtener el bus correspondiente
  useEffect(() => {
    if (activeStep === 2 && hojaSeleccionada) {
      busesService.getOne(hojaSeleccionada.idBus).then(setBusDeHoja);
    }
  }, [activeStep, hojaSeleccionada]);

  // Cargar configuración de asientos cuando se selecciona hoja de trabajo
  useEffect(() => {
    if (activeStep === 2 && hojaSeleccionada) {
      setLoadingAsientos(true);
      configuracionAsientosService.getByBusId(hojaSeleccionada.idBus)
        .then(data => {
          if (data && data.posicionesJson) {
            setConfigAsientos(JSON.parse(data.posicionesJson));
            setConfigAsientosOriginal(JSON.parse(data.posicionesJson));
            setIdConfigAsientos(data.id);
          } else {
            setConfigAsientos([]);
            setConfigAsientosOriginal([]);
            setIdConfigAsientos(null);
          }
        })
        .finally(() => setLoadingAsientos(false));
    }
  }, [activeStep, hojaSeleccionada]);

  // Traer tarifas y descuentos al entrar al paso 4
  useEffect(() => {
    if (activeStep === 3 && rutaSeleccionada) {
      getTarifasParadasByRutaId(rutaSeleccionada.id).then(setTarifas);
      getAllDescuentos().then(setDescuentos);
    }
  }, [activeStep, rutaSeleccionada]);

  // Sincroniza el objeto de boletos con los asientos seleccionados
  useEffect(() => {
    setBoletos(prev => {
      const nuevos = { ...prev };
      // Agrega un objeto vacío solo si no existe para ese asiento
      asientosSeleccionados.forEach(asiento => {
        const key = `p${asiento.piso}-f${asiento.fila}-c${asiento.columna}-n${asiento.numeroAsiento}`;
        if (!Object.prototype.hasOwnProperty.call(nuevos, key)) nuevos[key] = {};
      });
      // Elimina boletos de asientos que ya no están seleccionados
      Object.keys(nuevos).forEach(key => {
        const existe = asientosSeleccionados.some(asiento => key === `p${asiento.piso}-f${asiento.fila}-c${asiento.columna}-n${asiento.numeroAsiento}`);
        if (!existe) delete nuevos[key];
      });
      return nuevos;
    });
  }, [JSON.stringify(asientosSeleccionados)]);

  // Función para obtener el nombre de la parada por ID
  const getNombreParada = (id: number) => paradas.find(p => p.id === id)?.nombreParada || id;

  // Filtrar hojas de trabajo por ruta seleccionada
  const hojasFiltradas = hojasTrabajo.filter(h =>
    h.rutaId === rutaSeleccionada?.id && (h.estado === 'programado' || h.estado === 'en curso')
  );

  // Handler para seleccionar/deseleccionar asientos
  const handleSelectAsiento = (asiento: PosicionAsiento) => {
    const key = (a: PosicionAsiento) => `${a.fila}-${a.columna}-${a.piso}`;
    if (asientosSeleccionados.some(a => key(a) === key(asiento))) {
      setAsientosSeleccionados(asientosSeleccionados.filter(a => key(a) !== key(asiento)));
    } else {
      setAsientosSeleccionados([...asientosSeleccionados, asiento]);
    }
  };

  // Paso 5: Resumen y confirmación
  const totalGeneral = Object.values(boletos).reduce((acc, b) => acc + Number(b.totalPorPer || 0), 0);

  async function handleConfirmarVenta() {
    setLoadingVenta(true);
    setErrorVenta(null);
    try {
      if (!hojaSeleccionada) throw new Error('No hay hoja de trabajo seleccionada');
      // Preparar posiciones ocupadas SOLO para la venta
      const posiciones = asientosSeleccionados.map(a => ({
        fila: a.fila,
        columna: a.columna,
        piso: a.piso,
        tipoAsiento: a.tipoAsiento,
        numeroAsiento: a.numeroAsiento,
        ocupado: true
      }));
      // Preparar objeto para API
      const venta = {
        hojaTrabajoId: hojaSeleccionada.id,
        busId: hojaSeleccionada.idBus,
        boletos: asientosSeleccionados.map(asiento => {
          const key = `p${asiento.piso}-f${asiento.fila}-c${asiento.columna}-n${asiento.numeroAsiento}`;
          return boletos[key];
        }),
        posiciones
      };
      await createVentaPresencial(venta);
      setVentaExitosa(true);
      if (onVentaExitosa) onVentaExitosa();
      // --- ACTUALIZAR CONFIGURACIÓN GENERAL DE ASIENTOS ---
      if (idConfigAsientos && configAsientosOriginal.length > 0) {
        const nuevaConfig = (configAsientosOriginal as PosicionAsientoConOcupado[]).map(asiento => {
          const vendido = asientosSeleccionados.some(sel =>
            sel.fila === asiento.fila &&
            sel.columna === asiento.columna &&
            sel.piso === asiento.piso
          );
          return { ...asiento, ocupado: vendido ? true : asiento.ocupado };
        });
        await configuracionAsientosService.update(idConfigAsientos, { posiciones: nuevaConfig });
      }
    } catch (e: any) {
      setErrorVenta(e?.message || 'Error al registrar la venta');
    } finally {
      setLoadingVenta(false);
    }
  }

  return (
    <Box sx={{ p: 3, minHeight: 500 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* Paso 1: Selección de ruta */}
      {activeStep === 0 && (
        <Box sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#000' }}>Selecciona la ruta</Typography>
          {loadingRutas || loadingParadas ? <CircularProgress size={28} /> : (
            <Autocomplete
              options={rutas}
              getOptionLabel={option => `${getNombreParada(option.paradaOrigenId)} → ${getNombreParada(option.paradaDestinoId)}`}
              value={rutaSeleccionada}
              onChange={(_, value) => { setRutaSeleccionada(value); setHojaSeleccionada(null); setBusDeHoja(null); }}
              renderInput={params => <TextField {...params} label="Ruta" variant="outlined" fullWidth />}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
            />
          )}
        </Box>
      )}
      {/* Paso 2: Selección de hoja de trabajo */}
      {activeStep === 1 && (
        <Box sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#000' }}>Selecciona la hoja de trabajo</Typography>
          {loadingHojas ? <CircularProgress size={28} /> : (
            <Autocomplete
              options={hojasFiltradas}
              getOptionLabel={option => `${option.codigo} - ${option.horaSalidaProg} (${option.estado})`}
              value={hojaSeleccionada}
              onChange={(_, value) => { setHojaSeleccionada(value); setBusDeHoja(null); }}
              renderInput={params => <TextField {...params} label="Hoja de trabajo" variant="outlined" fullWidth />}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              disabled={hojasFiltradas.length === 0}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.codigo} - {option.horaSalidaProg} ({option.estado})
                </li>
              )}
            />
          )}
        </Box>
      )}
      {/* Paso 3: Selección de asientos */}
      {activeStep === 2 && busDeHoja && (
        <Box sx={{ maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#000', textAlign: 'center' }}>Selecciona los asientos</Typography>
          {loadingAsientos ? <CircularProgress size={28} /> : (
            <SeleccionAsientosGrid
              posiciones={configAsientos}
              asientosSeleccionados={asientosSeleccionados}
              setAsientosSeleccionados={setAsientosSeleccionados}
              pisosDisponibles={busDeHoja.piso_doble ? [1,2] : [1]}
            />
          )}
        </Box>
      )}
      {/* Paso 4: Datos de pasajeros (nuevo resumen + modal) */}
      {activeStep === 3 && (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>Datos de los pasajeros</Typography>
          {asientosSeleccionados.length === 0 && (
            <Typography variant="body2">Selecciona al menos un asiento.</Typography>
          )}
          {asientosSeleccionados.map(asiento => {
            const key = `p${asiento.piso}-f${asiento.fila}-c${asiento.columna}-n${asiento.numeroAsiento}`;
            const datos = boletos[key] || {};
            const tieneDatos = datos.nombre && datos.apellido && datos.cedula && datos.tarifaId;
            return (
              <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#f7f7f7' }}>
                <Typography variant="subtitle1" sx={{ color: '#000' }}>Asiento {asiento.numeroAsiento}</Typography>
                <Typography variant="body2" sx={{ color: datos.nombre ? '#000' : '#888' }}>Nombre: {datos.nombre || 'Sin datos'}</Typography>
                <Typography variant="body2" sx={{ color: datos.apellido ? '#000' : '#888' }}>Apellido: {datos.apellido || 'Sin datos'}</Typography>
                <Typography variant="body2" sx={{ color: datos.cedula ? '#000' : '#888' }}>Cédula: {datos.cedula || 'Sin datos'}</Typography>
                <Typography variant="body2" sx={{ color: datos.tarifaId ? '#000' : '#888' }}>Tarifa: {datos.tarifaId ? `$${tarifas.find(t=>t.id===datos.tarifaId)?.valor}` : 'Sin datos'}</Typography>
                <Typography variant="body2" sx={{ color: datos.descuentoId ? '#000' : '#888' }}>Descuento: {datos.descuentoId ? `${(Number(descuentos.find(d=>d.id===datos.descuentoId)?.porcentaje)*100).toFixed(0)}%` : 'Sin descuento'}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => { setAsientoEditando({ ...asiento }); setModalOpen(true); }}
                >
                  {tieneDatos ? 'Editar datos' : 'Ingresar datos'}
                </Button>
              </Box>
            );
          })}
          {/* Modal para editar datos de pasajero */}
          {asientoEditando && (
            <ModalPasajero
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSave={val => {
                const key = `p${asientoEditando.piso}-f${asientoEditando.fila}-c${asientoEditando.columna}-n${asientoEditando.numeroAsiento}`;
                setBoletos(prev => ({ ...prev, [key]: val }));
              }}
              value={boletos[`p${asientoEditando.piso}-f${asientoEditando.fila}-c${asientoEditando.columna}-n${asientoEditando.numeroAsiento}`] || {}}
              tarifas={tarifas}
              descuentos={descuentos}
              asientoNumero={asientoEditando.numeroAsiento}
            />
          )}
        </Box>
      )}
      {/* Paso 5: Resumen y confirmación */}
      {activeStep === 4 && (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>Resumen y confirmación</Typography>
          {asientosSeleccionados.map(asiento => {
            const key = `p${asiento.piso}-f${asiento.fila}-c${asiento.columna}-n${asiento.numeroAsiento}`;
            const boleto = boletos[key] || {};
            return (
              <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#000' }}>Asiento {boleto.asientoNumero}</Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>Nombre: {boleto.nombre}</Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>Apellido: {boleto.apellido}</Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>Cédula: {boleto.cedula}</Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>Tarifa: ${boleto.totalSinDescPorPers}</Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>Descuento: -${boleto.totalDescPorPers}</Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>Total: ${boleto.totalPorPer}</Typography>
              </Box>
            );
          })}
          <Box sx={{ mt: 2, p: 2, borderTop: '1px solid #ccc' }}>
            <Typography variant="h6" sx={{ color: '#000' }}>Total a pagar: ${totalGeneral.toFixed(2)}</Typography>
          </Box>
          {errorVenta && <Typography color="error" sx={{ mt: 2, color: '#000' }}>{errorVenta}</Typography>}
          {ventaExitosa && <Typography color="success.main" sx={{ mt: 2, color: '#000' }}>¡Venta registrada exitosamente!</Typography>}
        </Box>
      )}
      {/* Botones de navegación al final, fuera de DialogActions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={() => setOpenConfirmCancel(true)} color="secondary" disabled={loadingVenta}>Cancelar</Button>
        {activeStep > 0 && <Button onClick={() => setActiveStep(s => s - 1)} disabled={loadingVenta}>Atrás</Button>}
        {activeStep < steps.length - 1 && <Button variant="contained" onClick={() => setActiveStep(s => s + 1)} disabled={
          (activeStep === 0 && !rutaSeleccionada) ||
          (activeStep === 1 && !hojaSeleccionada) ||
          (activeStep === 2 && asientosSeleccionados.length === 0) ||
          (activeStep === 3 && !formulariosCompletos)
        }>Siguiente</Button>}
        {activeStep === steps.length - 1 &&
          <Button variant="contained" color="primary" onClick={handleConfirmarVenta} disabled={loadingVenta || ventaExitosa}>
            {loadingVenta ? 'Procesando...' : 'Confirmar venta'}
          </Button>
        }
        {/* Confirmación de cancelación */}
        <ConfirmDialog
          open={openConfirmCancel}
          message="¿Seguro que deseas cancelar la venta?"
          onConfirm={() => { setOpenConfirmCancel(false); window.location.reload(); }}
          onCancel={() => setOpenConfirmCancel(false)}
        />
      </Box>
    </Box>
  );
};

export default VentaPresencialModal; 