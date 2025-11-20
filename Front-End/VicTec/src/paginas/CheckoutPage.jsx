import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

// --- 1. DATOS: Lista de Regiones y Comunas de Chile ---
const REGIONES_CHILE = [
  {
    nombre: "Arica y Parinacota",
    comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
  },
  {
    nombre: "Tarapacá",
    comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
  },
  {
    nombre: "Antofagasta",
    comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
  },
  {
    nombre: "Atacama",
    comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
  },
  {
    nombre: "Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
  },
  {
    nombre: "Valparaíso",
    comunas: ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
  },
  {
    nombre: "Metropolitana de Santiago",
    comunas: ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
  },
  {
    nombre: "Libertador General Bernardo O'Higgins",
    comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
  },
  {
    nombre: "Maule",
    comunas: ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
  },
  {
    nombre: "Ñuble",
    comunas: ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Trehuaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"]
  },
  {
    nombre: "Biobío",
    comunas: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
  },
  {
    nombre: "La Araucanía",
    comunas: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
  },
  {
    nombre: "Los Ríos",
    comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
  },
  {
    nombre: "Los Lagos",
    comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
  },
  {
    nombre: "Aysén del General Carlos Ibáñez del Campo",
    comunas: ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
  },
  {
    nombre: "Magallanes y de la Antártica Chilena",
    comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
  }
];

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
    region: '',       // Nuevo: se llenará con el select
    ciudad: '',       // Nuevo: actuará como Comuna
    codigoPostal: '',
    telefono: '',
  });

  // --- 2. Estado para las comunas disponibles según la región ---
  const [comunasDisponibles, setComunasDisponibles] = useState([]);

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

  // --- 3. MODIFICACIÓN: HANDLE CHANGE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'region') {
      // Si cambia la región, actualizamos comunas disponibles y reseteamos la ciudad
      const regionSeleccionada = REGIONES_CHILE.find(r => r.nombre === value);
      setComunasDisponibles(regionSeleccionada ? regionSeleccionada.comunas : []);
      setFormData(prev => ({ ...prev, region: value, ciudad: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- 4. VALIDACIONES DE SEGURIDAD ---
    if (formData.direccion.trim().length < 5) {
      setError('Por favor ingresa una dirección válida y completa (Calle y número).');
      setStatus('error');
      return;
    }
    
    if (!formData.region || !formData.ciudad) {
      setError('Debes seleccionar una Región y una Comuna.');
      setStatus('error');
      return;
    }

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
      // Guardamos la dirección con la región y comuna seleccionadas
      const direccionResponse = await fetch('/api/v1/direcciones', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          calle: formData.direccion,
          ciudad: formData.ciudad, // Aquí va la Comuna
          region: formData.region, // Aquí va la Región
          codigoPostal: formData.codigoPostal,
          pais: 'Chile' 
        }),
      });
      
      if (!direccionResponse.ok) {
        const errorData = await direccionResponse.json().catch(() => ({ error: 'Error al guardar la dirección' }));
        throw new Error(errorData.error || 'Error al guardar la dirección');
      }
      
      const direccionData = await direccionResponse.json();
      
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

              {/* --- 5. NUEVOS SELECTORES DE REGIÓN Y COMUNA --- */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="region">Región</label>
                  <select 
                    id="region" 
                    name="region" 
                    value={formData.region} 
                    onChange={handleChange} 
                    required
                    style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
                  >
                    <option value="">Selecciona una Región</option>
                    {REGIONES_CHILE.map((reg) => (
                      <option key={reg.nombre} value={reg.nombre}>
                        {reg.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="ciudad">Comuna</label>
                  <select 
                    id="ciudad" 
                    name="ciudad" 
                    value={formData.ciudad} 
                    onChange={handleChange} 
                    required
                    disabled={!formData.region}
                    style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
                  >
                    <option value="">Selecciona una Comuna</option>
                    {comunasDisponibles.map((comuna) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Calle y Número</label>
                <input 
                  type="text" 
                  id="direccion" 
                  name="direccion" 
                  placeholder="Ej: Av. Providencia 1234, Depto 301" 
                  value={formData.direccion} 
                  onChange={handleChange} 
                  required 
                />
                 <small style={{color: '#666', marginTop: '5px'}}>
                  * Incluye nombre de calle y numeración exacta.
                </small>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal (Opcional)</label>
                  <input type="text" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} />
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
                <label className="payment-option selected">
                  <input type="radio" name="metodoPago" value="webpay" checked={true} readOnly />
                  Webpay / MercadoPago (Crédito/Débito)
                </label>
              </div>
            </div>

            <button type="submit" className="checkout-submit-button" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Procesando...' : 'Ir a Pagar'}
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