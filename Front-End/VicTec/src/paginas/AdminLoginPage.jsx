import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importa useNavigate
import './AdminLoginPage.css';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, error, success
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate(); // 2. Inicializa el hook

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    // Validación de Email
    if (email.toLowerCase() !== 'vixdeev@gmail.com') {
      setErrorMessage('Acceso denegado. Correo de administrador incorrecto.');
      setStatus('error');
      return;
    }

    // Validación de Contraseña
    if (password !== '6672960v') {
      setErrorMessage('Contraseña de administrador incorrecta.');
      setStatus('error');
      return;
    }

    // --- 3. Éxito y Redirección ---
    console.log('¡Inicio de sesión de admin exitoso!');
    setStatus('success');
    
    // Esperamos 1.5 segundos para que el admin vea el mensaje
    // y luego lo redirigimos al panel de reportes.
    setTimeout(() => {
      navigate('/admin/reportes'); // 4. Redirige a la página de reportes
    }, 1500); 
  };

  return (
    <main className="admin-login-container">
      <div className="admin-login-box">
        
        {/* Si el login es exitoso, muestra el saludo */}
        {status === 'success' ? (
          <div className="admin-login-success">
            <h3>¡Bienvenido, Admin!</h3>
            {/* 4. Mensaje actualizado */}
            <p>Redirigiendo al panel...</p>
          </div>
        ) : (
          
          /* Si no, muestra el formulario */
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