import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css'; // <-- Usará el CSS que ya tienes

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [status, setStatus] = useState('idle'); // idle, submitting, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // --- Validación simple ---
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    console.log('Registrando con:', { name, email, password });
    
    // (Simulación de registro)
    setTimeout(() => {
      // Aquí iría la lógica de registro real
      // Por ahora, solo simulamos un error para probar
      setErrorMessage('El email ya está en uso (simulación).');
      setStatus('error');
    }, 1500);
  };

  return (
    <main className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Únete a VicTec</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          
          {status === 'error' && (
            <p className="register-error-message">
              {errorMessage}
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