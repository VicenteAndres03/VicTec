import React, { useState, useEffect } from 'react';
// 1. --- IMPORTAMOS useSearchParams ---
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import './productos.css';

// 2. --- MODIFICAMOS ProductFilters ---
// Ahora recibe 'setSearchParams' y 'categoriaActual'
function ProductFilters({ setSearchParams, categoriaActual }) {

  // Función para manejar el clic en un filtro
  const handleFilterClick = (nuevaCategoria) => {
    if (nuevaCategoria === 'todos') {
      // Si es 'todos', limpiamos el parámetro de la URL
      setSearchParams({});
    } else {
      // Si es otra categoría, la ponemos en la URL
      setSearchParams({ categoria: nuevaCategoria });
    }
  };

  return (
    <nav className="filter-bar-container">
      <ul className="filter-list">
        <li>
          <button
            // Comprueba si la categoría activa es 'todos' (o no hay ninguna)
            className={!categoriaActual ? 'active' : ''}
            onClick={() => handleFilterClick('todos')}
          >
            Todos
          </button>
        </li>
        <li>
          <button
            // Comprueba si la categoría activa es 'Audio'
            className={categoriaActual === 'Audio' ? 'active' : ''}
            // 3. --- IMPORTANTE: Usamos el valor real del Backend ('Audio') ---
            onClick={() => handleFilterClick('Audio')}
          >
            Audífonos
          </button>
        </li>
        {/* Aquí puedes añadir más categorías en el futuro */}
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
  
  // 4. --- OBTENEMOS 'searchParams' y 'setSearchParams' ---
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria'); // Obtenemos el filtro de la URL

  // 5. --- LÓGICA DE BÚSQUEDA ELIMINADA ---
  // Ya no necesitamos 'localSearchTerm' ni 'handleSearchSubmit'

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 6. --- URL DE FETCH MODIFICADA ---
        let url = '/api/v1/productos';
        if (categoria) {
          // Si hay una categoría, la añadimos a la URL
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
  // 7. --- DEPENDENCIA DEL useEffect ACTUALIZADA ---
  }, [categoria]); // Se ejecuta cada vez que 'categoria' (de la URL) cambia

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

  // 8. --- LÓGICA DE BÚSQUEDA ELIMINADA ---
  // (handleSearchSubmit ya no existe)


  if (loading) {
    return <div className="productos-container"><p>Cargando productos...</p></div>;
  }

  if (error) {
    return <div className="productos-container"><p>Error al cargar productos: {error}</p></div>;
  }

  return (
    <main className="productos-container">
      
      {/* 9. --- Título dinámico según el filtro --- */}
      {categoria ? (
        <h1 className="productos-title">Categoría: {categoria}</h1>
      ) : (
        <h1 className="productos-title">Nuestros Productos</h1>
      )}
      
      {/* 10. --- BARRA DE BÚSQUEDA ELIMINADA --- */}

      {/* 11. --- Pasamos las props al componente de filtros --- */}
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