import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config'; // <--- 1. IMPORTAR API_URL
import './MisPedidosPage.css'; 

function formatarEstado(estado) {
  if (!estado) return 'Pendiente';
  return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
}

function MisPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { getAuthHeader, isAuthenticated, loadingAuth } = useAuth(); 

  useEffect(() => {
    const fetchPedidos = async () => {
      
      if (loadingAuth) {
        return; 
      }

      if (!isAuthenticated) {
        setLoading(false);
        setError('No estás autorizado. Por favor, inicia sesión.');
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        // 2. CORRECCIÓN: Usar API_URL en lugar de ruta relativa
        const response = await fetch(`${API_URL}/pedidos`, {
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
  
  }, [getAuthHeader, isAuthenticated, loadingAuth]); 

  if (loading || loadingAuth) {
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