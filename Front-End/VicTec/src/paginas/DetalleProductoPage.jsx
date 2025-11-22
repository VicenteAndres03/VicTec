import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config"; // <--- Importar
import "./DetalleProductoPage.css";

function renderRating(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? "star-filled" : "star-empty"}>
        ★
      </span>
    );
  }
  return stars;
}

function DescripcionTab({ producto }) {
  return (
    <div className="tab-content-descripcion">
      <p>{producto.descripcion}</p>
    </div>
  );
}

function ComentariosTab({ producto, onCommentAdded }) {
  const comentarios = producto?.comentarios || [];
  const { isAuthenticated, getAuthHeader, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [texto, setTexto] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Inicia sesión para comentar.");
      return;
    }
    setStatus("submitting");
    setError(null);

    try {
      // Usamos API_URL
      // getAuthHeader ya incluye el header de ngrok
      const response = await fetch(
        `${API_URL}/productos/${producto.id}/comentarios`,
        {
          method: "POST",
          headers: getAuthHeader(),
          body: JSON.stringify({ texto: texto, rating: rating }),
        }
      );

      if (!response.ok) throw new Error("No se pudo enviar el comentario.");

      setStatus("idle");
      setTexto("");
      setRating(5);
      onCommentAdded();
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div className="tab-content-comentarios">
      <h4>Opiniones ({comentarios.length})</h4>
      {isAuthenticated ? (
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <h5>Escribe tu opinión</h5>
          <p>
            Usuario: <strong>{user?.nombre || user?.email}</strong>
          </p>
          <div className="form-group-rating">
            <label>Puntuación:</label>
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
          <div className="form-group-comment">
            <textarea
              rows="4"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Tu opinión..."
              required
            ></textarea>
          </div>
          {status === "error" && <p className="comment-form-error">{error}</p>}
          <button
            type="submit"
            className="comment-submit-button"
            disabled={status === "submitting"}
          >
            Enviar
          </button>
        </form>
      ) : (
        <p className="comment-login-prompt">
          <Link to="/login">Inicia sesión</Link> para opinar.
        </p>
      )}

      <div className="comentarios-lista">
        {comentarios.length === 0 ? (
          <p>Sé el primero en opinar.</p>
        ) : (
          [...comentarios]
            .sort((a, b) => b.id - a.id)
            .map((c) => (
              <div className="comentario-item" key={c.id}>
                <div className="comentario-header">
                  <span className="comentario-autor">{c.autor}</span>
                  <span className="comentario-rating">
                    {renderRating(c.rating)}
                  </span>
                </div>
                <p className="comentario-texto">{c.texto}</p>
                <span className="comentario-fecha">{c.fecha}</span>
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
  const [activeTab, setActiveTab] = useState("desc");

  const fetchProducto = useCallback(async () => {
    try {
      setError(null);
      // Usamos API_URL
      // --- MODIFICACIÓN: Agregamos el header para ngrok ---
      const response = await fetch(`${API_URL}/productos/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Producto no encontrado");
      const data = await response.json();
      setProducto(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchProducto();
  }, [fetchProducto]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      // Usamos API_URL
      // getAuthHeader ya incluye el header de ngrok
      const response = await fetch(`${API_URL}/carrito/add`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ productoId: producto.id, cantidad: 1 }),
      });
      if (!response.ok) throw new Error("Error al añadir");
      navigate("/carrito");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <main className="detalle-container">
        <p>Cargando...</p>
      </main>
    );
  if (error || !producto)
    return (
      <main className="detalle-container">
        <div className="detalle-error">
          <h1>No encontrado</h1>
          <Link to="/productos" className="detalle-boton-volver">
            Volver
          </Link>
        </div>
      </main>
    );

  return (
    <main className="detalle-container">
      <Link to="/productos" className="detalle-back-link">
        ← Volver
      </Link>
      <div className="detalle-layout">
        <div className="detalle-imagen">
          <img src={producto.imgUrl} alt={producto.nombre} />
          {producto.enOferta && <span className="detalle-sale-tag">Sale</span>}
        </div>
        <div className="detalle-info">
          <span className="detalle-marca">{producto.marca}</span>
          <div className="detalle-meta-info">
            <span>
              Stock: <strong className="meta-stock">{producto.stock}</strong>
            </span>
            <span>SKU: {producto.sku}</span>
          </div>
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <div className="detalle-precios">
            <span className="detalle-precio-actual">
              CLP${producto.precio.toLocaleString("es-CL")}
            </span>
            {producto.enOferta && producto.precioAntiguo && (
              <span className="detalle-precio-antiguo">
                CLP${producto.precioAntiguo.toLocaleString("es-CL")}
              </span>
            )}
          </div>
          <p className="detalle-descripcion-corta">{producto.descripcion}</p>
          <button
            className="detalle-add-to-cart-button"
            onClick={handleAddToCart}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
      <div className="detalle-tabs-container">
        <div className="detalle-tabs">
          <button
            className={`detalle-tab-button ${
              activeTab === "desc" ? "active" : ""
            }`}
            onClick={() => setActiveTab("desc")}
          >
            Descripción
          </button>
          <button
            className={`detalle-tab-button ${
              activeTab === "reviews" ? "active" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Opiniones
          </button>
        </div>
        <div className="detalle-tab-content">
          {activeTab === "desc" && <DescripcionTab producto={producto} />}
          {activeTab === "reviews" && (
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
