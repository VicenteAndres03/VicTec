import React, { useState } from "react";
import { Link } from "react-router-dom"; // Asegúrate de que Link esté importado
import "./header.css";
import logo from "../assets/Circulo.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo de VicTec" className="logo-image" />
          <span className="logo-text">VICTEC</span>
        </Link>

        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/soporte">Soporte</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li className="nav-search-bar">
              <input type="text" placeholder="Buscar productos..." />
              <button type="submit">🔍</button>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className="search-bar">
            <input type="text" placeholder="Buscar productos..." />
            <button type="submit">🔍</button>
          </div>

          <div className="user-icons">
            <div className="user-menu">
              <span className="icon-link user-icon-trigger" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>👤</span>
              <div className={`user-dropdown ${isUserMenuOpen ? "open" : ""}`}>
                {/* --- CAMBIO AQUÍ --- */}
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/register">Registrarse</Link>
              </div>
            </div>
            {/* Este puede ser un Link o un <a> */}
            <Link to="/carrito" className="icon-link">🛒</Link>
          </div>

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