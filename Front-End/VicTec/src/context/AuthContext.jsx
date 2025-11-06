import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      return null;
    }
  });

  // Cargar el usuario al inicio
  useEffect(() => {
    if (token) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error al cargar usuario:', e);
        // Limpiar datos corruptos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (userData, authToken) => {
    try {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (e) {
      console.error('Error al guardar datos de login:', e);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Error al hacer logout:', e);
    }
  };

  // Usar useCallback para evitar que getAuthHeader cambie en cada render
  const getAuthHeader = useCallback(() => {
    if (!token) {
      return {
        'Content-Type': 'application/json'
      };
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, [token]);

  const value = {
    user,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    getAuthHeader
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
