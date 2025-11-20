import React from 'react';
import './LegalPages.css';

function PoliticaPrivacidadPage() {
  return (
    <main className="legal-container">
      <div className="legal-content">
        <h1 className="legal-title">Política de Privacidad</h1>
        <span className="legal-date">Última actualización: Noviembre 2025</span>

        <div className="legal-text">
          <p>
            En VicTec, valoramos tu confianza y nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuestro sitio web o realizas una compra.
          </p>

          <h2>1. Información que Recopilamos</h2>
          <p>
            Podemos recopilar información personal que tú nos proporcionas voluntariamente, como tu nombre, dirección de correo electrónico, dirección de envío y número de teléfono al registrarte o realizar un pedido.
          </p>

          <h2>2. Uso de la Información</h2>
          <p>
            Utilizamos la información que recopilamos para:
          </p>
          <ul>
            <li>Procesar y completar tus pedidos.</li>
            <li>Comunicarnos contigo sobre el estado de tu compra.</li>
            <li>Mejorar nuestro sitio web y servicio al cliente.</li>
            <li>Enviarte actualizaciones o promociones (si has aceptado recibirlas).</li>
          </ul>

          <h2>3. Protección de Datos</h2>
          <p>
            Implementamos medidas de seguridad para mantener la seguridad de tu información personal. Tus datos sensibles (como contraseñas) se almacenan encriptados. No vendemos ni compartimos tu información personal con terceros con fines comerciales.
          </p>

          <h2>4. Pagos y Terceros</h2>
          <p>
            Para procesar los pagos, utilizamos servicios seguros de terceros como Mercado Pago. VicTec no almacena los datos completos de tu tarjeta de crédito o débito en nuestros servidores.
          </p>

          <h2>5. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política, puedes contactarnos a través de nuestra página de Soporte o escribiendo a contacto@victec.cl.
          </p>
        </div>
      </div>
    </main>
  );
}

export default PoliticaPrivacidadPage;