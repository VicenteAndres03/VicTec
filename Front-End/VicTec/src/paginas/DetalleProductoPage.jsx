import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DetalleProductoPage.css'; 

// --- Helper para renderizar estrellas ---
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

// --- Sub-componente Pestaña de Descripción ---
function DescripcionTab({ producto }) {
  return (
    <div className="tab-content-descripcion">
      <p>{producto.descripcion}</p>
    </div>
  );
}

// --- Sub-componente Pestaña de Comentarios (MODIFICADA) ---
function ComentariosTab({ producto, onCommentAdded }) {
  const comentarios = producto?.comentarios || [];
  
  // Estados para el nuevo formulario de comentario
  const { isAuthenticated, getAuthHeader, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [texto, setTexto] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, error
  const [error, setError] = useState(null);

  // Handler para enviar el formulario
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }
    
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch(`/api/v1/productos/${producto.id}/comentarios`, {
        method: 'POST',
        headers: getAuthHeader(), // ¡Enviamos el token!
        body: JSON.stringify({
          texto: texto,
          rating: rating
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'No se pudo enviar el comentario.');
      }

      // ¡Éxito!
      setStatus('idle');
      setTexto('');
      setRating(5);
      onCommentAdded(); // ¡Llamamos a la función del padre para refrescar!

    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <div className="tab-content-comentarios">
      <h4>Opiniones del Producto ({comentarios.length})</h4>
      
      {/* --- Formulario para Añadir Comentario --- */}
      {isAuthenticated ? (
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <h5>Escribe tu opinión</h5>
          <p>Tu nombre se mostrará como: <strong>{user?.nombre || user?.email}</strong></p>
          
          {/* Input de Estrellas */}
          <div className="form-group-rating">
            <label>Tu puntuación:</label>
            <div className="stars-input">
              {[5, 4, 3, 2, 1].map((star) => (
                <React.Fragment key={star}>
                  <input
                    type="radio"
                    id={`star${star}`}
                    name="rating"
                    value={star}
                    checked={rating === star}
                    onChange={() => setRating(star)}
                  />
                  <label htmlFor={`star${star}`}>★</label>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Input de Texto */}
          <div className="form-group-comment">
            <label htmlFor="comment-text">Tu opinión:</label>
            <textarea
              id="comment-text"
              rows="4"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe lo que piensas del producto..."
              required
            ></textarea>
          </div>
          
          {status === 'error' && (
            <p className="comment-form-error">{error}</p>
          )}

          <button type="submit" className="comment-submit-button" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Enviando...' : 'Enviar Opinión'}
          </button>
        </form>
      ) : (
        <p className="comment-login-prompt">
          <Link to="/login">Inicia sesión</Link> para dejar tu opinión.
        </p>
      )}
      {/* --- Fin del Formulario --- */}
      
      <div className="comentarios-lista">
        {comentarios.length === 0 ? (
          <p>Este producto aún no tiene opiniones. ¡Sé el primero!</p>
        ) : (
          // Ordenamos comentarios del más nuevo al más viejo (por ID)
          [...comentarios].sort((a, b) => b.id - a.id).map((comentario) => (
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

  // Mover la lógica de fetch a una función useCallback
  const fetchProducto = useCallback(async () => {
    console.log("Refrescando producto...");
    try {
      // No ponemos setLoading(true) aquí para que el refresco sea silencioso
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
      setLoading(false); // Solo quita el 'loading' inicial
    }
  }, [id]); // Depende de 'id'

  // El useEffect ahora solo llama a la función
  useEffect(() => {
    setLoading(true); // Activa el loading inicial la primera vez
    fetchProducto();
  }, [fetchProducto]); // Se ejecuta cuando fetchProducto cambia (o sea, cuando 'id' cambia)

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
                    
          <button 
            className={`detalle-tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Opiniones ({producto?.comentarios?.length || 0})
          </button>
        </div>
        
        <div className="detalle-tab-content">
          {activeTab === 'desc' && producto && <DescripcionTab producto={producto} />}
          
          {/* Pasamos la función de refresco como prop */}
          {activeTab === 'reviews' && producto && (
            <ComentariosTab 
              producto={producto} 
              onCommentAdded={fetchProducto} 
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default DetalleProductoPage;