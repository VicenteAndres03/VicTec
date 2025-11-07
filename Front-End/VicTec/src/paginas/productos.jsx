import React, { useState, useEffect } from 'react';
// 1. --- IMPORTAR useSearchParams ---
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import './productos.css';

function ProductFilters() {
  // ... (este componente se queda igual) ...
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
      </ul>
    </nav>
  );
}

function ProductosPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthHeader, isAuthenticated } = useAuth();
  
  // 2. --- LEER LOS PARÁMETROS DE LA URL ---
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // 'q' es el nombre que definimos en el header

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 3. --- CREAR LA URL DINÁMICA ---
        let url = '/api/v1/productos';
        if (query) {
          // Si hay una búsqueda, añade el parámetro
          url = `/api/v1/productos?q=${encodeURIComponent(query)}`;
        }
        
        // 4. --- USAR LA URL DINÁMICA ---
        const response = await fetch(url);
        
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
  // 5. --- AÑADIR 'query' A LAS DEPENDENCIAS ---
  // Esto hace que la página se recargue si la búsqueda cambia
  }, [query]); 

  const handleAddToCart = async (e, productoId) => {
    // ... (esta función se queda igual que la que arreglamos antes) ...
    e.preventDefault(); 
    e.stopPropagation(); 
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('/api/v1/carrito/add', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          productoId: productoId,
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
    return <div className="productos-container"><p>Cargando productos...</p></div>;
  }

  if (error) {
    return <div className="productos-container"><p>Error al cargar productos: {error}</p></div>;
  }

  return (
    <main className="productos-container">
      
      {/* 6. --- TÍTULO DINÁMICO --- */}
      {query ? (
        <h1 className="productos-title">Resultados para: "{query}"</h1>
      ) : (
        <h1 className="productos-title">Nuestros Productos</h1>
      )}
      
      <ProductFilters />

      <div className="productos-grid">
        
        {/* 7. --- MENSAJE SI NO HAY RESULTADOS --- */}
        {!loading && productos.length === 0 && (
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        )}
        
        {productos.map((producto) => (
          <Link 
            to={`/productos/${producto.id}`} 
            className="product-card" 
            key={producto.id}
          >
            {/* ... (el resto del card se queda igual) ... */}
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
                onClick={(e) => handleAddToCart(e, producto.id)}
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