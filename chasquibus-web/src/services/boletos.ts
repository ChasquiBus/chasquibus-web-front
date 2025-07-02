import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Boleto {
  id: number;
  ventaId: number;
  tarifaId: number;
  descuentoId: number | null;
  asientoNumero: number;
  codigoQr: string | null;
  cedula: string;
  nombre: string;
  apellido: string;
  totalSinDescPorPers: string;
  totalDescPorPers: string;
  totalPorPer: string;
}

function getToken() {
  return localStorage.getItem('access_token');
}

export async function getAllBoletos(): Promise<Boleto[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/boletos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
} 