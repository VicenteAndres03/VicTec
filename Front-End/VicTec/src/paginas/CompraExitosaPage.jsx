import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./CompraExitosaPage.css";

const CompraExitosaPage = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");

  return (
    <div className="compra-exitosa-container">
      <div className="compra-exitosa-box">
        <h1>¡Gracias por tu compra!</h1>
        <p>Tu pedido ha sido procesado.</p>

        {paymentId && <p>ID de pago: {paymentId}</p>}

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
