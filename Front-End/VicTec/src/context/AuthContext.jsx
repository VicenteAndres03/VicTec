import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar el usuario al inicio - SOLO UNA VEZ
  useEffect(() => {
    console.log('=== INICIALIZANDO AuthContext ===');
    
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('Token en localStorage:', storedToken ? 'Existe' : 'No existe');
        console.log('Usuario en localStorage:', storedUser ? 'Existe' : 'No existe');
        
        if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
          // Validar que el token sea un JWT válido
          try {
            const parts = storedToken.split('.');
            if (parts.length !== 3) {
              throw new Error('Token inválido');
            }
            
            const payload = JSON.parse(atob(parts[1]));
            const now = Date.now() / 1000;
            
            // Si el token expiró, limpiar todo
            if (payload.exp <= now) {
              console.warn('Token expirado, limpiando sesión');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setToken(null);
              setUser(null);
              setLoading(false);
              return;
            }
            
            // Token válido, cargar usuario
            if (storedUser && storedUser !== 'null' && storedUser !== 'undefined') {
              const parsedUser = JSON.parse(storedUser);
              console.log('Usuario cargado:', parsedUser.email);
              setToken(storedToken);
              setUser(parsedUser);
            } else {
              console.warn('Token existe pero no hay usuario, limpiando');
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
            }
          } catch (e) {
            console.error('Error al validar token:', e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } else {
          console.log('No hay token válido');
          setUser(null);
          setToken(null);
        }
      } catch (e) {
        console.error('Error al inicializar auth:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('Inicialización de AuthContext completada');
      }
    };

    initializeAuth();
  }, []); // Solo se ejecuta una vez al montar

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
      
      setToken(authToken);
      setUser(userData);
      
      console.log('Login completado exitosamente');
    } catch (e) {
      console.error('Error al guardar datos de login:', e);
      throw e;
    }
  };

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
  }, []); 

  const getAuthHeader = useCallback(() => {
    const currentToken = localStorage.getItem('token');
    
    console.log('=== getAuthHeader llamado ===');
    console.log('Token disponible:', currentToken ? 'Sí' : 'No');
    
    if (!currentToken) {
      console.warn('ADVERTENCIA: No hay token disponible');
      return {
        'Content-Type': 'application/json'
      };
    }
    
    return {
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json'
    };
  }, []);

  const isTokenValid = useCallback(() => {
    const currentToken = localStorage.getItem('token');
    
    if (!currentToken || currentToken === "null" || currentToken === "undefined") {
      console.log('No se encontró token válido.');
      return false;
    }
    
    try {
      const parts = currentToken.split('.');
      if (parts.length !== 3) {
        console.warn("Token en localStorage no es un JWT válido (formato incorrecto).");
        logout();
        return false;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;
      const isValid = payload.exp > now;
      
      console.log('=== Validación de Token ===');
      console.log('Token expira en:', new Date(payload.exp * 1000));
      console.log('Hora actual:', new Date());
      console.log('Token válido:', isValid);
      
      if (!isValid) {
        console.warn('Token expirado, limpiando sesión...');
        logout();
      }
      
      return isValid;
    } catch (e) {
      console.error('Error al validar token:', e);
      logout();
      return false;
    }
  }, [logout]);

  const value = {
    user,
    isAuthenticated: !!user && !!token,
    token, 
    login,
    logout,
    getAuthHeader,
    isTokenValid,
    loadingAuth: loading 
  };

  useEffect(() => {
    console.log('=== Estado de AuthContext ===');
    console.log('Usuario:', user ? user.email : 'No autenticado');
    console.log('Token:', token ? 'Presente' : 'Ausente');
    console.log('isAuthenticated:', !!user && !!token);
    console.log('loadingAuth:', loading);
  }, [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}