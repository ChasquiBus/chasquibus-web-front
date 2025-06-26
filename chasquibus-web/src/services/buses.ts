// src/services/buses.ts
import { Bus, CreateBusDto, UpdateBusDto } from '@/types/bus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function appendFormDataWithTypes(formData: FormData, data: any) {
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'cooperativa_id' || key === 'total_asientos') {
        formData.append(key, String(Number(value)));
      } else if (key === 'piso_doble' || key === 'activo') {
        formData.append(key, value === true || value === 'true' ? 'true' : 'false');
      } else {
        formData.append(key, value.toString());
      }
    }
  });
}

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

  async create(data: CreateBusDto, imagen?: File): Promise<Bus> {
    // Siempre usar FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    if (imagen) {
      formData.append('imagen', imagen);
    }
    // Mostrar en consola el FormData enviado
    const debugData: any = {};
    formData.forEach((value, key) => {
      debugData[key] = value;
    });
    console.log('FormData enviado al backend (create):', debugData);
    const response = await fetch(`${API_URL}/buses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });
    if (!response.ok) {
      let errorMsg = 'Error al crear el bus';
      try {
        const data = await response.json();
        if (data && data.message) {
          errorMsg = Array.isArray(data.message) ? data.message.join(' ') : data.message;
        } else if (typeof data === 'string') {
          errorMsg = data;
        }
      } catch {}
      throw new Error(errorMsg);
    }
    return response.json();
  },

  async update(id: number, data: UpdateBusDto, imagen?: File): Promise<Bus> {
    // Siempre usar FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    if (imagen) {
      formData.append('imagen', imagen);
    }
    // Mostrar en consola el FormData enviado
    const debugData: any = {};
    formData.forEach((value, key) => {
      debugData[key] = value;
    });
    console.log('FormData enviado al backend (update):', debugData);
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