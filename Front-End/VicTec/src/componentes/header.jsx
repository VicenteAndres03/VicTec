import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./header.css";
import logo from "../assets/Circulo.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();

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
            
            {/* --- INICIO DE LA MODIFICACIÓN --- */}
            {/* Este enlace solo se muestra si:
              1. El usuario está autenticado.
              2. El objeto 'user' existe.
              3. El array 'user.roles' incluye "ROLE_ADMIN".
            */}
            {isAuthenticated && user?.roles?.includes('ROLE_ADMIN') && (
              <li className="admin-panel-link">
                <Link to="/admin/productos">Panel Admin</Link>
              </li>
            )}
            {/* --- FIN DE LA MODIFICACIÓN --- */}

          </ul>
        </nav>

        <div className="header-actions">
          
          <div className="user-icons">
            <div className="user-menu">
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