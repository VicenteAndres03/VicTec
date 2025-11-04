import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './DetalleProductoPage.css'; // El CSS que actualizaremos

// --- SIMULACIÓN DE BASE DE DATOS (¡AHORA CON MÁS DETALLES!) ---
const mockProductos = [
  {
    id: 1,
    nombre: 'Auriculares Pro-Gen',
    marca: 'VicTec',
    precio: 39990,
    precioAntiguo: 59990,
    enOferta: true,
    imgUrl: 'https://i.imgur.com/8Q1mP0B.png',
    // --- NUEVOS DATOS ---
    sku: 'VT-AUD-PRO-001',
    stock: 25,
    categoria: 'Audio',
    descripcion: 'Sumérgete en el sonido con los Auriculares Pro-Gen. Cancelación de ruido activa, 40 horas de batería y un diseño ergonómico para tu día a día.',
    especificaciones: [
      { key: 'Conexión', value: 'Bluetooth 5.2' },
      { key: 'Batería', value: '40 horas (con ANC apagado)' },
      { key: 'Cancelación de Ruido', value: 'Activa (ANC) Híbrida' },
      { key: 'Peso', value: '220g' },
    ],
    comentarios: [
      { id: 1, autor: 'Carla M.', rating: 5, texto: '¡Me encantaron! La cancelación de ruido es increíble para el precio. Muy cómodos.', fecha: 'hace 2 días' },
      { id: 2, autor: 'Felipe González', rating: 4, texto: 'Buenos audífonos, el material se siente de calidad y la batería dura muchísimo.', fecha: 'hace 1 semana' },
    ]
  },
  {
    id: 2,
    nombre: 'Smartwatch X5',
    marca: 'VicTec',
    precio: 179990,
    precioAntiguo: null,
    enOferta: false,
    imgUrl: 'https://i.imgur.com/7H2j3bE.png',
    // --- NUEVOS DATOS ---
    sku: 'VT-SW-X5-002',
    stock: 10,
    categoria: 'Smartwatches',
    descripcion: 'El Smartwatch X5 es tu compañero de salud. Mide tu ritmo cardíaco, oxígeno en sangre, y te mantiene conectado con notificaciones inteligentes.',
    especificaciones: [
      { key: 'Pantalla', value: '1.8" AMOLED' },
      { key: 'Resistencia al Agua', value: '5 ATM (Hasta 50m)' },
      { key: 'Sensores', value: 'Ritmo Cardíaco, SpO2, GPS' },
      { key: 'Material', value: 'Caja de aleación de aluminio' },
    ],
    comentarios: [
      { id: 3, autor: 'Juan Pablo', rating: 5, texto: 'Excelente reloj, la pantalla se ve muy nítida y el GPS es preciso. 10/10.', fecha: 'hace 5 días' },
    ]
  },
];
// ---------------------------------

// --- NUEVA FUNCIÓN ---
// Helper para renderizar estrellas
function renderRating(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>
        ★
      </span>
    );
  }
  return stars;
}


function DetalleProductoPage() {
  const { id } = useParams();
  const producto = mockProductos.find(p => p.id == id);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    console.log("Añadido al carrito:", producto.nombre);
    navigate('/carrito');
  };

  if (!producto) {
    return (
      <main className="detalle-container">
        <div className="detalle-error">
          <h1>Producto no encontrado</h1>
          <p>El producto que buscas no existe o fue movido.</p>
          <Link to="/productos" className="detalle-boton-volver">
            Volver a Productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="detalle-container">
      <div className="detalle-layout">

        {/* --- Columna de Imagen --- */}
        <div className="detalle-imagen">
          <img src={producto.imgUrl} alt={producto.nombre} />
          {producto.enOferta && <span className="detalle-sale-tag">Sale</span>}
        </div>

        {/* --- Columna de Información --- */}
        <div className="detalle-info">
          <span className="detalle-marca">{producto.marca}</span>
          
          {/* --- NUEVO: Stock y SKU --- */}
          <div className="detalle-meta-info">
            <span>Stock: <strong className="meta-stock">{producto.stock} disponibles</strong></span>
            <span>SKU: {producto.sku}</span>
          </div>

          <h1 className="detalle-nombre">{producto.nombre}</h1>
          
          <div className="detalle-precios">
            <span className="detalle-precio-actual">
              CLP${producto.precio.toLocaleString('es-CL')}
            </span>
            {producto.enOferta && (
              <span className="detalle-precio-antiguo">
                CLP${producto.precioAntiguo.toLocaleString('es-CL')}
              </span>
            )}
          </div>

          <p className="detalle-descripcion">
            {producto.descripcion}
          </p>

          {/* --- NUEVO: Lista de Especificaciones --- */}
          <div className="detalle-especificaciones">
            <h4>Especificaciones Técnicas</h4>
            <ul className="detalle-especificaciones-lista">
              {producto.especificaciones.map((spec) => (
                <li key={spec.key}>
                  <strong>{spec.key}:</strong> {spec.value}
                </li>
              ))}
            </ul>
          </div>

          <button 
            className="detalle-add-to-cart-button"
            onClick={handleAddToCart}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>

      {/* --- NUEVO: Sección de Comentarios --- */}
      <div className="detalle-comentarios-container">
        <h3>Opiniones del Producto ({producto.comentarios.length})</h3>
        
        <div className="comentarios-lista">
          {producto.comentarios.length === 0 ? (
            <p>Este producto aún no tiene opiniones. ¡Sé el primero!</p>
          ) : (
            producto.comentarios.map((comentario) => (
              <div className="comentario-item" key={comentario.id}>
                <div className="comentario-header">
                  <span className="comentario-autor">{comentario.autor}</span>
                  <span className="comentario-rating">
                    {renderRating(comentario.rating)}
                  </span>
                </div>
                <p className="comentario-texto">{comentario.texto}</p>
                <span className="comentario-fecha">{comentario.fecha}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </main>
  );
}

export default DetalleProductoPage;