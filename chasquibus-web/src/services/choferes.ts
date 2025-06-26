import axios from 'axios';
import { Chofer, CreateChoferDto, UpdateChoferDto } from '@/types/chofer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const choferesService = {
  getAllChoferes: async (cooperativaId: number, token: string): Promise<Chofer[]> => {
    const response = await axios.get(`${API_URL}/choferes?includeDeleted=${cooperativaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as Chofer[];
  },

  createChofer: async (choferData: CreateChoferDto, token: string): Promise<Chofer> => {
    const { cooperativaTransporteId, ...rest } = choferData;
    const response = await axios.post(`${API_URL}/choferes`, rest, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data as Chofer;
  },

  updateChofer: async (id: number, choferData: UpdateChoferDto, token: string): Promise<Chofer> => {
    const response = await axios.patch(`${API_URL}/choferes/${id}`, choferData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data as Chofer;
  },

  deleteChofer: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/choferes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
}; 