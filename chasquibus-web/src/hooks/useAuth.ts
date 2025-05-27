"use client";
import { useState, useEffect } from 'react';
import { AuthState } from '@/types/auth';
import { login as apiLogin, logout as apiLogout } from '@/lib/api';

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  useEffect(() => {
    // Solo ejecutamos en el cliente
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setAuth({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        setAuth({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuth((prev) => ({ ...prev, isLoading: true }));
    try {
      const { access_token, user } = await apiLogin({ email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      setAuth({ user, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
      return { success: false, user: null };
    }
  };

  const logout = async () => {
    await apiLogout();
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
  };

  return {
    auth,
    setAuth,
    login,
    logout,
  };
}