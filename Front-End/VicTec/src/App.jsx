import React from "react";
import Header from "./componentes/header"; // Importa tu header
import Footer from "./componentes/Footer"; // 1. Importa tu nuevo footer
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header /> {/* ¡Aquí está tu header! */}
      <main className="content">
        {/* El espacio en blanco que ves ahora */}
        {/* Aquí irán tus componentes de productos, etc. */}
      </main>
      <Footer /> {/* 2. ¡Aquí está tu footer! */}
    </div>
  );
}

export default App;
