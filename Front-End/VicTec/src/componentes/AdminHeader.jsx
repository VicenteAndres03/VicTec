import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AdminHeader.css'; // CSS dedicado para este header

function AdminHeader() {
  
  // NavLink nos permite aplicar un estilo al enlace "activo"
  const getNavLinkClass = ({ isActive }) => {
    return isActive ? 'admin-nav-link active' : 'admin-nav-link';
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        
        {/* --- Logo/Marca del Panel --- */}
        <Link to="/admin/reportes" className="admin-brand">
          VicTec <span>/ Panel de Admin</span>
        </Link>

        {/* --- Navegación del Panel --- */}
        <nav className="admin-nav">
          <NavLink to="/admin/reportes" className={getNavLinkClass}>
            Reportes
          </NavLink>
          <NavLink to="/admin/productos" className={getNavLinkClass}>
            Gestionar Productos
          </NavLink>
          {/* (Puedes añadir más links aquí después) */}
        </nav>

        {/* --- Salir --- */}
        <div className="admin-user-actions">
          {/* Este <Link to="/"> te lleva de vuelta a la tienda */}
          <Link to="/" className="admin-logout-button">
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;