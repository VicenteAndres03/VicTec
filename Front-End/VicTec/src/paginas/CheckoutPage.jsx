import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";
import "./CheckoutPage.css";

const REGIONES_CHILE = [
  {
    nombre: "Arica y Parinacota",
    comunas: ["Arica", "Camarones", "Putre", "General Lagos"],
  },
  {
    nombre: "Tarapacá",
    comunas: [
      "Iquique",
      "Alto Hospicio",
      "Pozo Almonte",
      "Camiña",
      "Huara",
      "Pica",
    ],
  },
  {
    nombre: "Antofagasta",
    comunas: [
      "Antofagasta",
      "Mejillones",
      "Taltal",
      "Calama",
      "San Pedro de Atacama",
      "Tocopilla",
    ],
  },
  { nombre: "Atacama", comunas: ["Copiapó", "Caldera", "Vallenar", "Huasco"] },
  {
    nombre: "Coquimbo",
    comunas: [
      "La Serena",
      "Coquimbo",
      "Vicuña",
      "Illapel",
      "Los Vilos",
      "Ovalle",
    ],
  },
  {
    nombre: "Valparaíso",
    comunas: [
      "Valparaíso",
      "Viña del Mar",
      "Quilpué",
      "Villa Alemana",
      "San Antonio",
      "Quillota",
      "Los Andes",
      "San Felipe",
    ],
  },
  {
    nombre: "Metropolitana de Santiago",
    comunas: [
      "Alhué",
      "Buin",
      "Calera de Tango",
      "Cerrillos",
      "Cerro Navia",
      "Colina",
      "Conchalí",
      "Curacaví",
      "El Bosque",
      "El Monte",
      "Estación Central",
      "Huechuraba",
      "Independencia",
      "Isla de Maipo",
      "La Cisterna",
      "La Florida",
      "La Granja",
      "La Pintana",
      "La Reina",
      "Lampa",
      "Las Condes",
      "Lo Barnechea",
      "Lo Espejo",
      "Lo Prado",
      "Macul",
      "Maipú",
      "María Pinto",
      "Melipilla",
      "Ñuñoa",
      "Padre Hurtado",
      "Paine",
      "Pedro Aguirre Cerda",
      "Peñaflor",
      "Peñalolén",
      "Pirque",
      "Providencia",
      "Pudahuel",
      "Puente Alto",
      "Quilicura",
      "Quinta Normal",
      "Recoleta",
      "Renca",
      "San Bernardo",
      "San Joaquín",
      "San José de Maipo",
      "San Miguel",
      "San Pedro",
      "San Ramón",
      "Santiago",
      "Talagante",
      "Til Til",
      "Vitacura",
    ].sort(),
  },
  {
    nombre: "Libertador General Bernardo O'Higgins",
    comunas: ["Rancagua", "Machalí", "San Fernando", "Santa Cruz", "Pichilemu"],
  },
  {
    nombre: "Maule",
    comunas: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes"],
  },
  { nombre: "Ñuble", comunas: ["Chillán", "San Carlos", "Quillón"] },
  {
    nombre: "Biobío",
    comunas: [
      "Concepción",
      "Talcahuano",
      "Los Ángeles",
      "San Pedro de la Paz",
      "Chiguayante",
      "Coronel",
    ],
  },
  {
    nombre: "La Araucanía",
    comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"],
  },
  { nombre: "Los Ríos", comunas: ["Valdivia", "La Unión", "Panguipulli"] },
  {
    nombre: "Los Lagos",
    comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"],
  },
  {
    nombre: "Aysén del General Carlos Ibáñez del Campo",
    comunas: ["Coyhaique", "Aysén"],
  },
  {
    nombre: "Magallanes y de la Antártica Chilena",
    comunas: ["Punta Arenas", "Natales", "Porvenir"],
  },
];

// --- LÓGICA DE ENVÍO ACTUALIZADA ---
const calcularEnvio = (subtotal) => {
  if (subtotal === 0) return 0;
  if (subtotal >= 50000) return 0; // Envío gratis
  return 1000; // Tarifa plana de 1.000
};

function CheckoutPage() {
  const navigate = useNavigate();
  const {
    getAuthHeader,
    isAuthenticated,
    user,
    isTokenValid,
    logout,
    loadingAuth,
  } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    direccion: "",
    region: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
  });

  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.has("collection_id") || params.has("payment_id")) {
        const paymentStatus = params.get("status");
        if (paymentStatus === "null" || paymentStatus === "rejected") {
          navigate("/carrito");
        }
      }
    };
    checkPaymentStatus();
  }, [navigate]);

  useEffect(() => {
    if (loadingAuth) return;
    if (!isTokenValid()) {
      navigate("/login", { replace: true });
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchCarrito = async () => {
      try {
        setLoadingCart(true);
        setCartError(null);
        const response = await fetch(`${API_URL}/carrito`, {
          headers: getAuthHeader(),
        });

        if (response.status === 401 || response.status === 403) {
          setCartError("Sesión expirada.");
          logout();
          navigate("/login", { replace: true });
          return;
        }
        if (response.status === 404) {
          setCartItems([]);
          setLoadingCart(false);
          return;
        }
        if (!response.ok) throw new Error("Error al cargar el carrito");

        const data = await response.json();
        setCartItems(data.items || []);
        if (user && user.email)
          setFormData((prev) => ({ ...prev, email: user.email }));
      } catch (err) {
        setCartError(err.message);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCarrito();
  }, [
    isAuthenticated,
    getAuthHeader,
    navigate,
    user,
    isTokenValid,
    logout,
    loadingAuth,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const soloNumeros = value.replace(/[^0-9+]/g, "");
      setFormData((prev) => ({ ...prev, [name]: soloNumeros }));
      return;
    }

    if (name === "region") {
      const regionSeleccionada = REGIONES_CHILE.find((r) => r.nombre === value);
      setComunasDisponibles(
        regionSeleccionada ? regionSeleccionada.comunas : []
      );
      setFormData((prev) => ({ ...prev, region: value, ciudad: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      setStatus("error");
      return;
    }

    if (formData.telefono.length < 9) {
      setError("El teléfono debe tener al menos 9 dígitos (Ej: 912345678).");
      setStatus("error");
      return;
    }

    if (
      formData.nombre.trim().length < 2 ||
      formData.apellido.trim().length < 2
    ) {
      setError("Por favor ingresa un nombre y apellido válidos.");
      setStatus("error");
      return;
    }

    if (formData.direccion.trim().length < 5) {
      setError("Ingresa una dirección válida y completa.");
      setStatus("error");
      return;
    }

    if (!formData.region || !formData.ciudad) {
      setError("Debes seleccionar una Región y una Comuna.");
      setStatus("error");
      return;
    }

    if (!isTokenValid()) {
      setError("Tu sesión expiró.");
      setStatus("error");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
      return;
    }
    if (cartItems.length === 0) {
      setError("Tu carrito está vacío");
      setStatus("error");
      return;
    }

    try {
      const direccionResponse = await fetch(`${API_URL}/direcciones`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          calle: formData.direccion,
          ciudad: formData.ciudad,
          region: formData.region,
          codigoPostal: formData.codigoPostal,
          pais: "Chile",
        }),
      });

      if (!direccionResponse.ok)
        throw new Error("Error al guardar la dirección");
      const direccionData = await direccionResponse.json();

      const response = await fetch(`${API_URL}/pedidos/crear-y-pagar`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ direccionId: direccionData.id }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        console.error(
          "Respuesta fallida /pedidos/crear-y-pagar",
          response.status,
          errText
        );
        throw new Error("Error al procesar el pedido");
      }

      const preferenceData = await response.json().catch(async (e) => {
        const txt = await response.text().catch(() => "");
        console.error(
          "Error parseando JSON de /pedidos/crear-y-pagar:",
          e,
          txt
        );
        throw new Error("Respuesta inválida del servidor");
      });

      console.log("preferenceData recibido:", preferenceData);

      // Soporte para diferentes campos que el backend pudiera devolver
      const paymentUrl =
        preferenceData.init_point ||
        preferenceData.initPoint ||
        preferenceData.payment_url ||
        preferenceData.url ||
        preferenceData.redirect_url;

      if (!paymentUrl) {
        console.error("No se encontró URL de pago en preferenceData");
        throw new Error("No se recibió la URL de pago");
      }

      sessionStorage.setItem("leavingForPayment", "true");
      // Redirigir hacia la URL proporcionada por el backend (MercadoPago/otro)
      console.log("Redirigiendo a URL de pago:", paymentUrl);
      window.location.href = paymentUrl;
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.producto?.precio || 0) * item.cantidad,
    0
  );
  const envio = calcularEnvio(subtotal);
  const totalPedido = subtotal + envio;

  if (loadingAuth || loadingCart)
    return (
      <div className="checkout-container">
        <p>Cargando...</p>
      </div>
    );

  return (
    <main className="checkout-container">
      {cartError ? (
        <div className="checkout-error">
          <p>{cartError}</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="checkout-empty">
          <p>Carrito vacío</p>
          <button onClick={() => navigate("/productos")}>Ver Productos</button>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-form-section">
            <h1 className="checkout-title">Finalizar Compra</h1>
            <form onSubmit={handleSubmit} className="checkout-form">
              {status === "error" && (
                <div className="error-message">
                  <strong>Error:</strong> {error}
                </div>
              )}
              {status === "submitting" && (
                <div className="submitting-message">Procesando...</div>
              )}

              <div className="form-section">
                <h2>Información de Contacto</h2>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-section">
                <h2>Dirección de Envío</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Región</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      required
                      style={{
                        padding: "0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Selecciona una Región</option>
                      {REGIONES_CHILE.map((r) => (
                        <option key={r.nombre} value={r.nombre}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comuna</label>
                    <select
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                      disabled={!formData.region}
                      style={{
                        padding: "0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Selecciona una Comuna</option>
                      {comunasDisponibles.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Calle y Número</label>
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Ej: Av. Providencia 1234"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Código Postal</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="9 1234 5678"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Método de Pago</h2>
                <div className="payment-options">
                  <label className="payment-option selected">
                    <input type="radio" checked readOnly /> Webpay / MercadoPago
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="checkout-submit-button"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Procesando..." : "Ir a Pagar"}
              </button>
            </form>
          </div>
          <div className="checkout-summary-section">
            <div className="checkout-summary">
              <h3>Resumen</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>CLP${subtotal.toLocaleString("es-CL")}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>
                  {envio === 0
                    ? "Gratis"
                    : `CLP$${envio.toLocaleString("es-CL")}`}
                </span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>CLP${totalPedido.toLocaleString("es-CL")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default CheckoutPage;
