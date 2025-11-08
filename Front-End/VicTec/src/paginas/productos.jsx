import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import './productos.css';

function ProductFilters({ setSearchParams, categoriaActual }) {

  // Función para manejar el clic en un filtro
  const handleFilterClick = (nuevaCategoria) => {
    if (nuevaCategoria === 'todos') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: nuevaCategoria });
    }
  };

  return (
    <nav className="filter-bar-container">
      <ul className="filter-list">
        <li>
          <button
            className={!categoriaActual ? 'active' : ''}
            onClick={() => handleFilterClick('todos')}
          >
            Todos
          </button>
        </li>
        <li>
          <button
            className={categoriaActual === 'Audio' ? 'active' : ''}
            onClick={() => handleFilterClick('Audio')}
          >
            Audio
          </button>
        </li>

        {/* --- INICIO DE LA MODIFICACIÓN --- */}
        <li>
          <button
            className={categoriaActual === 'Smartwatch' ? 'active' : ''}
            onClick={() => handleFilterClick('Smartwatch')}
          >
            Smartwatches
          </button>
        </li>
        <li>
          <button
            className={categoriaActual === 'Perifericos' ? 'active' : ''}
            onClick={() => handleFilterClick('Perifericos')}
          >
            Periféricos
          </button>
        </li>
        <li>
          <button
            className={categoriaActual === 'Drones' ? 'active' : ''}
            onClick={() => handleFilterClick('Drones')}
          >
            Drones
          </button>
        </li>
        <li>
          <button
            className={categoriaActual === 'Accesorios' ? 'active' : ''}
            onClick={() => handleFilterClick('Accesorios')}
          >
            Accesorios
          </button>
        </li>
        {/* --- FIN DE LA MODIFICACIÓN --- */}

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
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria'); 

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = '/api/v1/productos';
        if (categoria) {
          url = `/api/v1/productos?categoria=${encodeURIComponent(categoria)}`;
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
  }, [categoria]); 

  const handleAddToCart = async (e, productoId) => {
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
      
      {categoria ? (
        <h1 className="productos-title">Categoría: {categoria}</h1>
      ) : (
        <h1 className="productos-title">Nuestros Productos</h1>
      )}
      
      <ProductFilters 
        setSearchParams={setSearchParams} 
        categoriaActual={categoria} 
      />

      <div className="productos-grid">
        
        {!loading && productos.length === 0 && (
          <p>No se encontraron productos en esta categoría.</p>
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