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
    if (!imagen) {
      // Mostrar en consola el JSON enviado
      console.log('JSON enviado al backend (create):', data);
      const response = await fetch(`${API_URL}/buses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear el bus');
      return response.json();
    } else {
      // Si hay imagen, usar FormData y enviar la imagen como archivo
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      formData.append('imagen', imagen); // Solo archivo, nunca string/base64
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
      if (!response.ok) throw new Error('Error al crear el bus');
      return response.json();
    }
  },

  async update(id: number, data: UpdateBusDto, imagen?: File): Promise<Bus> {
    if (!imagen) {
      // Mostrar en consola el JSON enviado
      console.log('JSON enviado al backend (update):', data);
      const response = await fetch(`${API_URL}/buses/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar el bus');
      return response.json();
    } else {
      // Si hay imagen, usar FormData y enviar la imagen como archivo
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      formData.append('imagen', imagen); // Solo archivo, nunca string/base64
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
    }
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