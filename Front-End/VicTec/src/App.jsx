import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./componentes/header";
import Footer from "./componentes/Footer";
import "./App.css"; // Importamos los estilos de App

function App() {
  return (
    // Este div será nuestro contenedor flex
    <div className="App">
      <Header />

      {/* 1. Envolvemos el Outlet en un <main> */}
      <main className="app-content">
        <Outlet /> 
      </main>
      
      <Footer />
    </div>
  );
}

export default App;