import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { getAuthHeader, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    telefono: '',
    metodoPago: 'webpay',
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para continuar');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      // 1. Crear la dirección
      const direccionResponse = await fetch('/api/v1/direcciones', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          calle: formData.direccion,
          ciudad: formData.ciudad,
          region: formData.region,
          codigoPostal: formData.codigoPostal,
          pais: 'Chile' // Asumimos Chile
        }),
      });
      const direccionData = await direccionResponse.json();
      if (!direccionResponse.ok) throw new Error(direccionData.error || 'Error al guardar la dirección');

      // 2. Crear el pedido
      const pedidoResponse = await fetch('/api/v1/pedidos/crear', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ direccionId: direccionData.id }),
      });
      const pedidoData = await pedidoResponse.json();
      if (!pedidoResponse.ok) throw new Error(pedidoData.error || 'Error al crear el pedido');

      // 3. Crear la preferencia de pago
      const preferenceResponse = await fetch('/api/v1/payment/create-preference', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ pedidoId: pedidoData.id }),
      });
      const preferenceData = await preferenceResponse.json();
      if (!preferenceResponse.ok) throw new Error(preferenceData.error || 'Error al crear la preferencia de pago');

      // 4. Redirigir a Mercado Pago
      window.location.href = preferenceData.init_point;

    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const subtotal = 219980;
  const envio = 3500;
  const totalPedido = subtotal + envio;

  return (
    <main className="checkout-container">
      <div className="checkout-layout">
        <div className="checkout-form-section">
          <h1 className="checkout-title">Finalizar Compra</h1>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            {status === 'error' && <div className="error-message">{error}</div>}

            <div className="form-section">
              <h2>Información de Contacto</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

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

            <button type="submit" className="checkout-submit-button" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Procesando...' : (formData.metodoPago === 'transferencia' ? 'Finalizar Pedido' : 'Ir a Pagar')}
            </button>
          </form>
        </div>

        <div className="checkout-summary-section">
          <div className="checkout-summary">
            <h3>Resumen del Pedido</h3>
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
