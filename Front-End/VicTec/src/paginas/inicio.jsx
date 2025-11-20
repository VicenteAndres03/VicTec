import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config'; // <--- Importamos la URL de la configuración
import './inicio.css'; 

// --- Sección 1: Hero Banner ---
function HeroBanner() {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            INNOVACIÓN QUE <br /> IMPULSA TU MUNDO
          </h1>
          {/* CORRECCIÓN: Usamos Link para evitar recargar la página y el error 404 */}
          <Link to="/productos" className="hero-button">
            DESCUBRIR PRODUCTOS
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- Sección 2: Barra de Iconos ---
function IconBar() {
  return (
    <section className="icon-bar-container">
      <div className="icon-item">
        <span className="icon-placeholder">🖥️</span>
        <p>Llevavida</p>
      </div>
      <div className="icon-item">
        <span className="icon-placeholder">💳</span>
        <p>Descuento / Cuota</p>
      </div>
      <div className="icon-item">
        <span className="icon-placeholder">🚚</span>
        <p>Centros de envío</p>
      </div>
      <div className="icon-item">
        <span className="icon-placeholder">⚙️</span>
        <p>Servicio Técnico</p>
      </div>
    </section>
  );
}

// --- Sección 3: Categorías Destacadas ---
function FeaturedCategories() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Cargar productos cuando el componente se monta
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // CORRECCIÓN: Usamos API_URL en lugar de localhost
        const response = await fetch(`${API_URL}/productos`); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Guardamos solo los primeros 4 productos
        setProductos(data.slice(0, 4)); 
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); 


  return (
    <section className="featured-container">
      <h2 className="featured-title">PRODUCTOS DESTACADOS</h2>
      
      {loading && <p>Cargando productos...</p>}
      {error && <p>Error al cargar productos: {error}</p>}
      
      {!loading && !error && (
        <div className="featured-grid">
          
          {productos.map((producto) => (
            
            <Link 
              to={`/productos/${producto.id}`} 
              className="product-card" 
              key={producto.id}
            >
              <div className="product-image-box">
                <img src={producto.imgUrl} alt={producto.nombre} className="product-image-real" />
                {producto.enOferta && <span className="sale-tag">Sale</span>}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{producto.nombre}</h3>
                <div className="product-price">
                  <span className="current-price">
                    CLP${producto.precio.toLocaleString('es-CL')}
                  </span>
                  {producto.enOferta && producto.precioAntiguo && (
                    <span className="old-price">
                      CLP${producto.precioAntiguo.toLocaleString('es-CL')}
                    </span>
                  )}
                </div>
                <span className="product-brand-placeholder">{producto.marca}</span>
              </div>
            </Link>
          ))}
          
        </div>
      )}
    </section>
  );
}

// --- Componente Principal de la Página ---
function HomePage() {
  return (
    <main>
      <HeroBanner />
      <IconBar />
      <FeaturedCategories />
    </main>
  );
}

export default HomePage;