import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";
import "./CompraExitosaPage.css";

const CompraExitosaPage = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const { getAuthHeader, isAuthenticated } = useAuth();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Al montar, intentamos limpiar el carrito en el backend.
    // No asumimos la existencia de una ruta /carrito/clear, por eso
    // obtenemos los items y llamamos al endpoint existente /carrito/remove/:id
    const clearCart = async () => {
      if (!isAuthenticated) return; // Si no está autenticado, nada que limpiar

      try {
        const headers = getAuthHeader();

        const resp = await fetch(`${API_URL}/carrito`, { headers });
        if (!resp.ok) {
          // Si no hay carrito o error, salimos silenciosamente
          return setCleared(true);
        }

        const data = await resp.json();
        const items = data.items || [];

        // Si no hay items, ya está limpio
        if (items.length === 0) return setCleared(true);

        // Borrar cada item individualmente (endpoint ya usado en el proyecto)
        await Promise.all(
          items.map((it) => {
            const productoId = it?.producto?.id;
            if (!productoId) return Promise.resolve();
            return fetch(`${API_URL}/carrito/remove/${productoId}`, {
              method: "DELETE",
              headers,
            });
          })
        );

        setCleared(true);
      } catch (err) {
        console.error("Error limpiando carrito después de la compra:", err);
        setCleared(true); // no bloquear la experiencia del usuario
      }
    };

    clearCart();
  }, [getAuthHeader, isAuthenticated]);

  return (
    <div className="compra-exitosa-container">
      <div className="compra-exitosa-box">
        <h1>¡Gracias por tu compra!</h1>
        <p>Tu pedido ha sido procesado.</p>

        {paymentId && <p>ID de pago: {paymentId}</p>}

        {!cleared && (
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Limpiando carrito...
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          <Link
            to="/"
            className="boton-secundario"
            style={{ marginRight: "10px" }}
          >
            Volver al Inicio
          </Link>
          <Link to="/mis-pedidos" className="boton-primario">
            Ver mis Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompraExitosaPage;
