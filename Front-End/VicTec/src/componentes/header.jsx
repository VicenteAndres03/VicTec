import React from 'react';
import './header.css'; // Importamos el CSS para los estilos
import logo from '../assets/Logo.png'; // Importamos el logo

function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        
        <img src={logo} alt="Logo de VicTec" className="logo" width={60} height={60} />
        <div className="logo">
          <a href="/">VICTEC</a>
        </div>

        {/* --- Enlaces de Navegación --- */}
        <nav className="nav-links">
          <ul>
            {/* NOTA: Cuando instales 'react-router-dom', deberías 
              cambiar estas etiquetas <a> por componentes <Link>
              Ej: <li><Link to="/categorias">Categorías</Link></li>
            */}
            <li><a href="/categorias">Categorías</a></li>
            <li><a href="/ofertas">Ofertas</a></li>
            <li><a href="/soporte">Soporte</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </nav>

        {/* --- Búsqueda y Acciones de Usuario --- */}
        <div className="header-actions">
          <div className="search-bar">
            <input type="text" placeholder="Buscar productos..." />
            <button type="submit">🔍</button> {/* Puedes reemplazar esto con un ícono SVG */}
          </div>
          <div className="user-icons">
            {/* 👤 y 🛒 son placeholders. Idealmente, usa íconos SVG o de una librería (ej. React Icons) */}
            <a href="/login" className="icon-link">👤</a>
            <a href="/carrito" className="icon-link">🛒</a>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;