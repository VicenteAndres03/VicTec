import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      const storedToken = localStorage.getItem('token');
      console.log('=== INICIALIZANDO AuthContext ===');
      console.log('Token inicial en localStorage:', storedToken ? 'Existe' : 'No existe');
      return storedToken;
    } catch (e) {
      console.error('Error al leer token inicial:', e);
      return null;
    }
  });

  // Cargar el usuario al inicio
  useEffect(() => {
    console.log('=== useEffect AuthContext - Cargando usuario ===');
    console.log('Token actual:', token ? 'Existe' : 'No existe');
    
    if (token) {
      try {
        const storedUser = localStorage.getItem('user');
        console.log('Usuario en localStorage:', storedUser ? 'Existe' : 'No existe');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Usuario parseado:', parsedUser);
          setUser(parsedUser);
        } else {
          console.warn('Token existe pero no hay usuario en localStorage');
          // Si hay token pero no usuario, limpiar todo
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (e) {
        console.error('Error al cargar usuario:', e);
        // Limpiar datos corruptos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
      }
    } else {
      console.log('No hay token, limpiando usuario');
      setUser(null);
    }
  }, [token]);

  const login = (userData, authToken) => {
    try {
      console.log('=== FUNCIÓN LOGIN ===');
      console.log('userData recibida:', userData);
      console.log('Token recibido:', authToken ? 'Existe' : 'No existe');
      
      if (!authToken) {
        console.error('ERROR: No se proporcionó token en login');
        throw new Error('Token no proporcionado');
      }
      
      if (!userData) {
        console.error('ERROR: No se proporcionó userData en login');
        throw new Error('Datos de usuario no proporcionados');
      }
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Verificar que se guardó correctamente
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      console.log('Token guardado:', savedToken ? 'Sí' : 'No');
      console.log('Usuario guardado:', savedUser ? 'Sí' : 'No');
      
      setToken(authToken);
      setUser(userData);
      
      console.log('Login completado exitosamente');
    } catch (e) {
      console.error('Error al guardar datos de login:', e);
      throw e;
    }
  };

  // --- INICIO DE CAMBIO EN LOGOUT ---
  // Hacemos que logout sea un useCallback para que isTokenValid pueda depender de él
  const logout = useCallback(() => {
    try {
      console.log('=== FUNCIÓN LOGOUT ===');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      console.log('Logout completado');
    } catch (e) {
      console.error('Error al hacer logout:', e);
    }
  }, []); // Logout no tiene dependencias
  // --- FIN DE CAMBIO EN LOGOUT ---

  // Usar useCallback para evitar que getAuthHeader cambie en cada render
  const getAuthHeader = useCallback(() => {
    // Leer directamente de localStorage para asegurar que tenemos el valor más reciente
    const currentToken = localStorage.getItem('token');
    
    console.log('=== getAuthHeader llamado ===');
    console.log('Token de state:', token ? 'Existe' : 'No existe');
    console.log('Token de localStorage:', currentToken ? 'Existe' : 'No existe');
    
    if (!currentToken) {
      console.warn('ADVERTENCIA: No hay token disponible');
      return {
        'Content-Type': 'application/json'
      };
    }
    
    const headers = {
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json'
    };
    
    console.log('Headers generados:', {
      ...headers,
      'Authorization': headers.Authorization.substring(0, 20) + '...' // Log parcial por seguridad
    });
    
    return headers;
  }, [token]); // Dependencia: token

  // --- INICIO DE CAMBIO EN ISTOKENVALID ---
  // Función para verificar si el token es válido (sin hacer request al backend)
  const isTokenValid = useCallback(() => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return false;
    
    try {
      // Decodificar el payload del JWT (parte central entre los puntos)
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      
      // Verificar si el token expiró
      const now = Date.now() / 1000; // Convertir a segundos
      const isValid = payload.exp > now;
      
      console.log('=== Validación de Token ===');
      console.log('Token expira en:', new Date(payload.exp * 1000));
      console.log('Hora actual:', new Date());
      console.log('Token válido:', isValid);
      
      if (!isValid) {
        console.warn('Token expirado, limpiando sesión...');
        logout(); // Llama a la función logout memorizada
      }
      
      return isValid;
    } catch (e) {
      console.error('Error al validar token:', e);
      logout(); // Llama a logout si el token está corrupto
      return false;
    }
  }, [logout]); // ¡Añadimos logout como dependencia!
  // --- FIN DE CAMBIO EN ISTOKENVALID ---

  const value = {
    user,
    isAuthenticated: !!user && !!token,
    token, // Exponemos el token también
    login,
    logout,
    getAuthHeader,
    isTokenValid
  };

  // Log del estado actual cuando cambia
  useEffect(() => {
    console.log('=== Estado de AuthContext actualizado ===');
    console.log('Usuario:', user ? user.email : 'No autenticado');
    console.log('Token:', token ? 'Presente' : 'Ausente');
    console.log('isAuthenticated:', !!user && !!token);
  }, [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}