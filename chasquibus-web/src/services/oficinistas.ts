import axios from 'axios';
import { Oficinista, CreateOficinistaDto, UpdateOficinistaDto } from '@/types/oficinista';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const oficinistasService = {
  // Obtener todos los oficinistas de la cooperativa
  getAllOficinistas: async (token: string): Promise<Oficinista[]> => {
    const response = await axios.get<Oficinista[]>(`${API_URL}/admin-cooperativas/obtener-oficinistas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Obtener un oficinista por ID
  getOficinistaById: async (id: number, token: string): Promise<Oficinista> => {
    const response = await axios.get<Oficinista>(`${API_URL}/admin-cooperativas/obtener-oficinistas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Crear oficinista
  createOficinista: async (data: CreateOficinistaDto, token: string): Promise<Oficinista> => {
    const response = await axios.post<Oficinista>(`${API_URL}/admin-cooperativas/crear-oficinista-coop`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Editar oficinista
  updateOficinista: async (id: number, data: UpdateOficinistaDto, token: string): Promise<Oficinista> => {
    const response = await axios.patch<Oficinista>(`${API_URL}/admin-cooperativas/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Eliminar oficinista
  deleteOficinista: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/admin-cooperativas/oficinista/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
}; 