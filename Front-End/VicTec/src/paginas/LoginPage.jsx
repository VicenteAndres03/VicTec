import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config'; // <--- Importar
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      // Usamos API_URL
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => {
          return response.text();
        });
        throw new Error(errorData.error || errorData.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      const { token, ...userData } = data;
      
      if (!token) {
        throw new Error('No se recibió el token del servidor');
      }
      
      login(userData, token);
      navigate('/');

    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
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
            <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          
          <div className="form-options">
            <a href="/forgot-password" className="forgot-password-link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          
          <button type="submit" className="login-button" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Ingresando...' : 'Ingresar'}
          </button>

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