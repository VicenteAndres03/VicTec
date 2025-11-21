import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./header.css";
import logo from "../assets/Circulo.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();

  // Función para cerrar el menú al hacer clic en un enlace
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo de VicTec" className="logo-image" />
          <span className="logo-text">VICTEC</span>
        </Link>

        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/productos" onClick={closeMenu}>Productos</Link></li>
            <li><Link to="/soporte" onClick={closeMenu}>Soporte</Link></li>
            <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
            
            {isAuthenticated && user?.roles?.includes('ROLE_ADMIN') && (
              <li className="admin-panel-link">
                <Link to="/admin/productos" onClick={closeMenu}>Panel Admin</Link>
              </li>
            )}

            {/* --- SECCIÓN MÓVIL DE USUARIO (NUEVO) --- */}
            {/* Esto solo se verá en pantallas pequeñas gracias a CSS */}
            <div className="mobile-auth-links">
              <li className="divider-mobile"></li>
              {isAuthenticated ? (
                <>
                  <li className="mobile-user-info">Hola, {user?.nombre || 'Usuario'}</li>
                  <li><Link to="/mi-cuenta" onClick={closeMenu}>Mi Cuenta</Link></li>
                  <li><Link to="/mis-pedidos" onClick={closeMenu}>Mis Pedidos</Link></li>
                  <li>
                    <button onClick={() => { logout(); closeMenu(); }} className="mobile-logout-btn">
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" onClick={closeMenu} className="mobile-login-btn">Iniciar Sesión</Link></li>
                  <li><Link to="/register" onClick={closeMenu}>Registrarse</Link></li>
                </>
              )}
            </div>
            {/* --- FIN SECCIÓN MÓVIL --- */}

          </ul>
        </nav>

        <div className="header-actions">
          
          <div className="user-icons">
            {/* El user-menu tiene la clase 'desktop-only' para ocultarse en móvil */}
            <div className="user-menu desktop-only">
              <span className="icon-link user-icon-trigger" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                {isAuthenticated ? (
                  <div className="user-initials">{ (user?.nombre && user.nombre.charAt(0)) || (user?.email && user.email.charAt(0)) || 'U' }</div>
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
            
            {/* El carrito SIEMPRE se ve */}
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