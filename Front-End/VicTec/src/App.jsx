import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
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
import CompraExitosaPage from "./paginas/CompraExitosaPage";
import SoportePage from "./paginas/soporte";
import BlogPage from "./paginas/blog";
import ReportesPage from "./paginas/ReportesPage";
import GestionProductosPage from "./paginas/GestionProductosPage";
import AdminLoginPage from "./paginas/AdminLoginPage";
import TerminosServicioPage from "./paginas/TerminosServicioPage";
import PoliticaPrivacidadPage from "./paginas/PoliticaPrivacidadPage";

// Componentes
import Header from "./componentes/header";
import Footer from "./componentes/Footer";
import AdminLayout from "./layouts/AdminLayout";
import PublicRoute from "./componentes/PublicRoute";
import "./App.css";

// --- Manejador de Redirección de Pagos ---
const PaymentRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isReturningFromPayment = sessionStorage.getItem("leavingForPayment");
    if (isReturningFromPayment === "true") {
      if (!location.pathname.includes("/compra-exitosa")) {
        sessionStorage.removeItem("leavingForPayment");
        navigate("/carrito", { replace: true });
      } else {
        sessionStorage.removeItem("leavingForPayment");
      }
    }
  }, [location, navigate]);

  return null;
};

// --- Rutas Protegidas ---
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useAuth();
  if (loadingAuth) return null; // Esperar a que cargue
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();
  if (loadingAuth) return null;
  // Aceptar roles en dos formatos posibles:
  // - Array de strings: ['ROLE_ADMIN', ...]
  // - Array de objetos: [{ nombre: 'ROLE_ADMIN' }, ...]
  const isAdmin =
    !!user?.roles &&
    Array.isArray(user.roles) &&
    user.roles.some((role) => {
      if (!role) return false;
      if (typeof role === "string") return role === "ROLE_ADMIN";
      return role.nombre === "ROLE_ADMIN";
    });

  return isAdmin ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <PaymentRedirectHandler />
        <Routes>
          {/* Admin */}
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
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Cliente */}
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
                  <Route path="/terminos" element={<TerminosServicioPage />} />
                  <Route
                    path="/privacidad"
                    element={<PoliticaPrivacidadPage />}
                  />
                  {/* Rutas legacy: redirecciones desde URLs antiguas */}
                  <Route
                    path="/politica-privacidad"
                    element={<Navigate to="/privacidad" replace />}
                  />
                  <Route
                    path="/terminos-servicio"
                    element={<Navigate to="/terminos" replace />}
                  />

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
                  />
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

                  <Route
                    path="*"
                    element={
                      <div style={{ padding: "50px", textAlign: "center" }}>
                        <h2>404 - Página no encontrada</h2>
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
