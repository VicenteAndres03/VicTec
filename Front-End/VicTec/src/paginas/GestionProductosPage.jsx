import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config'; 
import './GestionProductosPage.css';

// --- Estado inicial para el formulario ---
const formularioVacio = {
  id: null,
  nombre: '',
  marca: '',
  precio: '',
  stock: '',
  imgUrl: '',
  precioAntiguo: null,
  enOferta: false,
  sku: '',
  categoria: '', 
  descripcion: ''
};

const CATEGORIAS_DISPONIBLES = [
  { valor: 'Audio', texto: 'Audio (Audífonos, Parlantes)' },
  { valor: 'Smartwatch', texto: 'Smartwatches y Wearables' },
  { valor: 'Perifericos', texto: 'Periféricos (Teclados, Mouse)' },
  { valor: 'Drones', texto: 'Drones y Accesorios' },
  { valor: 'Accesorios', texto: 'Accesorios (Cables, Cargadores)' },
];

function GestionProductosPage() {
  const [productos, setProductos] = useState([]);
  const [modoForm, setModoForm] = useState('oculto'); 
  const [productoActual, setProductoActual] = useState(formularioVacio);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const { getAuthHeader } = useAuth();

  const loadProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // --- CAMBIO IMPORTANTE AQUÍ ---
      // Agregamos los headers para que ngrok nos deje pasar
      const response = await fetch(`${API_URL}/productos`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      }); 
      
      if (!response.ok) throw new Error('No se pudieron cargar los productos');
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []); 

  // --- Manejadores del Formulario ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductoActual((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const esNuevo = modoForm === 'nuevo';
    
    const url = esNuevo 
      ? `${API_URL}/productos` 
      : `${API_URL}/productos/${productoActual.id}`;
      
    const method = esNuevo ? 'POST' : 'PUT';

    try {
      // Aquí usamos getAuthHeader() que YA actualizaste en el paso anterior
      // así que esto ya incluye el header de ngrok automáticamente.
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeader(), 
        body: JSON.stringify(productoActual),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errData.message || 'Error al guardar el producto');
      }

      setModoForm('oculto');
      setProductoActual(formularioVacio);
      await loadProductos(); 

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

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(), 
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        
        await loadProductos();

      } catch (err) {
        setError(err.message); 
      }
    }
  };

  // --- Renderizado del Formulario (Modal/Overlay) ---
  const renderFormulario = () => (
    <div className="admin-form-overlay">
      <div className="admin-form-container">
        <h2>{modoForm === 'nuevo' ? 'Añadir Nuevo Producto' : 'Editar Producto'}</h2>
        
        {formError && <p className="register-error-message">{formError}</p>}

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
              <select 
                id="categoria" 
                name="categoria" 
                value={productoActual.categoria} 
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Selecciona una categoría</option>
                {CATEGORIAS_DISPONIBLES.map(cat => (
                  <option key={cat.valor} value={cat.valor}>
                    {cat.texto}
                  </option>
                ))}
              </select>
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
      {modoForm !== 'oculto' && renderFormulario()}

      <div className="admin-gestion-header">
        <h1>Gestión de Productos</h1>
        <button className="admin-button button-add" onClick={handleAbrirFormNuevo}>
          + Añadir Producto
        </button>
      </div>

      {error && <p className="register-error-message">{error}</p>}
      {loading && <p>Cargando productos...</p>}

      {!loading && !error && (
        <div className="admin-table-container">
          <table className="admin-product-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
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
                  <td>{prod.categoria}</td>
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