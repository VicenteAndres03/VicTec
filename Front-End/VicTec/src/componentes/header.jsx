import React, { useState } from "react";
// 1. --- IMPORTAR useNavigate ---
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./header.css";
import logo from "../assets/Circulo.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // 2. --- ESTADO PARA LA BÚSQUEDA ---
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook para redirigir
  
  const { isAuthenticated, user, logout } = useAuth();

  // 3. --- FUNCIÓN PARA MANEJAR LA BÚSQUEDA ---
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (searchTerm.trim()) {
      // Redirige a la página de productos con el parámetro de búsqueda
      navigate(`/productos?q=${encodeURIComponent(searchTerm.trim())}`);
      // Opcional: limpiar la barra de búsqueda después
      // setSearchTerm(""); 
    }
  };

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
            
            {/* 4. --- FORMULARIO DE BÚSQUEDA (MÓVIL) --- */}
            <li className="nav-search-bar">
              <form onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">🔍</button>
              </form>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          
          {/* 5. --- FORMULARIO DE BÚSQUEDA (ESCRITORIO) --- */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
          
          {/* ... (resto del header sin cambios) ... */}
          <div className="user-icons">
            <div className="user-menu">
              <span className="icon-link user-icon-trigger" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                {isAuthenticated ? (
                  <div className="user-initials">{ (user.nombre && user.nombre.charAt(0)) || (user.email && user.email.charAt(0)) || 'U' }</div>
                ) : (
                  '👤'
                )}
              </span>
              
              <div className={`user-dropdown ${isUserMenuOpen ? "open" : ""}`}>
                {isAuthenticated ? (
                  <>
                    <Link to="/mi-cuenta">Mi Cuenta</Link>
                    <Link to="/mis-pedidos">Mis Pedidos</Link>
                    <button onClick={logout} className="logout-button">Cerrar Sesión</button>
                  </>
                ) : (
                  <>
                    <Link to="/login">Iniciar Sesión</Link>
                    <Link to="/register">Registrarse</Link>
                  </>
                )}
              </div>
            </div>
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