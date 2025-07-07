import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type EstadoHojaTrabajo = 'programado' | 'en curso' | 'completado' | 'suspendido' | 'cancelado';

export interface HojaTrabajo {
  id: number;
  busId: number;
  choferId: number;
  frecDiaId: number;
  observaciones?: string;
  estado: EstadoHojaTrabajo;
  horaSalidaReal?: string;
  horaLlegadaReal?: string;
  fechaSalida?: string;
}

export interface CreateHojaTrabajoManualDto {
  busId: number;
  choferId: number;
  frecDiaId: number;
  fechaSalida: string;
  observaciones?: string;
}

export interface CreateHojaTrabajoAutoDto {
  numDias: number;
  fechaInicial: string;
}

export interface UpdateHojaTrabajoDto {
  busId?: number;
  choferId?: number;
  frecDiaId?: number;
  observaciones?: string;
  estado?: EstadoHojaTrabajo;
  horaSalidaReal?: string;
  horaLlegadaReal?: string;
  fechaSalida?: string;
}

export interface HojaTrabajoDetallada {
  id: number;
  idBus: number;
  idFrecuencia: number;
  placa: string;
  imagen: string;
  piso_doble: boolean;
  total_asientos: number;
  total_asientos_piso2: number | null;
  horaSalidaProg: string;
  horaLlegadaProg: string;
  rutaId: number;
  codigo: string;
  ciudad_origen: string;
  ciudad_destino: string;
  idCooperativa: number;
  nombre_cooperativa: string;
  logo: string;
  estado: EstadoHojaTrabajo;
}

function getToken() {
  return localStorage.getItem('access_token');
}

// Crear hoja de trabajo automáticamente
export async function createHojaTrabajoAuto(data: CreateHojaTrabajoAutoDto): Promise<any> {
  const token = getToken();
  try {
    const res = await axios.post(`${API_URL}/hoja-trabajo/crear/automaticamente`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (e: any) {
    throw e;
  }
}

// Crear hoja de trabajo manualmente
export async function createHojaTrabajoManual(data: CreateHojaTrabajoManualDto): Promise<HojaTrabajo> {
  const token = getToken();
  try {
    const res = await axios.post(`${API_URL}/hoja-trabajo/crear/manualmente`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data as HojaTrabajo;
  } catch (e: any) {
    throw e;
  }
}

// Actualizar hoja de trabajo
export async function updateHojaTrabajo(id: number, data: UpdateHojaTrabajoDto): Promise<HojaTrabajo> {
  const token = getToken();
  try {
    const res = await axios.patch(`${API_URL}/hoja-trabajo/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data as HojaTrabajo;
  } catch (e: any) {
    throw e;
  }
}

// Eliminar hoja de trabajo
export async function deleteHojaTrabajo(id: number): Promise<void> {
  const token = getToken();
  try {
    await axios.delete(`${API_URL}/hoja-trabajo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e: any) {
    throw e;
  }
}

// Listar hojas de trabajo de la cooperativa
export async function getHojasTrabajoCooperativa(): Promise<HojaTrabajoDetallada[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/hoja-trabajo/cooperativa/mis-hojas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data as HojaTrabajoDetallada[];
}

// Los siguientes métodos NO están permitidos para ADMIN/OFICINISTA y se comentan para evitar su uso:
// export async function getHojasTrabajoViajes(estado?: EstadoHojaTrabajo): Promise<HojaTrabajo[]> { ... }
// export async function getHojaTrabajoById(id: number): Promise<HojaTrabajo> { ... }
// export async function getHojasTrabajoByEstado(estado: EstadoHojaTrabajo): Promise<HojaTrabajo[]> { ... }
// export async function getHojasTrabajoChofer(): Promise<HojaTrabajo[]> { ... } 