import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CarritoPage.css'; // El CSS para esta página

function CarritoPage() {
  // --- Simulación de Carrito (ACTUALIZADA A CLP) ---
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Auriculares Pro-Gen',
      brand: 'VicTec',
      price: 39990, // <--- CAMBIO
      quantity: 1,
      image: '/placeholder-headset.png'
    },
    {
      id: 2,
      name: 'Smartwatch X5',
      brand: 'VicTec',
      price: 179990, // <--- CAMBIO
      quantity: 1,
      image: '/placeholder-watch.png'
    }
  ]);
  // ------------------------------

  // Calcula el subtotal
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const envio = 3500; // <--- CAMBIO (Costo de envío en CLP)
  const total = subtotal + envio;

  // --- Vista del Carrito Vacío ---
  const renderEmptyCart = () => (
    <div className="cart-empty">
      <h2>Tu carrito está vacío</h2>
      <p>Parece que aún no has añadido nada. ¡Explora nuestros productos!</p>
      <Link to="/productos" className="cart-empty-button">
        Ver Productos
      </Link>
    </div>
  );

  // --- Vista del Carrito Lleno ---
  const renderCart = () => (
    <div className="cart-layout">
      
      {/* Columna Izquierda: Lista de Items */}
      <div className="cart-item-list">
        {items.map(item => (
          <div className="cart-item" key={item.id}>
            <div className="cart-item-image">
              {/* <img src={item.image} alt={item.name} /> */}
            </div>
            <div className="cart-item-details">
              <span className="cart-item-brand">{item.brand}</span>
              <span className="cart-item-name">{item.name}</span>
              <button className="cart-item-remove">Quitar</button>
            </div>
            <div className="cart-item-quantity">
              <input type="number" min="1" max="10" defaultValue={item.quantity} />
            </div>
            <div className="cart-item-price">
              {/* --- CAMBIO AQUÍ (Formato CLP) --- */}
              CLP$${(item.price * item.quantity).toLocaleString('es-CL')}
            </div>
          </div>
        ))}
      </div>

      {/* Columna Derecha: Resumen de Compra */}
      <div className="cart-summary">
        <h3>Resumen de tu Pedido</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          {/* --- CAMBIO AQUÍ (Formato CLP) --- */}
          <span>CLP$${subtotal.toLocaleString('es-CL')}</span>
        </div>
        <div className="summary-row">
          <span>Envío (Estimado)</span>
          {/* --- CAMBIO AQUÍ (Formato CLP) --- */}
          <span>CLP$${envio.toLocaleString('es-CL')}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total">
          <span>Total</span>
          {/* --- CAMBIO AQUÍ (Formato CLP) --- */}
          <span>CLP$${total.toLocaleString('es-CL')}</span>
        </div>
        <button className="checkout-button">
          Proceder al Pago
        </button>
      </div>
    </div>
  );

  return (
    <main className="carrito-container">
      <h1 className="carrito-title">Tu Carrito de Compras</h1>
      {items.length === 0 ? renderEmptyCart() : renderCart()}
    </main>
  );
}

export default CarritoPage;