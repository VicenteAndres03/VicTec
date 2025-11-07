import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 1. Importa 'isAuthenticated' y 'loadingAuth'
import { useAuth } from '../context/AuthContext';
import './MisPedidosPage.css'; 

function formatarEstado(estado) {
  if (!estado) return 'Pendiente';
  return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
}

function MisPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. Obtén los estados de autenticación
  const { getAuthHeader, isAuthenticated, loadingAuth } = useAuth(); 

  useEffect(() => {
    const fetchPedidos = async () => {
      
      // 3. --- INICIO DE LA CORRECCIÓN ---
      // No hagas nada si el contexto de autenticación aún está cargando el token
      if (loadingAuth) {
        return; 
      }

      // Si terminó de cargar y el resultado es que NO está autenticado,
      // establece el error directamente sin llamar a la API.
      if (!isAuthenticated) {
        setLoading(false);
        setError('No estás autorizado. Por favor, inicia sesión.');
        return;
      }
      // --- FIN DE LA CORRECCIÓN ---

      // Si llegamos aquí, loadingAuth es false e isAuthenticated es true,
      // por lo que getAuthHeader() definitivamente tendrá el token.
      
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/v1/pedidos', {
          headers: getAuthHeader(), 
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Tu sesión expiró. Por favor, inicia sesión de nuevo.');
          }
          throw new Error('No se pudieron cargar tus pedidos.');
        }
        
        const data = await response.json();
        setPedidos(data); 
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  
  // 4. Añade 'isAuthenticated' y 'loadingAuth' a las dependencias
  //    Esto asegura que el 'useEffect' se vuelva a ejecutar cuando cambien.
  }, [getAuthHeader, isAuthenticated, loadingAuth]); 

  // (El resto de la página (el 'return') no necesita cambios)

  if (loading || loadingAuth) { // Muestra 'Cargando...' mientras el token o los pedidos cargan
    return (
      <main className="mis-pedidos-container">
        <h1 className="mis-pedidos-title">Mis Pedidos</h1>
        <p>Cargando tus pedidos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mis-pedidos-container">
        <h1 className="mis-pedidos-title">Mis Pedidos</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </main>
    );
  }

  return (
    <main className="mis-pedidos-container">
      <h1 className="mis-pedidos-title">Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <p>Aún no tienes ningún pedido. ¡<Link to="/productos">Empieza a comprar</Link>!</p>
      ) : (
        <div className="pedidos-list">
          {pedidos.map(pedido => (
            <div className="pedido-card" key={pedido.id}>
              <div className="pedido-card-header">
                <div className="pedido-info">
                  <span className="pedido-id">Pedido #{pedido.id}</span>
                  <span className="pedido-fecha">
                    Realizado: {new Date(pedido.fechaPedido).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="pedido-total">
                  CLP${pedido.total.toLocaleString('es-CL')}
                </div>
              </div>
              <div className="pedido-card-body">
                <span className={`pedido-estado estado-${pedido.estado.toLowerCase()}`}>
                  {formatarEstado(pedido.estado)}
                </span>
                <ul className="pedido-items">
                  {pedido.items.map((item) => (
                    <li key={item.id}>
                      {item.cantidad} x {item.producto.nombre}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MisPedidosPage;