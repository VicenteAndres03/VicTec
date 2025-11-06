import React, { useState } from 'react';
// 1. Importa Link y useNavigate
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [nombre, setNombre] = useState(''); // 2. Cambiado de 'name' a 'nombre'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [status, setStatus] = useState('idle'); // idle, submitting, error, success
  const [errorMessage, setErrorMessage] = useState('');

  // 3. Inicializa useNavigate para redirigir
  const navigate = useNavigate();

  // 4. REEMPLAZA TU handleSubmit POR ESTE:
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 5. Asegúrate de que los nombres coincidan con tu modelo Usuario.java (nombre, email, password)
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 6. El backend envía { "error": "email already in use" }
        throw new Error(data.error || 'Error al registrar la cuenta.');
      }

      // ¡ÉXITO!
      setStatus('success');
      // 7. Redirige al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  return (
    <main className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Únete a VicTec</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          
          {/* 8. Mensajes de estado dinámicos */}
          {status === 'error' && (
            <p className="register-error-message">
              {errorMessage}
            </p>
          )}
          {status === 'success' && (
            <p className="register-success-message"> {/* (Añade este estilo en RegisterPage.css si quieres) */}
              ¡Cuenta creada! Redirigiendo al login...
            </p>
          )}

          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input 
              type="text" 
              id="name" 
              required 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={status === 'submitting' || status === 'success'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'submitting' || status === 'success'}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'submitting' || status === 'success'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={status === 'submitting' || status === 'success'}
            />
          </div>
          
          <button 
            type="submit" 
            className="register-button" 
            disabled={status === 'submitting' || status === 'success'}
          >
            {status === 'submitting' ? 'Registrando...' : 'Crear Cuenta'}
          </button>

          <p className="login-link-text">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link">
              Inicia sesión aquí
            </Link>
          </p>

        </form>
      </div>
    </main>
  );
}

export default RegisterPage;