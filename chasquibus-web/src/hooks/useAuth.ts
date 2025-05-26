"use client";
import { useState } from 'react';
import { AuthState, User } from '@/types/auth';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_USER: User = {
  id: '1',
  email: ADMIN_EMAIL,
  name: 'Administrador Principal',
  role: 'admin',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
};

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string) => {
    setAuth((prev) => ({ ...prev, isLoading: true }));
    if (email === ADMIN_EMAIL) {
      setAuth({ user: ADMIN_USER, isAuthenticated: true, isLoading: false });
      return true;
    }
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
    return false;
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
  };

  return {
    auth,
    setAuth,
    login,
    logout,
  };
} 