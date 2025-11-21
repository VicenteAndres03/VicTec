import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // <--- Importar Google
import { useAuth } from '../context/AuthContext';
import API_URL from '../config'; 
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login } = useAuth();

  // --- LOGIN NORMAL (Email/Pass) ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al iniciar sesión');
      }

      const data = await response.json();
      const { token, ...userData } = data;
      
      if (!token) throw new Error('No se recibió el token del servidor');
      
      login(userData, token);
      navigate('/');

    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  // --- LOGIN CON GOOGLE (Nuevo) ---
  const handleGoogleSuccess = async (credentialResponse) => {
    setStatus('submitting');
    setError(null);
    
    try {
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
      navigate('/'); // Redirigir al inicio
      
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const handleGoogleError = () => {
    setStatus('error');
    setError('El inicio de sesión con Google falló.');
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">Bienvenido de vuelta a VicTec</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {status === 'error' && (
            <div className="login-error-message">{error}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'submitting'} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={status === 'submitting'} />
          </div>
          
          <button type="submit" className="login-button" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Ingresando...' : 'Ingresar'}
          </button>

          {/* --- BOTÓN DE GOOGLE --- */}
          <div className="google-divider"><span>O ingresa con</span></div>
          <div className="google-login-container">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={handleGoogleError} 
              useOneTap 
              theme="filled_blue"
              shape="pill"
            />
          </div>

          <p className="register-link-text">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="register-link">
              Regístrate aquí
            </Link>
          </p>
          <p className="admin-link-text">
            ¿Eres administrador?{' '}
            <Link to="/admin/login" className="admin-link">
              Inicia aquí
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;