package ViDev.Victec.repository;

import ViDev.Victec.model.Pedido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    @EntityGraph(attributePaths = {"items", "items.producto"})
    @Query("SELECT p FROM Pedido p WHERE p.id = :id")
    Optional<Pedido> findByIdWithItems(@Param("id") Long id);
    
    List<Pedido> findByUsuarioId(Long usuarioId);
}
