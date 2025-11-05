import React from 'react';
import { useAuth } from '../context/AuthContext'; // Importamos el hook
import './MiCuentaPage.css'; // Crearemos este CSS

function MiCuentaPage() {
  // Obtenemos el usuario del contexto
  const { user } = useAuth();

  // Si por alguna razón el usuario no está (ej. recargó la pág y no hemos
  // implementado persistencia), mostramos un mensaje.
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
        <form className="mi-cuenta-form">
          <div className="form-group">
            <label htmlFor="pass-actual">Contraseña Actual</label>
            <input type="password" id="pass-actual" />
          </div>
          <div className="form-group">
            <label htmlFor="pass-nueva">Nueva Contraseña</label>
            <input type="password" id="pass-nueva" />
          </div>
          <button type="submit" className="mi-cuenta-button">Actualizar Contraseña</button>
        </form>
      </div>

    </main>
  );
}

export default MiCuentaPage;