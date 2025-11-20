import React, { useState } from 'react';
import API_URL from '../config'; // <--- Importar
import './soporte.css';

function SoportePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('enviando');

    try {
      // Usamos API_URL
      const response = await fetch(`${API_URL}/soporte/enviar-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus('exito');
        setName(''); setEmail(''); setMessage('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setStatus('error');
    }
  };

  return (
    <main className="soporte-container">
      <div className="soporte-content">
        <div className="soporte-header">
          <h1 className="soporte-title">Soporte</h1>
          <p className="soporte-description">Contáctanos si tienes dudas.</p>
        </div>
        <form className="soporte-form" onSubmit={handleSubmit}>
          <div className="form-group"><label>Nombre</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="form-group"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="form-group"><label>Mensaje</label><textarea rows="6" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea></div>
          <button type="submit" className="soporte-button" disabled={status === 'enviando'}>{status === 'enviando' ? 'Enviando...' : 'Enviar'}</button>
          {status === 'exito' && <p className="status-message exito">¡Enviado!</p>}
          {status === 'error' && <p className="status-message error">Error al enviar.</p>}
        </form>
      </div>
    </main>
  );
}

export default SoportePage;