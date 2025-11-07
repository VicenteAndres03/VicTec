import React, { useState, useEffect } from 'react';
// 1. --- IMPORTAR useSearchParams (si no estaba) y useState ---
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
  
  // 2. --- OBTENER 'setSearchParams' PARA ACTUALIZAR LA URL ---
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q'); 

  // 3. --- ESTADO LOCAL PARA EL CAMPO DE TEXTO ---
  const [localSearchTerm, setLocalSearchTerm] = useState(query || "");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = '/api/v1/productos';
        if (query) {
          url = `/api/v1/productos?q=${encodeURIComponent(query)}`;
        }
        
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
  }, [query]); 

  const handleAddToCart = async (e, productoId) => {
    // ... (esta función se queda igual) ...
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

  // 4. --- FUNCIÓN PARA MANEJAR EL ENVÍO DE BÚSQUEDA ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      // Actualiza el parámetro 'q' en la URL
      setSearchParams({ q: localSearchTerm.trim() });
    } else {
      // Si está vacío, quita el parámetro 'q' de la URL
      setSearchParams({});
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
      
      {query ? (
        <h1 className="productos-title">Resultados para: "{query}"</h1>
      ) : (
        <h1 className="productos-title">Nuestros Productos</h1>
      )}
      
      {/* 5. --- FORMULARIO DE BÚSQUEDA AÑADIDO --- */}
      <form className="productos-search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Buscar en productos..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <ProductFilters />

      <div className="productos-grid">
        
        {!loading && productos.length === 0 && (
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        )}
        
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