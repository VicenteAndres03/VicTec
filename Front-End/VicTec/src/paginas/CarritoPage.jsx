import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CarritoPage.css';

// --- INICIO DE LA MODIFICACIÓN ---
// 1. Creamos una función reutilizable para calcular el envío
const calcularEnvio = (subtotal) => {
  if (subtotal === 0) return 0;
  if (subtotal >= 50000) return 0; // Envío gratis
  if (subtotal >= 25000) return 1990; // Envío reducido
  return 3500; // Envío estándar
};
// --- FIN DE LA MODIFICACIÓN ---

function CarritoPage() {
  const { getAuthHeader, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchCarrito = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/v1/carrito', {
          headers: getAuthHeader(),
        });

        if (response.status === 404) {
          setItems([]);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          let errorMessage = 'Error al cargar el carrito';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
          console.error('Error al cargar carrito:', response.status, errorMessage);
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        setItems(data.items || []);
      } catch (err) {
        console.error('Error completo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
  }, [isAuthenticated, getAuthHeader]);

  const handleRemoveItem = async (productoId) => {
    try {
      const response = await fetch(`/api/v1/carrito/remove/${productoId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('No se pudo quitar el producto');
      setItems(prevItems => prevItems.filter(item => item.producto.id !== productoId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateQuantity = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      handleRemoveItem(productoId);
      return;
    }
    if (nuevaCantidad > 10) {
      setError('La cantidad máxima es 10');
      return;
    }

    try {
      const response = await fetch('/api/v1/carrito/update-cantidad', {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({
          productoId: productoId,
          cantidad: nuevaCantidad
        }),
      });

      if (!response.ok) throw new Error('No se pudo actualizar la cantidad');
      const data = await response.json();
      setItems(data.items || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleIncrement = (item) => {
    const nuevaCantidad = item.cantidad + 1;
    handleUpdateQuantity(item.producto.id, nuevaCantidad);
  };

  const handleDecrement = (item) => {
    const nuevaCantidad = item.cantidad - 1;
    handleUpdateQuantity(item.producto.id, nuevaCantidad);
  };

  const subtotal = items.reduce((acc, item) => {
    if (!item || !item.producto || !item.producto.precio) return acc;
    return acc + item.producto.precio * item.cantidad;
  }, 0);
  
  // 2. --- Usamos la nueva función ---
  const envio = calcularEnvio(subtotal);
  const total = subtotal + envio;

  const renderEmptyCart = () => (
    <div className="cart-empty">
      <h2>Tu carrito está vacío</h2>
      <p>Parece que aún no has añadido nada. ¡Explora nuestros productos!</p>
      <Link to="/productos" className="cart-empty-button">
        Ver Productos
      </Link>
    </div>
  );

  const renderCart = () => (
    <div className="cart-layout">
      <div className="cart-item-list">
        {items.map(item => {
          if (!item || !item.producto) return null;
          return (
            <div className="cart-item" key={item.id}> 
              <div className="cart-item-image">
                <img src={item.producto.imgUrl || ''} alt={item.producto.nombre || 'Producto'} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
              <div className="cart-item-details">
                <span className="cart-item-brand">{item.producto.marca || ''}</span>
                <span className="cart-item-name">{item.producto.nombre || 'Producto sin nombre'}</span>
                <button 
                  className="cart-item-remove"
                  onClick={() => handleRemoveItem(item.producto.id)}
                >
                  Quitar
                </button>
              </div>
              <div className="cart-item-quantity">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn minus"
                    onClick={() => handleDecrement(item)}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={item.cantidad || 1} 
                    readOnly 
                    className="quantity-input"
                  />
                  <button 
                    className="quantity-btn plus"
                    onClick={() => handleIncrement(item)}
                    disabled={item.cantidad >= 10}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-price">
                CLP${((item.producto.precio || 0) * (item.cantidad || 1)).toLocaleString('es-CL')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Resumen de tu Pedido</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>CLP$${subtotal.toLocaleString('es-CL')}</span>
        </div>
        <div className="summary-row">
          <span>Envío (Estimado)</span>
          {/* 3. --- Lógica para mostrar "Gratis" --- */}
          <span>{envio === 0 ? 'Gratis' : `CLP$${envio.toLocaleString('es-CL')}`}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total">
          <span>Total</span>
          <span>CLP$${total.toLocaleString('es-CL')}</span>
        </div>
        {items.length > 0 && (
          <Link to="/checkout" className="checkout-button">
            Proceder al Pago
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <main className="carrito-container">
      <h1 className="carrito-title">Tu Carrito de Compras</h1>
      
      {error && <p className="register-error-message">Error: {error}</p>}
      
      {loading ? (
        <p>Cargando carrito...</p>
      ) : (
        items.length === 0 ? renderEmptyCart() : renderCart()
      )}
    </main>
  );
}

export default CarritoPage;