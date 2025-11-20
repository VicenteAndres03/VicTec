import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config'; // <--- 1. IMPORTAR API_URL
import './MiCuentaPage.css';

function MiCuentaPage() {
  const { user, getAuthHeader } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Las nuevas contraseñas no coinciden.');
      return;
    }
    
    if (newPassword.length < 6) {
      setStatus('error');
      setMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // 2. CORRECCIÓN: Usar API_URL para conectar al backend
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar la contraseña');
      }

      setStatus('success');
      setMessage(data.message || 'Contraseña actualizada con éxito.');
      
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };


  if (!user) {
    return (
      <main className="mi-cuenta-container">
        <h1>Error</h1>
        <p>No se pudo cargar la información del usuario. <a href="/login">Por favor, inicia sesión</a>.</p>
      </main>
    );
  }

  return (
    <main className="mi-cuenta-container">
      <h1 className="mi-cuenta-title">Mi Cuenta</h1>
      
      <div className="mi-cuenta-box">
        <h2 className="mi-cuenta-subtitle">Mi Perfil</h2>
        <p>Aquí puedes ver y actualizar tu información personal.</p>
        
        <form className="mi-cuenta-form">
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" defaultValue={user.nombre} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" defaultValue={user.email} disabled />
          </div>
        </form>
      </div>

      <div className="mi-cuenta-box">
        <h2 className="mi-cuenta-subtitle">Cambiar Contraseña</h2>
        
        <form className="mi-cuenta-form" onSubmit={handleSubmitPassword}>
          <div className="form-group">
            <label htmlFor="pass-actual">Contraseña Actual</label>
            <input 
              type="password" 
              id="pass-actual"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pass-nueva">Nueva Contraseña</label>
            <input 
              type="password" 
              id="pass-nueva"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pass-confirmar">Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              id="pass-confirmar"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {status === 'success' && <p className="status-message exito">{message}</p>}
          {status === 'error' && <p className="status-message error">{message}</p>}
          
          <button 
            type="submit" 
            className="mi-cuenta-button"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>

    </main>
  );
}

export default MiCuentaPage;