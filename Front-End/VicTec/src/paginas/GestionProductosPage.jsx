import React, { useState } from 'react';
import './GestionProductosPage.css'; // Crearemos este CSS

// --- Datos de simulación ---
const mockProductos = [
  {
    id: 1,
    nombre: 'Auriculares Pro-Gen',
    marca: 'VicTec',
    precio: 39990, // Precio en CLP
    stock: 50,
    imgUrl: 'https://i.imgur.com/8Q1mP0B.png', // URL de ejemplo
  },
  {
    id: 2,
    nombre: 'Smartwatch X5',
    marca: 'VicTec',
    precio: 179990, // Precio en CLP
    stock: 25,
    imgUrl: 'https://i.imgur.com/7H2j3bE.png', // URL de ejemplo
  },
];
// -------------------------

// --- Estado inicial para el formulario ---
const formularioVacio = {
  id: null,
  nombre: '',
  marca: '',
  precio: '',
  stock: '',
  imgUrl: '',
};

function GestionProductosPage() {
  const [productos, setProductos] = useState(mockProductos);
  const [modoForm, setModoForm] = useState('oculto'); // 'oculto', 'nuevo', 'editar'
  const [productoActual, setProductoActual] = useState(formularioVacio);

  // --- Manejadores del Formulario ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Lógica (simulada) para guardar
    if (modoForm === 'nuevo') {
      // Añadir nuevo producto (simulamos un ID)
      const nuevoProducto = { ...productoActual, id: Date.now() };
      setProductos((prev) => [nuevoProducto, ...prev]);
      console.log('Añadiendo producto:', nuevoProducto);
      
    } else if (modoForm === 'editar') {
      // Actualizar producto existente
      setProductos((prev) =>
        prev.map((p) => (p.id === productoActual.id ? productoActual : p))
      );
      console.log('Actualizando producto:', productoActual);
    }

    // Resetear formulario
    setModoForm('oculto');
    setProductoActual(formularioVacio);
  };

  // --- Manejadores de Botones ---
  const handleAbrirFormNuevo = () => {
    setProductoActual(formularioVacio);
    setModoForm('nuevo');
  };

  const handleAbrirFormEditar = (producto) => {
    setProductoActual(producto);
    setModoForm('editar');
  };

  const handleCancelar = () => {
    setModoForm('oculto');
    setProductoActual(formularioVacio);
  };

  const handleEliminar = (id) => {
    // Simulación de confirmación
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
      console.log('Eliminando producto ID:', id);
    }
  };

  // --- Renderizado del Formulario (Modal/Overlay) ---
  const renderFormulario = () => (
    <div className="admin-form-overlay">
      <div className="admin-form-container">
        <h2>{modoForm === 'nuevo' ? 'Añadir Nuevo Producto' : 'Editar Producto'}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Fila 1: Nombre y Marca */}
          <div className="form-row">
            <div className="form-group-admin">
              <label htmlFor="nombre">Nombre del Producto</label>
              <input
                type="text" id="nombre" name="nombre"
                value={productoActual.nombre} onChange={handleInputChange} required
              />
            </div>
            <div className="form-group-admin">
              <label htmlFor="marca">Marca</label>
              <input
                type="text" id="marca" name="marca"
                value={productoActual.marca} onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Fila 2: Precio y Stock */}
          <div className="form-row">
            <div className="form-group-admin">
              {/* --- CAMBIO AQUÍ (Label y step) --- */}
              <label htmlFor="precio">Precio (CLP$)</label>
              <input
                type="number" id="precio" name="precio" step="1" min="0"
                placeholder="19990"
                value={productoActual.precio} onChange={handleInputChange} required
              />
            </div>
            <div className="form-group-admin">
              <label htmlFor="stock">Stock</label>
              <input
                type="number" id="stock" name="stock" min="0"
                value={productoActual.stock} onChange={handleInputChange} required
              />
            </div>
          </div>

          {/* Fila 3: URL de Imagen */}
          <div className="form-group-admin">
            <label htmlFor="imgUrl">URL de la Imagen</label>
            <input
              type="url" id="imgUrl" name="imgUrl"
              placeholder="https://ejemplo.com/imagen.png"
              value={productoActual.imgUrl} onChange={handleInputChange} required
            />
          </div>
          
          {/* Vista previa de la imagen */}
          {productoActual.imgUrl && (
            <div className="form-image-preview">
              <p>Vista Previa:</p>
              <img src={productoActual.imgUrl} alt="Vista previa" />
            </div>
          )}

          {/* Fila 4: Botones */}
          <div className="form-buttons">
            <button type="button" className="admin-button button-cancel" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit" className="admin-button button-save">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // --- Renderizado Principal ---
  return (
    <main className="admin-gestion-container">
      {/* 1. Overlay del Formulario */}
      {modoForm !== 'oculto' && renderFormulario()}

      {/* 2. Cabecera de la Página */}
      <div className="admin-gestion-header">
        <h1>Gestión de Productos</h1>
        <button className="admin-button button-add" onClick={handleAbrirFormNuevo}>
          + Añadir Producto
        </button>
      </div>

      {/* 3. Tabla de Productos */}
      <div className="admin-table-container">
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td className="cell-image">
                  <img src={prod.imgUrl} alt={prod.nombre} />
                </td>
                <td className="cell-nombre">{prod.nombre}</td>
                <td>{prod.marca}</td>
                {/* --- CAMBIO AQUÍ (Símbolo de moneda) --- */}
                <td>CLP${prod.precio}</td>
                <td>{prod.stock}</td>
                <td className="cell-actions">
                  <button 
                    className="admin-button button-edit"
                    onClick={() => handleAbrirFormEditar(prod)}
                  >
                    Editar
                  </button>
                  <button 
                    className="admin-button button-delete"
                    onClick={() => handleEliminar(prod.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default GestionProductosPage;