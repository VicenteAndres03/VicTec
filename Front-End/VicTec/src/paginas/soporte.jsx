import React, { useState } from 'react';
import './soporte.css'; // El CSS para esta página

function SoportePage() {
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Estado para el envío del formulario
  // Puede ser: "idle" (normal), "enviando", "exito", "error"
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('enviando');

    try {
      const response = await fetch('http://localhost:8080/api/v1/soporte/enviar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus('exito');
        // Limpiamos el formulario
        setName('');
        setEmail('');
        setMessage('');
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
          <h1 className="soporte-title">Centro de Soporte</h1>
          <p className="soporte-description">
            ¿Tienes alguna pregunta o problema? Completa el formulario
            y nuestro equipo se pondrá en contacto contigo.
          </p>
        </div>

        <form className="soporte-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tu Nombre</label>
            <input 
              type="text" id="name" required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Tu Email</label>
            <input 
              type="email" id="email" required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Tu Mensaje</label>
            <textarea 
              id="message" rows="6" required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="soporte-button" 
            disabled={status === 'enviando'}
          >
            {status === 'enviando' ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
          
          {/* Mensajes de estado */}
          {status === 'exito' && (
            <p className="status-message exito">¡Mensaje enviado con éxito!</p>
          )}
          {status === 'error' && (
            <p className="status-message error">Hubo un error al enviar. Intenta de nuevo.</p>
          )}
        </form>
      </div>
    </main>
  );
}

export default SoportePage;