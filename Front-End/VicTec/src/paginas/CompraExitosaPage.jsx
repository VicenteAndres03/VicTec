import React from 'react';
import { Link } from 'react-router-dom';
import './CompraExitosaPage.css'; // Crearemos este CSS

function CompraExitosaPage() {
  
  // En el futuro, este ID vendrá del backend
  const numeroDeOrden = 'VT-1004'; 

  return (
    <main className="compra-exitosa-container">
      <div className="compra-exitosa-box">
        
        {/* Animación del Check */}
        <div className="icono-check-animado">
          <svg className="check-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="check-circulo" cx="26" cy="26" r="25" fill="none"/>
            <path className="check-marca" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h1 className="compra-exitosa-title">¡Gracias por tu compra!</h1>
        <p className="compra-exitosa-subtitle">
          Tu pedido ha sido confirmado exitosamente.
        </p>
        <p className="compra-exitosa-orden">
          Tu número de orden es: <strong>{numeroDeOrden}</strong>
        </p>
        <p className="compra-exitosa-info">
          Recibirás un email de confirmación (simulado) con los detalles de tu pedido y el seguimiento del envío.
        </p>

        <div className="compra-exitosa-botones">
          <Link to="/" className="boton-secundario">
            Ir al Inicio
          </Link>
          <Link to="/mis-pedidos" className="boton-primario">
            Ver Mis Pedidos
          </Link>
        </div>

      </div>
    </main>
  );
}

export default CompraExitosaPage;