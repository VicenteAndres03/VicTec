import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './componentes/header';
import Footer from './componentes/Footer';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('=== APP - Verificando retorno de pago ===');
    console.log('Ruta actual:', location.pathname);
    
    const isReturningFromPayment = sessionStorage.getItem('leavingForPayment');
    console.log('Bandera leavingForPayment:', isReturningFromPayment);
    
    if (isReturningFromPayment === 'true') {
      console.log('¡Detectado retorno de pago! Redirigiendo al carrito...');
      sessionStorage.removeItem('leavingForPayment');
      navigate('/carrito', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    // 1. Cambiado de "app" a "App" (con 'A' mayúscula)
    <div className="App"> 
      <Header />
      
      {/* 2. Cambiado de "main-content" a "app-content" */}
      <main className="app-content">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;