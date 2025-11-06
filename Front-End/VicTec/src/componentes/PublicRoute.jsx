import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PublicRoute() {
  const { isAuthenticated, loadingAuth, token } = useAuth();
  const navigate = useNavigate();

  // PRIMERO: Verificar si volvemos de un pago (ANTES de cualquier otra verificación)
  useEffect(() => {
    console.log('=== PublicRoute useEffect ejecutado ===');
    console.log('=== PublicRoute - Verificando retorno de pago ===');
    
    // Mostrar TODO el sessionStorage
    console.log('SessionStorage completo:', {
      leavingForPayment: sessionStorage.getItem('leavingForPayment'),
      keys: Object.keys(sessionStorage),
      length: sessionStorage.length
    });
    
    const isReturningFromPayment = sessionStorage.getItem('leavingForPayment');
    console.log('Bandera leavingForPayment:', isReturningFromPayment);
    console.log('Tipo de bandera:', typeof isReturningFromPayment);
    
    if (isReturningFromPayment === 'true') {
      console.log('¡¡¡DETECTADO RETORNO DE PAGO EN PUBLICROUTE!!!');
      console.log('Removiendo bandera y redirigiendo al carrito...');
      sessionStorage.removeItem('leavingForPayment');
      navigate('/carrito', { replace: true });
      return;
    } else {
      console.log('No se detectó retorno de pago, bandera es:', isReturningFromPayment);
    }
  }, [navigate]);

  console.log('=== PublicRoute ===');
  console.log('loadingAuth:', loadingAuth);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('token existe:', !!token);

  // SEGUNDO: Si todavía estamos verificando la sesión, mostramos "Cargando..."
  if (loadingAuth) {
    console.log('Esperando a que termine de cargar el AuthContext...');
    return (
      <main style={{ padding: '4rem', textAlign: 'center' }}>
        Cargando...
      </main>
    );
  }

  // TERCERO: Si hay token en localStorage pero aún no está autenticado,
  //    esperamos un momento más (para evitar race conditions)
  if (token && !isAuthenticated) {
    console.log('Hay token pero usuario no cargado aún, esperando...');
    return (
      <main style={{ padding: '4rem', textAlign: 'center' }}>
        Cargando...
      </main>
    );
  }

  // CUARTO: Si la sesión YA está iniciada, redirige al Inicio
  if (isAuthenticated) {
    console.log('Usuario ya logueado, redirigiendo desde ruta pública a /');
    return <Navigate to="/" replace />;
  }

  // QUINTO: Si no está logueado, muestra la página (Login o Register)
  console.log('Usuario no autenticado, mostrando página pública');
  return <Outlet />;
}

export default PublicRoute;