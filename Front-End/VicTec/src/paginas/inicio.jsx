import React from 'react';
import './inicio.css'; // El CSS para esta página

// --- Sección 1: Hero Banner ---
function HeroBanner() {
  return (
    // Esta sección tendrá la imagen de fondo gracias al CSS
    <section className="hero-container">
      <div className="hero-content">
        
        {/* Solo dejamos el texto. La imagen es el fondo. */}
        <div className="hero-text">
          <h1 className="hero-title">
            INNOVACIÓN QUE <br /> IMPULSA TU MUNDO
          </h1>
          <a href="/productos" className="hero-button">
            DESCUBRIR PRODUCTOS
          </a>
        </div>
        
        {/* Ya no hay 'hero-image-placeholder' aquí */}

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

// --- Sección 3: Plantilla de Categorías Destacadas ---
function FeaturedCategories() {
  return (
    <section className="featured-container">
      <h2 className="featured-title">CATEGORÍAS DESTACADAS</h2>
      <div className="featured-grid">
        
        {/* PLANTILLA DE PRODUCTO (ACTUALIZADA A CLP) */}
        <div className="product-card">
          <div className="product-image-box">
            <span className="sale-tag">Sale</span>
          </div>
          <h3 className="product-name">Nombre del Producto</h3>
          <div className="product-price">
            {/* --- CAMBIOS AQUÍ --- */}
            <span className="current-price">CLP$199.990</span>
            <span className="old-price">CLP$299.990</span>
          </div>
          <span className="product-brand-placeholder">Marca</span>
        </div>
        
        {/* (Aquí puedes duplicar la tarjeta de arriba para probar) */}

      </div>
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