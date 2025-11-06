import React, { useState, useEffect } from 'react'; // 1. Importamos useEffect
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 2. Importamos el AuthContext
import './CarritoPage.css'; // El CSS para esta página

function CarritoPage() {
  // 3. Obtenemos las funciones de autenticación
  const { getAuthHeader, isAuthenticated } = useAuth();

  // 4. Estados para los datos reales, carga y error
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 5. useEffect para cargar el carrito real del backend
  useEffect(() => {
    // Si el usuario no está logueado, no hay carrito que buscar
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchCarrito = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/v1/carrito', {
          headers: getAuthHeader(), // Usamos el token de autenticación
        });

        if (response.status === 404) {
          // Esto es normal, significa que un usuario nuevo no tiene carrito
          setItems([]);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error('Error al cargar el carrito');
        }
        
        const data = await response.json();
        // El backend devuelve el objeto Carrito, que tiene la propiedad 'items'
        setItems(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
    // Se ejecuta cada vez que cambia el estado de autenticación
  }, [isAuthenticated, getAuthHeader]);

  // 6. Función para eliminar un item del carrito
  const handleRemoveItem = async (productoId) => {
    try {
      const response = await fetch(`/api/v1/carrito/remove/${productoId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('No se pudo quitar el producto');
      }

      // Actualiza el estado local para que el item desaparezca de la UI
      setItems(prevItems => prevItems.filter(item => item.producto.id !== productoId));
    } catch (err) {
      setError(err.message);
    }
  };


  // 7. Cálculos actualizados (el 'item' ahora es un CarritoItem)
  // Nota: item.producto.precio (viene del backend)
  const subtotal = items.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  const envio = subtotal > 0 ? 3500 : 0; // No cobrar envío si el carrito está vacío
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

  // --- Vista del Carrito Lleno (Actualizada) ---
  const renderCart = () => (
    <div className="cart-layout">
      
      {/* Columna Izquierda: Lista de Items */}
      <div className="cart-item-list">
        {items.map(item => (
          // El 'item' aquí es un CarritoItem de Java
          // El producto está en 'item.producto'
          <div className="cart-item" key={item.id}> 
            <div className="cart-item-image">
              {/* Usamos la imgUrl del producto */}
              <img src={item.producto.imgUrl} alt={item.producto.nombre} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            <div className="cart-item-details">
              <span className="cart-item-brand">{item.producto.marca}</span>
              <span className="cart-item-name">{item.producto.nombre}</span>
              {/* 8. Conectamos la función de eliminar al botón */}
              <button 
                className="cart-item-remove"
                onClick={() => handleRemoveItem(item.producto.id)}
              >
                Quitar
              </button>
            </div>
            <div className="cart-item-quantity">
              {/* 9. La cantidad viene de item.cantidad. Usamos readOnly por ahora */}
              <input type="number" min="1" max="10" value={item.cantidad} readOnly />
            </div>
            <div className="cart-item-price">
              {/* El precio total del item */}
              CLP$${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}
            </div>
          </div>
        ))}
      </div>

      {/* Columna Derecha: Resumen de Compra */}
      <div className="cart-summary">
        <h3>Resumen de tu Pedido</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>CLP$${subtotal.toLocaleString('es-CL')}</span>
        </div>
        <div className="summary-row">
          <span>Envío (Estimado)</span>
          <span>CLP$${envio.toLocaleString('es-CL')}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total">
          <span>Total</span>
          <span>CLP$${total.toLocaleString('es-CL')}</span>
        </div>
        <Link to="/checkout" className="checkout-button">
            Proceder al Pago
        </Link>
      </div>
    </div>
  );

  return (
    <main className="carrito-container">
      <h1 className="carrito-title">Tu Carrito de Compras</h1>
      
      {/* 10. Lógica de renderizado principal */}
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