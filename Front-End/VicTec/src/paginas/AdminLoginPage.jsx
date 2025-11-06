import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importar useAuth
import './AdminLoginPage.css';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Obtener la función de login del contexto

  // 3. Convertir handleSubmit en una función async
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // 4. Llamar a la API de login real
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // 5. ¡Validación de Rol!
      const { token, ...userData } = data;
      if (userData.roles && userData.roles.includes('ROLE_ADMIN')) {
        // 6. Es admin, guardamos la sesión
        login(userData, token);
        
        setStatus('success');
        console.log('¡Inicio de sesión de admin exitoso!');
        
        setTimeout(() => {
          navigate('/admin/reportes');
        }, 1500);

      } else {
        // 7. Es un usuario normal, no un admin
        throw new Error('No tienes permisos de administrador.');
      }

    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <main className="admin-login-container">
      <div className="admin-login-box">
        
        {status === 'success' ? (
          <div className="admin-login-success">
            <h3>¡Bienvenido, Admin!</h3>
            <p>Redirigiendo al panel...</p>
          </div>
        ) : (
          
          <>
            <div className="admin-login-header">
              <h1 className="admin-login-title">Acceso de Administrador</h1>
              <p className="admin-login-subtitle">Gestión de VicTec</p>
            </div>

            <form className="admin-login-form" onSubmit={handleSubmit}>
              
              {status === 'error' && (
                <p className="admin-login-error">
                  {errorMessage}
                </p>
              )}

              <div className="form-group">
                <label htmlFor="email">Email de Administrador</label>
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
              
              <button 
                type="submit" 
                className="admin-login-button" 
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Verificando...' : 'Ingresar como Admin'}
              </button>

              <p className="client-login-link-text">
                ¿No eres administrador?{' '}
                <Link to="/login" className="client-login-link">
                  Volver al inicio de sesión
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default AdminLoginPage;