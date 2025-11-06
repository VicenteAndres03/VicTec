import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { getAuthHeader, isAuthenticated, user, isTokenValid, logout, loadingAuth } = useAuth();

  // Estados para el carrito
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
    metodoPago: 'webpay',
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = () => {
      const params = new URLSearchParams(window.location.search);
      const paymentId = params.get('payment_id');
      const paymentStatus = params.get('status');
      const collectionStatus = params.get('collection_status'); // Another common parameter

      // Only check for cancellation if we have some indication we are coming back from payment
      if (params.has('collection_id') || params.has('payment_id')) {
        if (paymentStatus === 'null' || paymentStatus === 'rejected' || collectionStatus === 'rejected') {
          // User cancelled or payment failed, redirect to cart
          navigate('/carrito');
        }
      }
    };

    checkPaymentStatus();
  }, [navigate]);

  // Efecto para cargar el carrito
  useEffect(() => {
    console.log('=== VERIFICACIÓN INICIAL CHECKOUT ===');
    
    if (loadingAuth) {
      console.log('AuthContext está cargando, esperando...');
      return; 
    }
    
    if (!isTokenValid()) { 
      console.log('Token no válido o expirado, redirigiendo a login');
      navigate('/login', { replace: true });
      return;
    }
    
    if (!isAuthenticated) {
      console.log('Usuario no autenticado (post-validación), redirigiendo a login');
      navigate('/login', { replace: true });
      return;
    }

    const fetchCarrito = async () => {
      try {
        setLoadingCart(true);
        setCartError(null);
        
        const headers = getAuthHeader();
        console.log('=== CARGANDO CARRITO ===');
        
        const response = await fetch('/api/v1/carrito', {
          headers: headers,
        });

        console.log('Respuesta del carrito:', response.status, response.statusText);

        if (response.status === 401 || response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error de autorización al cargar carrito:', errorData);
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
        console.log('Carrito cargado:', data);
        setCartItems(data.items || []);
        
        if (user && user.email) {
          setFormData(prev => ({ ...prev, email: user.email }));
        }
      } catch (err) {
        console.error('Error al cargar carrito:', err);
        setCartError(err.message || 'Error al cargar el carrito');
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCarrito();
    
  }, [isAuthenticated, getAuthHeader, navigate, user, isTokenValid, logout, loadingAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== INICIANDO CHECKOUT ===');
    
    if (!isTokenValid()) {
      setError('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
      setStatus('error');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
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
      console.log('1. Creando dirección...');
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
      console.log('Dirección creada:', direccionData);

      
      if (formData.metodoPago === 'transferencia') {
        console.log('2. Creando pedido (solo transferencia)...');
        const pedidoResponse = await fetch('/api/v1/pedidos/crear', {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ direccionId: direccionData.id }),
        });
        
        if (!pedidoResponse.ok) {
          const errorData = await pedidoResponse.json().catch(() => ({ error: 'Error al crear el pedido' }));
          throw new Error(errorData.error || 'Error al crear el pedido');
        }
        
        console.log('Pedido creado:', await pedidoResponse.json());
        setStatus('success');
        navigate('/compra-exitosa', { replace: true }); 
        return; 
      }

      console.log('2. Creando pedido Y preferencia de pago (Webpay)...');
      
      const authHeaders = getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
      }
      
      const response = await fetch('/api/v1/pedidos/crear-y-pagar', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ direccionId: direccionData.id }),
      });
      
      console.log('=== RESPUESTA DE CREAR-Y-PAGAR ===');
      console.log('Status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error al procesar el pedido' }));
        console.error('Error en crear-y-pagar:', errorData);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
        }
        
        throw new Error(errorData.error || 'Error al crear el pedido y la preferencia de pago');
      }
      
      const preferenceData = await response.json();
      console.log('Preferencia creada:', preferenceData);
      
      if (!preferenceData.init_point) {
        throw new Error('No se recibió la URL de pago de Mercado Pago');
      }

      console.log('3. Estableciendo bandera de pago...');
      sessionStorage.setItem('leavingForPayment', 'true');
      
      // Verificar que se guardó
      const verificar = sessionStorage.getItem('leavingForPayment');
      console.log('Bandera guardada:', verificar);
      
      console.log('4. Redirigiendo a Mercado Pago en 100ms...');
      
      // Dar un pequeño delay para asegurar que sessionStorage se guarde
      setTimeout(() => {
        window.location.href = preferenceData.init_point;
      }, 100);

    } catch (err) {
      console.error('=== ERROR EN CHECKOUT ===');
      console.error('Mensaje:', err.message);
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

  // Calcular totales desde el carrito real
  const subtotal = cartItems.reduce((acc, item) => {
    if (!item || !item.producto || !item.producto.precio) return acc;
    return acc + item.producto.precio * item.cantidad;
  }, 0);
  const envio = subtotal > 0 ? 3500 : 0;
  const totalPedido = subtotal + envio;
  
  // Mostrar carga mientras el AuthContext se inicializa
  if (loadingAuth || loadingCart) {
    return (
      <main className="checkout-container">
        <div className="checkout-loading">
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-container">
      {cartError ? (
        <div className="checkout-error">
          <p style={{ color: 'red', fontSize: '1.1rem', fontWeight: 'bold' }}>Error: {cartError}</p>
          <button 
            onClick={() => navigate('/login')} 
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
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

            <div className="form-section">
              <h2>Información de Contacto</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-section">
              <h2>Dirección de Envío</h2>
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
                <label className="payment-option">
                  <input type="radio" name="metodoPago" value="webpay" checked={formData.metodoPago === 'webpay'} onChange={handleChange} />
                  Webpay / MercadoPago (Crédito/Débito)
                </label>
                <label className="payment-option">
                  <input type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleChange} />
                  Transferencia Bancaria
                </label>
              </div>
            </div>

            <button type="submit" className="checkout-submit-button" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Procesando...' : (formData.metodoPago === 'transferencia' ? 'Finalizar Pedido' : 'Ir a Pagar')}
            </button>
          </form>
        </div>

        <div className="checkout-summary-section">
          <div className="checkout-summary">
            <h3>Resumen del Pedido</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>CLP${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>CLP${envio.toLocaleString('es-CL')}</span>
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