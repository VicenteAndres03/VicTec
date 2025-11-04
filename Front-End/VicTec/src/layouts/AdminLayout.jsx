import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../componentes/AdminHeader';
// (Opcional: puedes crear un AdminFooter si quieres)

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <main className="admin-content">
        <Outlet /> {/* Aquí se renderizan tus páginas de admin */}
      </main>
      {/* <AdminFooter /> */}
    </div>
  );
}

export default AdminLayout;