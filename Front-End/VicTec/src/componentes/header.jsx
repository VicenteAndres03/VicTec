import React from "react";
import "./header.css"; // Importamos el CSS para los estilos
import logo from "../assets/Logo.png"; // Importamos el logo

function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        {/* --- Logo Unificado --- */}
        {/* Un solo enlace que contiene la imagen y el texto */}
        <a href="/" className="logo-container">
          <img src={logo} alt="Logo de VicTec" className="logo-image" />
          <span className="logo-text">VICTEC</span>
        </a>

        {/* --- Enlaces de Navegación --- */}
        <nav className="nav-links">
          <ul>
            <li>
              <a href="/Inicio">Inicio</a>
            </li>
            <li>
              <a href="/Productos">Productos</a>
            </li>
            <li>
              <a href="/soporte">Soporte</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </nav>

        {/* --- Búsqueda y Acciones de Usuario --- */}
        <div className="header-actions">
          <div className="search-bar">
            <input type="text" placeholder="Buscar productos..." />
            <button type="submit">🔍</button>
          </div>
          <div className="user-icons">
            <a href="/login" className="icon-link">
              👤
            </a>
            <a href="/carrito" className="icon-link">
              🛒
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
