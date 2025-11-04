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
import RegisterPage from './paginas/RegisterPage.jsx'; // <-- 1. Importa la nueva página
import CarritoPage from './paginas/CarritoPage.jsx';
import AdminLoginPage from './paginas/AdminLoginPage.jsx';
import ReportesPage from './paginas/ReportesPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        
        {/* Ruta padre que usa tu Layout (App) */}
        <Route path="/" element={<App />}>
          
          {/* Rutas "hijas" que se cargan en el <Outlet> */}
          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="soporte" element={<SoportePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} /> {/* <-- 2. Actualiza esta línea */}
          <Route path="carrito" element={<CarritoPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin/reportes" element={<ReportesPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);