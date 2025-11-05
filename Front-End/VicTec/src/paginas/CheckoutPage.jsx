import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CheckoutPage.css'; // El CSS que crearemos

function CheckoutPage() {
  // Estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    telefono: '',
    metodoPago: 'webpay', // Valor por defecto
  });

  // Manejador genérico para actualizar el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del pedido:", formData);
    // En un futuro, aquí se envían los datos a tu backend
    // para crear la orden antes de ir a pagar.
    alert('Redirigiendo a la pasarela de pago (simulación)...');
  };

  // Simulación del total (basado en tu CarritoPage.jsx)
  const subtotal = 219980; // (39990 + 179990)
  const envio = 3500;
  const totalPedido = subtotal + envio;

  return (
    <main className="checkout-container">
      <div className="checkout-layout">
        
        {/* --- Columna Izquierda: Formulario --- */}
        <div className="checkout-form-section">
          <h1 className="checkout-title">Finalizar Compra</h1>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            
            {/* --- 1. Contacto --- */}
            <div className="form-section">
              <h2>Información de Contacto</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            {/* --- 2. Envío --- */}
            <div className="form-section">
              <h2>Dirección de Envío</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion" placeholder="Calle, número, depto..." value={formData.direccion} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad</label>
                  <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="region">Región</label>
                  <input type="text" id="region" name="region" value={formData.region} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal (Opcional)</label>
                  <input type="text" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input type="tel" id="telefono" name="telefono" placeholder="+56 9 1234 5678" value={formData.telefono} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* --- 3. Método de Pago --- */}
            <div className="form-section">
              <h2>Método de Pago</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input type="radio" name="metodoPago" value="webpay" checked={formData.metodoPago === 'webpay'} onChange={handleChange} />
                  Webpay / MercadoPago (Crédito/Débito)
                </label>
                <label className="payment-option">
                  <input type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleChange} />
                  Transferencia Bancaria
                </label>
              </div>
            </div>

            <button type="submit" className="checkout-submit-button">
              {formData.metodoPago === 'transferencia' ? 'Finalizar Pedido' : 'Ir a Pagar'}
            </button>
          </form>
        </div>

        {/* --- Columna Derecha: Resumen --- */}
        <div className="checkout-summary-section">
          <div className="checkout-summary">
            <h3>Resumen del Pedido</h3>
            {/* Aquí puedes hacer un .map() de los items del carrito si los pasas por 'props' o 'context'
                Por ahora, mostramos el total simulado.
            */}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>CLP${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>CLP${envio.toLocaleString('es-CL')}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>CLP${totalPedido.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default CheckoutPage;