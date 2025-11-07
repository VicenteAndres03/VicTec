package ViDev.Victec.repository;

import ViDev.Victec.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    @Query("SELECT p FROM Pedido p LEFT JOIN FETCH p.items i LEFT JOIN FETCH i.producto WHERE p.id = :id")
    Optional<Pedido> findByIdWithItems(@Param("id") Long id);
    
    // 1. --- MÉTODO MODIFICADO ---
    // (Este ya existía, pero ahora lo borramos para reemplazarlo por el de abajo)
    // List<Pedido> findByUsuarioId(Long usuarioId);

    // 2. --- NUEVO MÉTODO ---
    // Le pedimos a la BD que traiga los Pedidos, sus Items y los Productos de esos Items,
    // todo de una sola vez, para un usuario específico y ordenados por fecha.
    @Query("SELECT p FROM Pedido p LEFT JOIN FETCH p.items i LEFT JOIN FETCH i.producto WHERE p.usuario.id = :usuarioId ORDER BY p.fechaPedido DESC")
    List<Pedido> findByUsuarioIdWithItemsAndProducts(@Param("usuarioId") Long usuarioId);
}