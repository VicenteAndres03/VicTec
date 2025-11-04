import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- 1. IMPORTA Link
import './productos.css';

// --- SIMULACIÓN DE BASE DE DATOS ---
const mockProductos = [
  {
    id: 1,
    nombre: 'Auriculares Pro-Gen',
    marca: 'VicTec',
    precio: 39990,
    precioAntiguo: 59990,
    enOferta: true,
    imgUrl: 'https://i.imgur.com/8Q1mP0B.png',
  },
  {
    id: 2,
    nombre: 'Smartwatch X5',
    marca: 'VicTec',
    precio: 179990,
    precioAntiguo: null,
    enOferta: false,
    imgUrl: 'https://i.imgur.com/7H2j3bE.png',
  },
];
// ---------------------------------


// --- Sub-componente para los Filtros ---
function ProductFilters() {
  // ... (El componente de filtros no cambia) ...
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

  // <-- 2. MODIFICADO: Acepta el 'event' (e) -->
  const handleAddToCart = (e) => {
    // ¡MUY IMPORTANTE!
    // Esto evita que al hacer clic en el botón, también
    // se active el <Link> de la tarjeta.
    e.preventDefault(); 
    e.stopPropagation(); 

    console.log("Producto añadido (simulación)... Redirigiendo al carrito.");
    navigate('/carrito');
  };

  return (
    <main className="productos-container">
      
      <h1 className="productos-title">Nuestros Productos</h1>
      <ProductFilters />

      <div className="productos-grid">
        
        {/* --- 3. Mapeamos desde nuestra simulación de BD --- */}
        {mockProductos.map((producto) => (
          
          // <-- 4. CADA TARJETA ES UN LINK a su 'id' -->
          <Link 
            to={`/productos/${producto.id}`} 
            className="product-card" 
            key={producto.id}
          >
            <div className="product-image-box">
              {/* (Usamos la imgUrl del producto) */}
              <img src={producto.imgUrl} alt={producto.nombre} className="product-image-real" />
              {producto.enOferta && <span className="sale-tag">Sale</span>}
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{producto.nombre}</h3>
              <div className="product-price">
                <span className="current-price">
                  CLP${producto.precio.toLocaleString('es-CL')}
                </span>
                {producto.enOferta && (
                  <span className="old-price">
                    CLP${producto.precioAntiguo.toLocaleString('es-CL')}
                  </span>
                )}
              </div>
              <span className="product-brand-placeholder">{producto.marca}</span>
              
              <button 
                className="product-add-to-cart-button"
                onClick={handleAddToCart} // <-- 5. El onClick sigue aquí
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

// Estilo rápido para la imagen (añade esto a productos.css si quieres)
/*
.product-image-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  background-color: #f5f5f5;
  overflow: hidden;
}
.product-image-real {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}
*/

export default ProductosPage;