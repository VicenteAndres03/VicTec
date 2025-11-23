import React from "react";
import "./LegalPages.css";

function TerminosServicioPage() {
  return (
    <main className="legal-container">
      <div className="legal-content">
        <h1 className="legal-title">Términos de Servicio</h1>
        <span className="legal-date">Vigencia desde: Noviembre 2025</span>

        <div className="legal-text">
          <p>
            Bienvenido a VicTec. Al acceder a nuestro sitio web y utilizar
            nuestros servicios, aceptas cumplir con los siguientes términos y
            condiciones.
          </p>

          <h2>1. Uso del Sitio</h2>
          <p>
            Te comprometes a utilizar nuestro sitio web solo para fines legales
            y de una manera que no infrinja los derechos de, restrinja o inhiba
            el uso y disfrute del sitio por parte de cualquier otra persona.
          </p>

          <h2>2. Productos y Precios</h2>
          <p>
            Nos esforzamos por mostrar con precisión los colores y
            características de nuestros productos. Sin embargo, no garantizamos
            que la visualización en tu monitor sea exacta. Todos los precios
            están en Pesos Chilenos (CLP) y están sujetos a cambios sin previo
            aviso.
          </p>

          <h2>3. Envíos Internacionales</h2>
          <p>
            Algunos de nuestros productos son importados. El tiempo de entrega
            estimado para estos productos puede variar entre 15 y 30 días
            hábiles. Al realizar una compra, aceptas estos tiempos de espera.
          </p>

          <h2>4. Pagos</h2>
          <p>
            Aceptamos pagos a través de Mercado Pago y Webpay. Al proporcionar
            información de pago, declaras que estás autorizado para utilizar el
            método de pago elegido.
          </p>

          <h2>5. Cambios en los Términos</h2>
          <p>
            VicTec se reserva el derecho de modificar estos términos en
            cualquier momento. Es tu responsabilidad revisar esta página
            periódicamente para estar al tanto de cualquier cambio.
          </p>
        </div>
      </div>
    </main>
  );
}

export default TerminosServicioPage;
