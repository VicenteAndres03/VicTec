package ViDev.Victec.repository;

import ViDev.Victec.model.Carrito;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    
    // --- INICIO DE LA MODIFICACIÓN ---
    // Hacemos el EntityGraph más completo para que cargue todo lo necesario
    @EntityGraph(attributePaths = {
        "items", 
        "items.producto", 
        "items.producto.comentarios", 
        "items.producto.especificaciones"
    })
    // --- FIN DE LA MODIFICACIÓN ---
    @Query("SELECT c FROM Carrito c WHERE c.usuario.id = :usuarioId")
    Optional<Carrito> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}