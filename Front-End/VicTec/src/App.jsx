import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Importación de Páginas
import HomePage from "./paginas/inicio";
import LoginPage from "./paginas/LoginPage";
import RegisterPage from "./paginas/RegisterPage";
import ProductosPage from "./paginas/productos";
import DetalleProductoPage from "./paginas/DetalleProductoPage";
import CarritoPage from "./paginas/CarritoPage";
import CheckoutPage from "./paginas/CheckoutPage";
import MiCuentaPage from "./paginas/MiCuentaPage";
import MisPedidosPage from "./paginas/MisPedidosPage";
import CompraExitosaPage from "./paginas/CompraExitosaPage"; // <--- Asegúrate de tener esto importado
import SoportePage from "./paginas/soporte";
import BlogPage from "./paginas/blog";
import ReportesPage from "./paginas/ReportesPage";
import GestionProductosPage from "./paginas/GestionProductosPage";
import AdminLoginPage from "./paginas/AdminLoginPage";
import TerminosServicioPage from "./paginas/TerminosServicioPage";
import PoliticaPrivacidadPage from "./paginas/PoliticaPrivacidadPage";

// Layouts y Componentes
import Header from "./componentes/header";
import Footer from "./componentes/Footer";
import AdminLayout from "./layouts/AdminLayout";
import PublicRoute from "./componentes/PublicRoute";
import "./App.css";

// Componente para Rutas Protegidas (Usuarios Logueados)
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useAuth();
  if (loadingAuth) return <div>Cargando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente para Rutas de Admin
const AdminRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();
  if (loadingAuth) return <div>Cargando...</div>;
  // Verificamos si el usuario tiene el rol ROLE_ADMIN
  const isAdmin = user?.roles?.some((role) => role.nombre === "ROLE_ADMIN");
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- RUTAS DE ADMINISTRADOR (Sin Header/Footer normal) --- */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<ReportesPage />} />
                    <Route
                      path="productos"
                      element={<GestionProductosPage />}
                    />
                    <Route path="reportes" element={<ReportesPage />} />
                    {/* Redirección por defecto en admin */}
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* --- RUTAS PÚBLICAS Y DE CLIENTE (Con Header y Footer) --- */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/productos" element={<ProductosPage />} />
                  <Route
                    path="/productos/:id"
                    element={<DetalleProductoPage />}
                  />
                  <Route path="/soporte" element={<SoportePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  {/* Rutas Legales */}
                  <Route path="/terminos" element={<TerminosServicioPage />} />
                  <Route
                    path="/privacidad"
                    element={<PoliticaPrivacidadPage />}
                  />
                  {/* Rutas de Autenticación (Solo para no logueados) */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <RegisterPage />
                      </PublicRoute>
                    }
                  />
                  {/* Rutas Protegidas de Cliente */}
                  <Route
                    path="/carrito"
                    element={
                      <PrivateRoute>
                        <CarritoPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <PrivateRoute>
                        <CheckoutPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/compra-exitosa"
                    element={
                      <PrivateRoute>
                        <CompraExitosaPage />
                      </PrivateRoute>
                    }
                  />{" "}
                  {/* <--- ESTA ES LA IMPORTANTE */}
                  <Route
                    path="/mi-cuenta"
                    element={
                      <PrivateRoute>
                        <MiCuentaPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/mis-pedidos"
                    element={
                      <PrivateRoute>
                        <MisPedidosPage />
                      </PrivateRoute>
                    }
                  />
                  {/* Ruta 404 para cliente */}
                  <Route
                    path="*"
                    element={
                      <div style={{ padding: "100px", textAlign: "center" }}>
                        <h2>Página no encontrada (404)</h2>
                      </div>
                    }
                  />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
