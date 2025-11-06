import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './context/AuthContext';
// --- 1. IMPORTA EL PROVEEDOR DE GOOGLE ---
import { GoogleOAuthProvider } from '@react-oauth/google';

// --- LAYOUTS ---
import App from './App.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// --- PÁGINAS ---
import HomePage from './paginas/inicio.jsx';
import ProductosPage from './paginas/productos.jsx';
import DetalleProductoPage from './paginas/DetalleProductoPage.jsx';
import SoportePage from './paginas/soporte.jsx';
import BlogPage from './paginas/blog.jsx';
import LoginPage from './paginas/LoginPage.jsx';
import RegisterPage from './paginas/RegisterPage.jsx';
import CarritoPage from './paginas/CarritoPage.jsx';
import AdminLoginPage from './paginas/AdminLoginPage.jsx';
import ReportesPage from './paginas/ReportesPage.jsx';
import GestionProductosPage from './paginas/GestionProductosPage.jsx';
import CheckoutPage from './paginas/CheckoutPage.jsx';
import MiCuentaPage from './paginas/MiCuentaPage.jsx';
import MisPedidosPage from './paginas/MisPedidosPage.jsx';
import CompraExitosaPage from './paginas/CompraExitosaPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* --- 2. ENVUELVE TODO CON EL PROVEEDOR DE GOOGLE --- */}
    <GoogleOAuthProvider clientId="243549587493-pqmksjaiegdcn626ba4gtqf7ef7i10b7.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            
            {/* --- 1. Rutas Públicas (CON Header y Footer) --- */}
            <Route path="/" element={<App />}>
              <Route index element={<HomePage />} />
              <Route path="productos" element={<ProductosPage />} />
              <Route path="productos/:id" element={<DetalleProductoPage />} />
              <Route path="soporte" element={<SoportePage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="carrito" element={<CarritoPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="mi-cuenta" element={<MiCuentaPage />} />
              <Route path="mis-pedidos" element={<MisPedidosPage />} />
              
              <Route path="compra-exitosa" element={<CompraExitosaPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* --- 2. Ruta de Admin Auth (SIN Header/Footer) --- */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* --- 3. Rutas de Admin (CON AdminHeader) --- */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="reportes" element={<ReportesPage />} />
              <Route path="productos" element={<GestionProductosPage />} />
            </Route>
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);