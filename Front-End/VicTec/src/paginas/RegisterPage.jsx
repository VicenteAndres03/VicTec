import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config'; // <--- Importar
import './RegisterPage.css';

function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

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
      // Usamos API_URL
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar la cuenta.');
      }

      setStatus('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setStatus('submitting');
    setErrorMessage('');
    
    try {
      // Usamos API_URL para Google también
      const response = await fetch(`${API_URL}/auth/google-login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }) 
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión con Google');
      }
      
      const { token, ...userData } = data;
      login(userData, token); 
      setStatus('success');
      navigate('/');
      
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  const handleGoogleError = () => {
    setStatus('error');
    setErrorMessage('El inicio de sesión con Google falló. Inténtalo de nuevo.');
  };

  return (
    <main className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Únete a VicTec</p>
        </div>

        {status === 'error' && <p className="register-error-message">{errorMessage}</p>}
        {status === 'success' && <p className="register-success-message">¡Cuenta creada! Redirigiendo...</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input type="text" id="name" required value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={status === 'submitting' || status === 'success'} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'submitting' || status === 'success'} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={status === 'submitting' || status === 'success'} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input type="password" id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={status === 'submitting' || status === 'success'} />
          </div>
          
          <button type="submit" className="register-button" disabled={status === 'submitting' || status === 'success'}>
            {status === 'submitting' ? 'Procesando...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="google-divider"><span>O</span></div>
        <div className="google-login-container">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap />
        </div>
        
        <p className="login-link-text">
          ¿Ya tienes una cuenta? <Link to="/login" className="login-link">Inicia sesión aquí</Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;