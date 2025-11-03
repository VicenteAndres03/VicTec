import React, { useState } from "react";
import "./header.css";
import logo from "../assets/Logo.png";

function Header() {
  // Solo necesitamos 'useState'
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="header-content">
        {/* --- Logo Unificado --- */}
        <a href="/" className="logo-container">
          <img src={logo} alt="Logo de VicTec" className="logo-image" />
          <span className="logo-text">VICTEC</span>
        </a>

        {/* --- Volvemos a la clase 'open' condicional --- */}
        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
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
            <li className="nav-search-bar">
              <input type="text" placeholder="Buscar productos..." />
              <button type="submit">🔍</button>
            </li>
          </ul>
        </nav>

        {/* --- Acciones de Usuario --- */}
        <div className="header-actions">
          <div className="search-bar">
            <input type="text" placeholder="Buscar productos..." />
            <button type="submit">🔍</button>
          </div>

          <div className="user-icons">
            <div className="user-menu">
              <span className="icon-link user-icon-trigger">👤</span>
              <div className="user-dropdown">
                <a href="/login">Iniciar Sesión</a>
                <a href="/register">Registrarse</a>
              </div>
            </div>
            <a href="/carrito" className="icon-link">
              🛒
            </a>
          </div>

          {/* Botón de la hamburguesa (este se queda igual) */}
          <button
            className="hamburger-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
