import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface PosicionPresencial {
  fila: number;
  columna: number;
  piso: number;
  tipoAsiento: string;
  numeroAsiento: number;
  ocupado: boolean;
}

export interface BoletoPresencial {
  asientoNumero: number;
  tarifaId: number;
  descuentoId?: number | null;
  cedula?: string;
  nombre?: string;
  apellido?: string;
  totalSinDescPorPers: string;
  totalDescPorPers: string;
  totalPorPer: string;
}

export interface CreateVentaPresencialDto {
  hojaTrabajoId: number;
  busId: number;
  boletos: BoletoPresencial[];
  posiciones: PosicionPresencial[];
}

function getToken() {
  return localStorage.getItem('access_token');
}

export async function createVentaPresencial(data: CreateVentaPresencialDto): Promise<any> {
  const token = getToken();
  const res = await axios.post(`${API_URL}/ventas/presencial`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
} 