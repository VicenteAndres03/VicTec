package ViDev.Victec.repository;

import ViDev.Victec.model.Pedido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    // --- INICIO DEL CAMBIO ---
    // Reemplazamos el @EntityGraph por un JOIN FETCH que es más explícito
    // para cargar los items Y el producto dentro de cada item.
    
    // @EntityGraph(attributePaths = {"items", "items.producto"})
    // @Query("SELECT p FROM Pedido p WHERE p.id = :id")
    // Optional<Pedido> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT p FROM Pedido p LEFT JOIN FETCH p.items i LEFT JOIN FETCH i.producto WHERE p.id = :id")
    Optional<Pedido> findByIdWithItems(@Param("id") Long id);
    // --- FIN DEL CAMBIO ---
    
    List<Pedido> findByUsuarioId(Long usuarioId);
}