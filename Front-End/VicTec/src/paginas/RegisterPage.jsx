import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css'; // Usaremos un CSS dedicado

// --- 1. Función para validar el email con Regex ---
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, error
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado específico para el error de email
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Reseteamos los errores
    setErrorMessage('');
    setEmailError('');
    setStatus('idle');

    // --- 2. Validamos el email PRIMERO ---
    if (!validateEmail(email)) {
      setEmailError('Por favor, ingresa un email válido.');
      return; // Detenemos el envío
    }

    // --- 3. Validamos la contraseña ---
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setStatus('error');
      return;
    }
    
    setStatus('submitting');
    console.log('Registrando con:', { name, email, password });
    
    // Aquí iría la lógica de registro con tu backend (API)
    // ...
  };

  return (
    <main className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Únete a la comunidad VicTec</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          
          {/* Mensaje de error general */}
          {status === 'error' && (
            <p className="register-error-message">
              {errorMessage || 'Error al registrar la cuenta.'}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input 
              type="text" 
              id="name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            />
            {/* 4. Mostramos el error de email si existe */}
            {emailError && <span className="error-text">{emailError}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            />
          </div>
          
          <button 
            type="submit" 
            className="register-button" 
            disabled={status === 'submitting'}
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