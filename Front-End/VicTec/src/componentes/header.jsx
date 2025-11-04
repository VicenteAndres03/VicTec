import React, { useState } from "react";
import { Link } from "react-router-dom"; // 1. Importa el componente Link
import "./header.css";
import logo from "../assets/Circulo.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="header-content">
        
        {/* 2. Cambiamos <a> por <Link> */}
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo de VicTec" className="logo-image" />
          <span className="logo-text">VICTEC</span>
        </Link>

        {/* --- Volvemos a la clase 'open' condicional --- */}
        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <ul>
            {/* 3. Cambiamos todos los <a> por <Link> */}
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/productos">Productos</Link>
            </li>
            <li>
              <Link to="/soporte">Soporte</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
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
            <button typeD="submit">🔍</button>
          </div>

          <div className="user-icons">
            <div className="user-menu">
              <span className="icon-link user-icon-trigger">👤</span>
              <div className="user-dropdown">
                {/* Estos pueden seguir siendo <a> si te llevan 
                    fuera de la app principal, o puedes 
                    cambiarlos por <Link> también */}
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