package ViDev.Victec.repository;

import ViDev.Victec.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    
    // MODIFICACIÓN: Usamos JOIN FETCH para cargar todo de una vez
    // y evitar el error 500 de "LazyInitializationException" o serialización.
    @Query("SELECT c FROM Carrito c " +
           "LEFT JOIN FETCH c.items i " +
           "LEFT JOIN FETCH i.producto p " +
           "WHERE c.usuario.id = :usuarioId")
    Optional<Carrito> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}