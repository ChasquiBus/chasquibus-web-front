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

  // Paso 5: Resumen y confirmación
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [errorVenta, setErrorVenta] = useState<string | null>(null);
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [idConfigAsientos, setIdConfigAsientos] = useState<number | null>(null);
  // Guardar la configuración original para actualizarla tras la venta
  const [configAsientosOriginal, setConfigAsientosOriginal] = useState<PosicionAsiento[]>([]);

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

  // Componente interno para formulario de pasajero
  interface FormularioPasajeroProps {
    asiento: any;
    value: any;
    onChange: (val: any) => void;
    tarifas: TarifaParada[];
    descuentos: Descuento[];
  }
  function FormularioPasajero({ asiento, value, onChange, tarifas, descuentos }: FormularioPasajeroProps) {
    // Calcular tarifa seleccionada
    const tarifa = tarifas.find(t => t.id === value.tarifaId);
    const valorTarifa = tarifa ? Number(tarifa.valor) : 0;
    // Calcular descuento seleccionado
    const descuento = descuentos.find(d => d.id === value.descuentoId);
    const porcentajeDesc = descuento ? Number(descuento.porcentaje) : 0;
    // Cálculos
    const totalSinDesc = valorTarifa;
    const totalDesc = porcentajeDesc ? (valorTarifa * porcentajeDesc) : 0;
    const totalFinal = valorTarifa - totalDesc;
    return (
      <Box sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ color: '#000' }}>Asiento {asiento.numeroAsiento}</Typography>
        <TextField
          label="Nombre"
          value={value.nombre || ''}
          onChange={e => onChange({ ...value, nombre: e.target.value })}
          fullWidth sx={{ mb: 1 }}
        />
        <TextField
          label="Cédula"
          value={value.cedula || ''}
          onChange={e => onChange({ ...value, cedula: e.target.value })}
          fullWidth sx={{ mb: 1 }}
        />
        <TextField
          select
          label="Tarifa"
          value={value.tarifaId || ''}
          onChange={e => onChange({ ...value, tarifaId: e.target.value })}
          fullWidth sx={{ mb: 1 }}
        >
          {tarifas.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.tipoAsiento || 'General'} - ${t.valor}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Descuento"
          value={value.descuentoId || ''}
          onChange={e => onChange({ ...value, descuentoId: e.target.value })}
          fullWidth sx={{ mb: 1 }}
        >
          <MenuItem value="">Sin descuento</MenuItem>
          {descuentos.map(d => (
            <MenuItem key={d.id} value={d.id}>{d.tipoDescuento} - {(Number(d.porcentaje) * 100).toFixed(0)}%</MenuItem>
          ))}
        </TextField>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: '#000' }}>Total sin descuento: ${totalSinDesc.toFixed(2)}</Typography>
          <Typography variant="body2" sx={{ color: '#000' }}>Descuento: -${totalDesc.toFixed(2)}</Typography>
          <Typography variant="subtitle2" sx={{ color: '#000' }}>Total a pagar: ${totalFinal.toFixed(2)}</Typography>
        </Box>
      </Box>
    );
  }

  const formulariosCompletos =
    Object.keys(boletos).length === asientosSeleccionados.length &&
    asientosSeleccionados.every(asiento => {
      const key = `p${asiento.piso}-f${asiento.fila}-c${asiento.columna}-n${asiento.numeroAsiento}`;
      const b = boletos[key];
      return b && b.nombre && b.cedula && b.tarifaId;
    });

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
      {/* Paso 4: Datos de pasajeros */}
      {activeStep === 3 && (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>Datos de los pasajeros</Typography>
          {asientosSeleccionados.map(asiento => {
            const key = `p${asiento.piso}-f${asiento.fila}-c${asiento.columna}-n${asiento.numeroAsiento}`;
            return (
              <FormularioPasajero
                key={key}
                asiento={asiento}
                value={boletos[key] || {}}
                onChange={val => {
                  setBoletos(prev => {
                    // Solo actualiza el campo editado, no reemplaces el objeto completo
                    const nuevos = { ...prev };
                    const actual = { ...nuevos[key], ...val };
                    // Calcular totales
                    const tarifa = tarifas.find(t => t.id === actual.tarifaId);
                    const valorTarifa = tarifa ? Number(tarifa.valor) : 0;
                    const descuento = descuentos.find(d => d.id === actual.descuentoId);
                    const porcentajeDesc = descuento ? Number(descuento.porcentaje) : 0;
                    const totalSinDescPorPers = valorTarifa.toFixed(2);
                    const totalDescPorPers = (valorTarifa * porcentajeDesc).toFixed(2);
                    const totalPorPer = (valorTarifa - (valorTarifa * porcentajeDesc)).toFixed(2);
                    nuevos[key] = {
                      ...actual,
                      asientoNumero: asiento.numeroAsiento,
                      totalSinDescPorPers,
                      totalDescPorPers,
                      totalPorPer,
                    };
                    return nuevos;
                  });
                }}
                tarifas={tarifas}
                descuentos={descuentos}
              />
            );
          })}
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
        <Button onClick={() => window.confirm('¿Seguro que deseas cancelar la venta?') && window.location.reload()} color="secondary" disabled={loadingVenta}>Cancelar</Button>
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
      </Box>
    </Box>
  );
};

export default VentaPresencialModal; 