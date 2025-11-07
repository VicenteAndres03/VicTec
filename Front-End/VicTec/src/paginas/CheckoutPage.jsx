import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

const calcularEnvio = (subtotal) => {
  if (subtotal === 0) return 0;
  if (subtotal >= 50000) return 0;
  if (subtotal >= 25000) return 1990;
  return 3500;
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { getAuthHeader, isAuthenticated, user, isTokenValid, logout, loadingAuth } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    telefono: '',
    // 1. --- MODIFICACIÓN ---
    // 'metodoPago' siempre será 'webpay' y no necesita 'onChange'
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = () => {
      const params = new URLSearchParams(window.location.search);
      const paymentId = params.get('payment_id');
      const paymentStatus = params.get('status');
      const collectionStatus = params.get('collection_status'); 

      if (params.has('collection_id') || params.has('payment_id')) {
        if (paymentStatus === 'null' || paymentStatus === 'rejected' || collectionStatus === 'rejected') {
          navigate('/carrito');
        }
      }
    };
    checkPaymentStatus();
  }, [navigate]);

  useEffect(() => {
    if (loadingAuth) return;
    if (!isTokenValid()) { 
      navigate('/login', { replace: true });
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    const fetchCarrito = async () => {
      try {
        setLoadingCart(true);
        setCartError(null);
        const headers = getAuthHeader();
        const response = await fetch('/api/v1/carrito', { headers: headers });
        if (response.status === 401 || response.status === 403) {
          setCartError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          logout();
          navigate('/login', { replace: true });
          return;
        }
        if (response.status === 404) {
          setCartItems([]);
          setLoadingCart(false);
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
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setCartItems(data.items || []);
        if (user && user.email) {
          setFormData(prev => ({ ...prev, email: user.email }));
        }
      } catch (err) {
        setCartError(err.message || 'Error al cargar el carrito');
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCarrito();
  }, [isAuthenticated, getAuthHeader, navigate, user, isTokenValid, logout, loadingAuth]);

  // 2. --- MODIFICACIÓN ---
  // Ya no necesitamos 'handleChange' para el método de pago
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isTokenValid()) {
      setError('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
      setStatus('error');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
      return;
    }
    if (cartItems.length === 0) {
      setError('Tu carrito está vacío');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setError(null);

    try {
      const direccionResponse = await fetch('/api/v1/direcciones', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          calle: formData.direccion,
          ciudad: formData.ciudad,
          region: formData.region,
          codigoPostal: formData.codigoPostal,
          pais: 'Chile' 
        }),
      });
      
      if (!direccionResponse.ok) {
        const errorData = await direccionResponse.json().catch(() => ({ error: 'Error al guardar la dirección' }));
        throw new Error(errorData.error || 'Error al guardar la dirección');
      }
      
      const direccionData = await direccionResponse.json();

      // 3. --- MODIFICACIÓN ---
      // Eliminamos el 'if (formData.metodoPago === 'transferencia')'
      // Ahora siempre va a Mercado Pago
      
      const authHeaders = getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
      }
      
      const response = await fetch('/api/v1/pedidos/crear-y-pagar', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ direccionId: direccionData.id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error al procesar el pedido' }));
        if (response.status === 401 || response.status === 403) {
          throw new Error('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
        }
        throw new Error(errorData.error || 'Error al crear el pedido y la preferencia de pago');
      }
      
      const preferenceData = await response.json();
      
      if (!preferenceData.init_point) {
        throw new Error('No se recibió la URL de pago de Mercado Pago');
      }

      sessionStorage.setItem('leavingForPayment', 'true');
      
      setTimeout(() => {
        window.location.href = preferenceData.init_point;
      }, 100);

    } catch (err) {
      setStatus('error');
      setError(err.message || 'Ocurrió un error al procesar el pago');
      
      if (err.message.toLowerCase().includes('sesión') || err.message.toLowerCase().includes('token')) {
        setTimeout(() => {
          logout(); 
          navigate('/login', { replace: true });
        }, 2500);
      }
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    if (!item || !item.producto || !item.producto.precio) return acc;
    return acc + item.producto.precio * item.cantidad;
  }, 0);
  const envio = calcularEnvio(subtotal);
  const totalPedido = subtotal + envio;
  
  if (loadingAuth || loadingCart) {
    return (
      <main className="checkout-container">
        <div className="checkout-loading"><p>Cargando...</p></div>
      </main>
    );
  }

  return (
    <main className="checkout-container">
      {cartError ? (
        <div className="checkout-error">
          <p style={{ color: 'red', fontSize: '1.1rem', fontWeight: 'bold' }}>Error: {cartError}</p>
          <button onClick={() => navigate('/login')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Ir a Iniciar Sesión
          </button>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="checkout-empty">
          <p>Tu carrito está vacío</p>
          <button onClick={() => navigate('/productos')}>Ver Productos</button>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-form-section">
            <h1 className="checkout-title">Finalizar Compra</h1>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              {status === 'error' && (
                <div className="error-message" style={{ color: 'red', padding: '1rem', marginBottom: '1rem', backgroundColor: '#ffe6e6', borderRadius: '8px' }}>
                  <strong>Error:</strong> {error}
                </div>
              )}
              {status === 'submitting' && (
                <div className="submitting-message" style={{ color: 'blue', padding: '1rem', marginBottom: '1rem', backgroundColor: '#e6f3ff', borderRadius: '8px' }}>
                  <strong>Procesando...</strong> Por favor espere mientras procesamos su pedido.
                </div>
              )}
            
            {/* ... (Formulario de contacto y dirección sin cambios) ... */}
            <div className="form-section">
              <h2>Información de Contacto</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-section">
              <h2>Dirección de Envío</h2>
              {/* ... (campos de dirección sin cambios) ... */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion" placeholder="Calle, número, depto..." value={formData.direccion} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad</label>
                  <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="region">Región</label>
                  <input type="text" id="region" name="region" value={formData.region} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal</label>
                  <input type="text" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input type="tel" id="telefono" name="telefono" placeholder="+56 9 1234 5678" value={formData.telefono} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Método de Pago</h2>
              <div className="payment-options">
                {/* 4. --- MODIFICACIÓN --- */}
                {/* Dejamos solo la opción de Webpay, y la marcamos como seleccionada y deshabilitada */}
                <label className="payment-option selected">
                  <input type="radio" name="metodoPago" value="webpay" checked={true} readOnly />
                  Webpay / MercadoPago (Crédito/Débito)
                </label>
                {/* La opción de transferencia se elimina */}
              </div>
            </div>

            {/* 5. --- MODIFICACIÓN --- */}
            {/* El texto del botón ahora es siempre "Ir a Pagar" */}
            <button type="submit" className="checkout-submit-button" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Procesando...' : 'Ir a Pagar'}
            </button>
          </form>
        </div>

        {/* ... (Resumen del pedido sin cambios) ... */}
        <div className="checkout-summary-section">
          <div className="checkout-summary">
            <h3>Resumen del Pedido</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>CLP${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>{envio === 0 ? 'Gratis' : `CLP$${envio.toLocaleString('es-CL')}`}</span>
            </div>
            <div className="summary-row-nota">
              <span>🚚 Envío internacional. Estimación: 15-30 días hábiles.</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>CLP${totalPedido.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </main>
  );
}

export default CheckoutPage;