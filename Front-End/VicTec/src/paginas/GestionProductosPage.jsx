import React, { useState, useEffect } from 'react'; // 1. Importar useEffect
import { useAuth } from '../context/AuthContext'; // 2. Importar useAuth
import './GestionProductosPage.css';

// 3. Quitar el mockProductos

// --- Estado inicial para el formulario ---
const formularioVacio = {
  id: null,
  nombre: '',
  marca: '',
  precio: '',
  stock: '',
  imgUrl: '',
  // 4. Añadir campos que faltan en tu modelo Producto.java
  precioAntiguo: null,
  enOferta: false,
  sku: '',
  categoria: '',
  descripcion: ''
};

function GestionProductosPage() {
  const [productos, setProductos] = useState([]); // 5. Empezar con array vacío
  const [modoForm, setModoForm] = useState('oculto'); 
  const [productoActual, setProductoActual] = useState(formularioVacio);
  
  // 6. Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  // 7. Obtener el header de autenticación
  const { getAuthHeader } = useAuth();

  // 8. Función para cargar productos desde la API
  const loadProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      // El GET es público, no necesita auth
      const response = await fetch('/api/v1/productos'); 
      if (!response.ok) throw new Error('No se pudieron cargar los productos');
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 9. Cargar productos la primera vez
  useEffect(() => {
    loadProductos();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // --- Manejadores del Formulario ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductoActual((prev) => ({
      ...prev,
      // 10. Manejar inputs de tipo 'checkbox'
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 11. REEMPLAZAR handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const esNuevo = modoForm === 'nuevo';
    const url = esNuevo ? '/api/v1/productos' : `/api/v1/productos/${productoActual.id}`;
    const method = esNuevo ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeader(), // <-- 12. ¡Usar el token de Admin!
        body: JSON.stringify(productoActual),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error al guardar el producto');
      }

      // Éxito
      setModoForm('oculto');
      setProductoActual(formularioVacio);
      await loadProductos(); // 13. Recargar la lista de productos

    } catch (err) {
      setFormError(err.message);
    }
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
    setFormError(null);
  };

  // 14. REEMPLAZAR handleEliminar
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await fetch(`/api/v1/productos/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(), // <-- 15. ¡Usar el token de Admin!
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        
        // 16. Recargar la lista
        await loadProductos();

      } catch (err) {
        setError(err.message); // Mostrar error en la tabla
      }
    }
  };

  // --- Renderizado del Formulario (Modal/Overlay) ---
  const renderFormulario = () => (
    <div className="admin-form-overlay">
      <div className="admin-form-container">
        <h2>{modoForm === 'nuevo' ? 'Añadir Nuevo Producto' : 'Editar Producto'}</h2>
        
        {formError && <p className="register-error-message">{formError}</p>}

        {/* 17. Añadimos más campos al formulario */}
        <form onSubmit={handleSubmit}>
          {/* Fila 1: Nombre y Marca */}
          <div className="form-row">
            <div className="form-group-admin">
              <label htmlFor="nombre">Nombre del Producto</label>
              <input type="text" id="nombre" name="nombre" value={productoActual.nombre} onChange={handleInputChange} required />
            </div>
            <div className="form-group-admin">
              <label htmlFor="marca">Marca</label>
              <input type="text" id="marca" name="marca" value={productoActual.marca} onChange={handleInputChange} />
            </div>
          </div>
          
          {/* Fila 2: Precio y Stock */}
          <div className="form-row">
            <div className="form-group-admin">
              <label htmlFor="precio">Precio (CLP$)</label>
              <input type="number" id="precio" name="precio" step="1" min="0" placeholder="19990" value={productoActual.precio} onChange={handleInputChange} required />
            </div>
            <div className="form-group-admin">
              <label htmlFor="stock">Stock</label>
              <input type="number" id="stock" name="stock" min="0" value={productoActual.stock} onChange={handleInputChange} required />
            </div>
          </div>

          {/* Fila 3: Precio Antiguo y SKU */}
          <div className="form-row">
            <div className="form-group-admin">
              <label htmlFor="precioAntiguo">Precio Antiguo (Opcional)</label>
              <input type="number" id="precioAntiguo" name="precioAntiguo" step="1" min="0" placeholder="29990" value={productoActual.precioAntiguo || ''} onChange={handleInputChange} />
            </div>
             <div className="form-group-admin">
              <label htmlFor="sku">SKU</label>
              <input type="text" id="sku" name="sku" value={productoActual.sku} onChange={handleInputChange} />
            </div>
          </div>

          {/* Fila 4: URL de Imagen y Categoría */}
          <div className="form-row">
            <div className="form-group-admin">
              <label htmlFor="imgUrl">URL de la Imagen</label>
              <input type="url" id="imgUrl" name="imgUrl" placeholder="https://ejemplo.com/imagen.png" value={productoActual.imgUrl} onChange={handleInputChange} required />
            </div>
             <div className="form-group-admin">
              <label htmlFor="categoria">Categoría</label>
              <input type="text" id="categoria" name="categoria" value={productoActual.categoria} onChange={handleInputChange} />
            </div>
          </div>

          {/* Fila 5: Descripción */}
           <div className="form-group-admin">
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" value={productoActual.descripcion} onChange={handleInputChange} style={{minHeight: '80px'}} />
          </div>

          {/* Fila 6: Checkbox de Oferta */}
          <div className="form-group-admin" style={{flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
            <input type="checkbox" id="enOferta" name="enOferta" checked={productoActual.enOferta} onChange={handleInputChange} />
            <label htmlFor="enOferta" style={{marginBottom: 0}}>¿Está en oferta?</label>
          </div>
          
          {/* Vista previa de la imagen */}
          {productoActual.imgUrl && (
            <div className="form-image-preview">
              <p>Vista Previa:</p>
              <img src={productoActual.imgUrl} alt="Vista previa" />
            </div>
          )}

          {/* Fila 7: Botones */}
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

      {/* 18. Lógica de Carga y Error */}
      {error && <p className="register-error-message">{error}</p>}
      {loading && <p>Cargando productos...</p>}

      {/* 3. Tabla de Productos */}
      {!loading && !error && (
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
                  <td>CLP${prod.precio.toLocaleString('es-CL')}</td>
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
      )}
    </main>
  );
}

export default GestionProductosPage;