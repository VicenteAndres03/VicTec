import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// 1. Importa tu Layout (App) y tus páginas
import App from './App.jsx';
import HomePage from './paginas/inicio.jsx';
import ProductosPage from './paginas/productos.jsx';
import SoportePage from './paginas/soporte.jsx'; // <-- 1. Importa la nueva página

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        
        {/* Ruta padre que usa tu Layout (App) */}
        <Route path="/" element={<App />}>
          
          {/* Rutas "hijas" que se cargan en el <Outlet> */}
          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="soporte" element={<SoportePage />} /> {/* <-- 2. Añade esta línea */}
          
          {/*
          <Route path="blog" element={<div>Página de Blog</div>} />
          */}

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);