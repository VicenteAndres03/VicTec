import React, { useState } from 'react';
// 1. Importa Link, useNavigate, y los hooks de Google y Auth
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [status, setStatus] = useState('idle'); // idle, submitting, error, success
  const [errorMessage, setErrorMessage] = useState('');

  // 2. Inicializa useNavigate y tu hook de Auth
  const navigate = useNavigate();
  const { login } = useAuth();

  // --- Handler para el formulario de registro manual ---
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
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar la cuenta.');
      }

      // ¡ÉXITO!
      setStatus('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  // --- 3. Handler para el ÉXITO de Google Login ---
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Token de Google recibido:", credentialResponse.credential);
    setStatus('submitting');
    setErrorMessage('');
    
    try {
      // 4. Llamamos al NUEVO endpoint del backend que discutimos
      const response = await fetch('/api/v1/auth/google-login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos el token de Google al backend para que lo verifique
        body: JSON.stringify({ token: credentialResponse.credential }) 
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión con Google');
      }
      
      // 5. El backend nos devuelve NUESTRO token (VicTec) y los datos del usuario
      const { token, ...userData } = data;
      
      // Usamos la misma función 'login' de nuestro AuthContext
      login(userData, token); 
      
      setStatus('success');
      navigate('/'); // Lo enviamos al inicio
      
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  // --- 6. Handler para el ERROR de Google Login ---
  const handleGoogleError = () => {
    console.log('Login con Google fallido');
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

        {/* Mensajes de estado (se aplican a ambos métodos) */}
        {status === 'error' && (
          <p className="register-error-message">
            {errorMessage}
          </p>
        )}
        {status === 'success' && (
          <p className="register-success-message">
            ¡Cuenta creada! Redirigiendo al login...
          </p>
        )}

        {/* --- Formulario de Registro Manual --- */}
        <form className="register-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input 
              type="text" id="name" required 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={status === 'submitting' || status === 'success'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" id="email" required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'submitting' || status === 'success'}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" id="password" required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'submitting' || status === 'success'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input 
              type="password" id="confirmPassword" required 
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
            {status === 'submitting' ? 'Procesando...' : 'Crear Cuenta'}
          </button>
        </form>
        
        {/* --- 7. Divisor y Botón de Google --- */}
        <div className="google-divider">
          <span>O</span>
        </div>
        
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap // Intenta loguear automáticamente si ya tiene sesión de Google
          />
        </div>
        {/* --- Fin de la sección de Google --- */}
        
        <p className="login-link-text">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="login-link">
            Inicia sesión aquí
          </Link>
        </p>

      </div>
    </main>
  );
}

export default RegisterPage;