import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './componentes/header';
import Footer from './componentes/Footer';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si estamos volviendo de un pago
  useEffect(() => {
    console.log('=== APP - Verificando retorno de pago ===');
    console.log('Ruta actual:', location.pathname);
    
    const isReturningFromPayment = sessionStorage.getItem('leavingForPayment');
    console.log('Bandera leavingForPayment:', isReturningFromPayment);
    
    if (isReturningFromPayment === 'true') {
      console.log('¡Detectado retorno de pago! Redirigiendo al carrito...');
      sessionStorage.removeItem('leavingForPayment');
      
      // Redirigir al carrito sin importar en qué ruta estemos
      navigate('/carrito', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;