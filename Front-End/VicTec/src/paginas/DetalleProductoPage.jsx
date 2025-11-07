import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DetalleProductoPage.css'; 

// --- Helper para renderizar estrellas (Sin cambios) ---
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

// --- Sub-componentes para Pestañas ---

// (Función DescripcionTab se queda igual)
function DescripcionTab({ producto }) {
  return (
    <div className="tab-content-descripcion">
      <p>{producto.descripcion}</p>
    </div>
  );
}

// 1. --- ELIMINAMOS LA FUNCIÓN EspecificacionesTab ---

// (Función ComentariosTab se queda igual)
function ComentariosTab({ producto }) {
  const comentarios = producto?.comentarios || [];
  
  return (
    <div className="tab-content-comentarios">
      <h4>Opiniones del Producto ({comentarios.length})</h4>
      <div className="comentarios-lista">
        {comentarios.length === 0 ? (
          <p>Este producto aún no tiene opiniones. ¡Sé el primero!</p>
        ) : (
          comentarios.map((comentario) => (
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
  );
}


function DetalleProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeader, isAuthenticated } = useAuth(); 

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/v1/productos/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado');
          }
          throw new Error('Error al cargar el producto');
        }
        
        const data = await response.json();
        setProducto(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducto();
  }, [id]); 

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/v1/carrito/add', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          productoId: producto.id,
          cantidad: 1
        })
      });

      if (!response.ok) {
        throw new Error('Error al añadir al carrito');
      }
      navigate('/carrito');

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <main className="detalle-container">
        <p>Cargando producto...</p>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main className="detalle-container">
        <div className="detalle-error">
          <h1>{error || 'Producto no encontrado'}</h1>
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

      <Link to="/productos" className="detalle-back-link">
        ← Volver a Productos
      </Link>

      <div className="detalle-layout">
        <div className="detalle-imagen">
          <img src={producto.imgUrl} alt={producto.nombre} />
          {producto.enOferta && <span className="detalle-sale-tag">Sale</span>}
        </div>

        <div className="detalle-info">
          <span className="detalle-marca">{producto.marca}</span>
          <div className="detalle-meta-info">
            <span>Stock: <strong className="meta-stock">{producto.stock} disponibles</strong></span>
            <span>SKU: {producto.sku}</span>
          </div>
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <div className="detalle-precios">
            <span className="detalle-precio-actual">
              CLP${producto.precio.toLocaleString('es-CL')}
            </span>
            {producto.enOferta && producto.precioAntiguo && (
              <span className="detalle-precio-antiguo">
                CLP${producto.precioAntiguo.toLocaleString('es-CL')}
              </span>
            )}
          </div>
          <p className="detalle-descripcion-corta">
            {producto.descripcion ? (
              producto.descripcion.length > 150 ? (
                <>
                  {producto.descripcion.substring(0, 150)}... 
                  <a href="#detalle-tabs" className="ver-mas-link">(ver más)</a>
                </>
              ) : (
                producto.descripcion
              )
            ) : (
              'Sin descripción disponible.'
            )}
          </p>
          <button 
            className="detalle-add-to-cart-button"
            onClick={handleAddToCart}
          >
            Añadir al Carrito
          </button>

          {/* 2. --- AQUÍ AÑADIMOS LA NOTA DE ENVÍO --- */}
          <p className="detalle-envio-info">
            🚚 **Nota:** Este es un producto de importación. El tiempo de envío estimado es de 15 a 30 días hábiles.
          </p>

        </div>
      </div>

      <div id="detalle-tabs" className="detalle-tabs-container">
        <div className="detalle-tabs">
          <button 
            className={`detalle-tab-button ${activeTab === 'desc' ? 'active' : ''}`}
            onClick={() => setActiveTab('desc')}
          >
            Descripción
          </button>
          
          {/* 3. --- ELIMINAMOS EL BOTÓN DE LA PESTAÑA --- */}
          
          <button 
            className={`detalle-tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Opiniones ({producto?.comentarios?.length || 0})
          </button>
        </div>
        
        <div className="detalle-tab-content">
          {activeTab === 'desc' && producto && <DescripcionTab producto={producto} />}
          {/* 4. --- ELIMINAMOS EL RENDER DE LA PESTAÑA --- */}
          {activeTab === 'reviews' && producto && <ComentariosTab producto={producto} />}
        </div>
      </div>
    </main>
  );
}

export default DetalleProductoPage;