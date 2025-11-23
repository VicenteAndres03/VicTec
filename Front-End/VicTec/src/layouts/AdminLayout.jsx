import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../componentes/AdminHeader";
// (Opcional: puedes crear un AdminFooter si quieres)

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <main className="admin-content">
        {/* Si se pasan `children` (p. ej. <Routes>...</Routes>), renderizarlos; si no, usar Outlet */}
        {children ? children : <Outlet />}
      </main>
      {/* <AdminFooter /> */}
    </div>
  );
}

export default AdminLayout;
