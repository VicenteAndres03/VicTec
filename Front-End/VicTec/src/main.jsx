import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './context/AuthContext';
// 1. Importa tu Layout (App) y tus páginas
import App from './App.jsx';
import HomePage from './paginas/inicio.jsx';
import ProductosPage from './paginas/productos.jsx';
import SoportePage from './paginas/soporte.jsx';
import BlogPage from './paginas/blog.jsx';
import LoginPage from './paginas/LoginPage.jsx';
import RegisterPage from './paginas/RegisterPage.jsx';
import CarritoPage from './paginas/CarritoPage.jsx';
import CheckoutPage from './paginas/CheckoutPage';
import MiCuentaPage from './paginas/MiCuentaPage';
import MisPedidosPage from './paginas/MisPedidosPage';

// --- 1. Importa la nueva página de Detalle ---
import DetalleProductoPage from './paginas/DetalleProductoPage.jsx'; 

// --- Importa el AdminLayout y las páginas de admin ---
import AdminLayout from './layouts/AdminLayout.jsx'; 
import AdminLoginPage from './paginas/AdminLoginPage.jsx';
import ReportesPage from './paginas/ReportesPage.jsx';
import GestionProductosPage from './paginas/GestionProductosPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* 2. Envuelve <Routes> con <AuthProvider> */}
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas (usan el Layout 'App') */}
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="productos/:id" element={<DetalleProductoPage />} />
            <Route path="soporte" element={<SoportePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="carrito" element={<CarritoPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            {/* Rutas de Autenticación (sin Header ni Footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="mi-cuenta" element={<MiCuentaPage />} />
            <Route path="mis-pedidos" element={<MisPedidosPage />} />
          </Route>


          {/* Rutas de Admin (usan el Layout 'AdminLayout') */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="reportes" element={<ReportesPage />} />
            <Route path="productos" element={<GestionProductosPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);