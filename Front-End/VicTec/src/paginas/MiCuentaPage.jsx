import React, { useState } from 'react'; // 1. Importar useState
import { useAuth } from '../context/AuthContext';
import './MiCuentaPage.css';

function MiCuentaPage() {
  // 2. Obtenemos 'user' y 'getAuthHeader' del contexto
  const { user, getAuthHeader } = useAuth();

  // 3. Estados para el formulario de contraseña
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 4. Estados para los mensajes de éxito/error
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [message, setMessage] = useState('');

  // 5. Handler para enviar el formulario de contraseña
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    // Validación 1: Confirmación de contraseña
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Las nuevas contraseñas no coinciden.');
      return;
    }
    
    // Validación 2: Largo mínimo
    if (newPassword.length < 6) {
      setStatus('error');
      setMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // 6. Llamada al nuevo endpoint del backend
      const response = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: getAuthHeader(), // ¡Importante enviar el token!
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      const data = await response.json();

      if (!response.ok) {
        // Captura errores del backend (ej: "contraseña incorrecta")
        throw new Error(data.error || 'No se pudo actualizar la contraseña');
      }

      // 7. Éxito
      setStatus('success');
      setMessage(data.message || 'Contraseña actualizada con éxito.');
      
      // Limpiamos los campos
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      // 8. Error
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
            {/* Usamos 'user.nombre' que viene del login */}
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
        
        {/* 9. Conectamos el formulario al handler */}
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
          {/* 10. Campo añadido para confirmar contraseña */}
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

          {/* 11. Mostramos mensajes de estado */}
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