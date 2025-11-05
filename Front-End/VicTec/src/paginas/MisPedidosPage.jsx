import React from 'react';
import { Link } from 'react-router-dom';
import './MisPedidosPage.css'; // Crearemos este CSS

// --- Simulación de Pedidos ---
const mockPedidos = [
  {
    id: 'VT-1003',
    fecha: '01 de Noviembre, 2025',
    total: 219980, // CLP
    estado: 'Enviado',
    items: [
      { nombre: 'Auriculares Pro-Gen', qty: 1 },
      { nombre: 'Smartwatch X5', qty: 1 }
    ]
  },
  {
    id: 'VT-1002',
    fecha: '15 de Octubre, 2025',
    total: 29990,
    estado: 'Entregado',
    items: [
      { nombre: 'PowerCore Ultra', qty: 1 }
    ]
  },
];
// ----------------------------

function MisPedidosPage() {
  return (
    <main className="mis-pedidos-container">
      <h1 className="mis-pedidos-title">Mis Pedidos</h1>

      {mockPedidos.length === 0 ? (
        <p>Aún no tienes ningún pedido. ¡<Link to="/productos">Empieza a comprar</Link>!</p>
      ) : (
        <div className="pedidos-list">
          {mockPedidos.map(pedido => (
            <div className="pedido-card" key={pedido.id}>
              <div className="pedido-card-header">
                <div className="pedido-info">
                  <span className="pedido-id">Pedido #{pedido.id}</span>
                  <span className="pedido-fecha">Realizado: {pedido.fecha}</span>
                </div>
                <div className="pedido-total">
                  CLP${pedido.total.toLocaleString('es-CL')}
                </div>
              </div>
              <div className="pedido-card-body">
                <span className={`pedido-estado estado-${pedido.estado.toLowerCase()}`}>
                  {pedido.estado}
                </span>
                <ul className="pedido-items">
                  {pedido.items.map((item, index) => (
                    <li key={index}>{item.qty} x {item.nombre}</li>
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