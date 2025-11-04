import React, { useState } from 'react';
import './productos.css'; // Importamos el CSS para esta página

// --- Sub-componente para los Filtros ---
function ProductFilters() {
  // Estado para saber qué filtro está activo
  const [activeFilter, setActiveFilter] = useState('todos');

  // En el futuro, este estado 'activeFilter' lo usarás
  // para filtrar la lista de productos que viene de tu API.

  return (
    <nav className="filter-bar-container">
      <ul className="filter-list">
        <li>
          <button
            className={activeFilter === 'todos' ? 'active' : ''}
            onClick={() => setActiveFilter('todos')}
          >
            Todos
          </button>
        </li>
        <li>
          <button
            className={activeFilter === 'audifonos' ? 'active' : ''}
            onClick={() => setActiveFilter('audifonos')}
          >
            Audífonos
          </button>
        </li>
        <li>
          <button
            className={activeFilter === 'teclados' ? 'active' : ''}
            onClick={() => setActiveFilter('teclados')}
          >
            Teclados
          </button>
        </li>
        <li>
          <button
            className={activeFilter === 'mouse' ? 'active' : ''}
            onClick={() => setActiveFilter('mouse')}
          >
            Mouse
          </button>
        </li>
      </ul>
    </nav>
  );
}


// --- Componente Principal de la Página ---
function ProductosPage() {
  return (
    <main className="productos-container">
      
      {/* --- Título de la Página --- */}
      <h1 className="productos-title">Nuestros Productos</h1>

      {/* --- NUEVA BARRA DE FILTROS --- */}
      <ProductFilters />

      {/* --- Cuadrícula de Productos --- */}
      <div className="productos-grid">
        
        {/* PLANTILLA DE PRODUCTO (como en el paso anterior) */}
        
        {/* Producto 1 */}
        <div className="product-card">
          <div className="product-image-box">
            <span className="sale-tag">Sale</span>
          </div>
          <h3 className="product-name">Nombre del Producto</h3>
          <div className="product-price">
            <span className="current-price">$199.90</span>
            <span className="old-price">$299.90</span>
          </div>
          <span className="product-brand-placeholder">Marca</span>
        </div>

        {/* Producto 2 */}
        <div className="product-card">
          <div className="product-image-box">
            {/* (Imagen del producto irá aquí) */}
          </div>
          <h3 className="product-name">Nombre del Producto</h3>
          <div className="product-price">
            <span className="current-price">$49.90</span>
          </div>
          <span className="product-brand-placeholder">Marca</span>
        </div>

        {/* (Aquí puedes seguir pegando más plantillas de producto) */}
        
      </div>
    </main>
  );
}

export default ProductosPage;