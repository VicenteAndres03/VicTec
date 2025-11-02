import React from 'react';
import Header from './componentes/header'; // Importa tu nuevo header
import './App.css'; // Estilos generales de App

function App() {
  return (
    <div className="App">
      <Header /> {/* ¡Aquí está tu header! */}

      {/* El resto del contenido de tu página irá aquí abajo */}
      <main className="content">
        {/* Aquí irán tus componentes de productos, etc. */}
      </main>
    </div>
  );
}

export default App;
