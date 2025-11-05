import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Creamos el Contexto
const AuthContext = createContext(null);

// 2. Creamos el "Proveedor" (el componente que envuelve la app)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // 'user' será null si no está logueado
  const navigate = useNavigate();

  // Función para iniciar sesión (simulada)
  const login = (userData) => {
    console.log("Iniciando sesión como:", userData);
    setUser(userData); // Guardamos los datos del usuario en el estado
    navigate('/'); // Redirigimos al Inicio
  };

  // Función para cerrar sesión
  const logout = () => {
    console.log("Cerrando sesión...");
    setUser(null); // Borramos al usuario del estado
    navigate('/'); // Redirigimos al Inicio
  };

  // Valor que compartiremos con toda la app
  const value = {
    user, // El objeto del usuario (o null)
    isAuthenticated: !!user, // Booleano (true si hay usuario, false si es null)
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Creamos un "Hook" personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}