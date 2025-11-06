import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // 1. PRIMERO verifica si la respuesta fue exitosa (status 200-299)
      if (!response.ok) {
        // 2. Si no fue exitosa, intenta leer el error como texto o JSON
        //    Muchos backends (como el tuyo en AuthController) envían errores en JSON
        const errorData = await response.json().catch(() => {
          // Si falla el .json() (como en tu AuthEntryPointJwt original), lee como texto
          return response.text();
        });

        // 3. Lanza un error con el mensaje del backend o uno genérico
        throw new Error(errorData.error || errorData.message || 'Error al iniciar sesión');
      }

      // 4. Si llegas aquí, SABES que la respuesta es 'ok' y puedes parsear el JSON
      const data = await response.json();
      
      console.log('Datos recibidos del login:', data);

      // El backend ahora devuelve el usuario y el token
      const { token, ...userData } = data;
      
      if (!token) {
        throw new Error('No se recibió el token del servidor');
      }
      
      console.log('Guardando token y datos de usuario...');
      login(userData, token);
      
      // Verificar que se guardó correctamente
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        console.error('Error: El token no se guardó en localStorage');
        throw new Error('Error al guardar la sesión');
      }
      
      console.log('Login exitoso, redirigiendo...');
      // Navegar a la página principal después del login
      navigate('/');

    } catch (err) {
      setStatus('error');
      // err.message ahora contendrá el error de red o el texto del backend
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
            <div className="error-message">{error}</div>
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
