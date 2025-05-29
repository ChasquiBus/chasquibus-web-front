import { Bus, CreateBusDto, UpdateBusDto } from '@/types/bus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const busesService = {
  async getAll(): Promise<Bus[]> {
    const response = await fetch(`${API_URL}/buses`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('Error al obtener los buses');
    return response.json();
  },

  async getOne(id: number): Promise<Bus> {
    const response = await fetch(`${API_URL}/buses/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('Error al obtener el bus');
    return response.json();
  },

  async create(data: CreateBusDto): Promise<Bus> {
    const formData = new FormData();
    
    // Agregar campos del formulario
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'imagen' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_URL}/buses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Error al crear el bus');
    return response.json();
  },

  async update(id: number, data: UpdateBusDto): Promise<Bus> {
    const formData = new FormData();
    
    // Agregar campos del formulario
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'imagen' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_URL}/buses/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Error al actualizar el bus');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/buses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('Error al eliminar el bus');
  },
}; 