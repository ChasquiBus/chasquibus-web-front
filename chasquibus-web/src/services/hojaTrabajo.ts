import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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

export interface CreateHojaTrabajoDto {
  busId: number;
  choferId: number;
  frecDiaId: number;
  observaciones?: string;
  estado: EstadoHojaTrabajo;
  horaSalidaReal?: string;
  horaLlegadaReal?: string;
  fechaSalida?: string;
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

function getToken() {
  return localStorage.getItem('access_token');
}

export async function createHojaTrabajo(data: CreateHojaTrabajoDto): Promise<HojaTrabajo> {
  const token = getToken();
  try {
    const res = await axios.post(`${API_URL}/hoja-trabajo`, data, {
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

export async function getHojasTrabajoViajes(estado?: EstadoHojaTrabajo): Promise<HojaTrabajo[]> {
  const token = getToken();
  const params = estado ? { estado } : {};
  const res = await axios.get(`${API_URL}/hoja-trabajo/viajes`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as HojaTrabajo[];
}

export async function getHojaTrabajoById(id: number): Promise<HojaTrabajo> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/hoja-trabajo/viaje/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as HojaTrabajo;
}

export async function getHojasTrabajoByEstado(estado: EstadoHojaTrabajo): Promise<HojaTrabajo[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/hoja-trabajo/estado/${estado}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as HojaTrabajo[];
}

export async function getHojasTrabajoCooperativa(): Promise<HojaTrabajo[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/hoja-trabajo/cooperativa/mis-hojas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as HojaTrabajo[];
}

export async function getHojasTrabajoChofer(): Promise<HojaTrabajo[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/hoja-trabajo/chofer/mis-programadas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as HojaTrabajo[];
} 