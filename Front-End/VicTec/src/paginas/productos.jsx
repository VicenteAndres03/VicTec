import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './productos.css';

// --- Sub-componente para los Filtros ---
function ProductFilters() {
  const [activeFilter, setActiveFilter] = useState('todos');

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
        {/* ... (otros filtros) ... */}
      </ul>
    </nav>
  );
}


// --- Componente Principal de la Página ---
function ProductosPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/productos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductos(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); // El array vacío asegura que se ejecute solo una vez

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    console.log("Producto añadido (simulación)... Redirigiendo al carrito.");
    navigate('/carrito');
  };

  if (loading) {
    return <div className="productos-container"><p>Cargando productos...</p></div>;
  }

  if (error) {
    return <div className="productos-container"><p>Error al cargar productos: {error}</p></div>;
  }

  return (
    <main className="productos-container">
      
      <h1 className="productos-title">Nuestros Productos</h1>
      <ProductFilters />

      <div className="productos-grid">
        
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
              
              <button 
                className="product-add-to-cart-button"
                onClick={handleAddToCart}
              >
                Añadir al Carrito
              </button>
            </div>
          </Link>
        ))}
        
      </div>
    </main>
  );
}

export default ProductosPage;