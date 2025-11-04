import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// 1. Importa tu Layout (App) y tus páginas
import App from './App.jsx';
import HomePage from './paginas/inicio.jsx';
import ProductosPage from './paginas/productos.jsx';
import SoportePage from './paginas/soporte.jsx';
import BlogPage from './paginas/blog.jsx';
import LoginPage from './paginas/LoginPage.jsx';
import RegisterPage from './paginas/RegisterPage.jsx';
import CarritoPage from './paginas/CarritoPage.jsx';

// --- Importa el AdminLayout y las páginas de admin ---
import AdminLayout from './layouts/AdminLayout.jsx'; 
import AdminLoginPage from './paginas/AdminLoginPage.jsx';
import ReportesPage from './paginas/ReportesPage.jsx';
// --- 1. Importa la nueva página de gestión ---
import GestionProductosPage from './paginas/GestionProductosPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        
        {/* --- RUTAS PÚBLICAS (con Header y Footer) --- */}
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="soporte" element={<SoportePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="carrito" element={<CarritoPage />} />
        </Route>

        {/* --- RUTAS DE ADMIN --- */}
        
        {/* Ruta de Login (sin layout) */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Rutas protegidas (con AdminHeader) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="reportes" element={<ReportesPage />} />
          
          {/* --- 2. Añade la nueva ruta aquí --- */}
          <Route path="productos" element={<GestionProductosPage />} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>,
);