package ViDev.Victec.repository;

import ViDev.Victec.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <--- Importante
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // --- OPTIMIZACIÓN DE VELOCIDAD ---
    
    // 1. Traemos el producto Y sus relaciones en UNA sola consulta (JOIN FETCH).
    // El 'DISTINCT' es importante para que no se dupliquen los productos al hacer el join.
    @Override
    @Query("SELECT DISTINCT p FROM Producto p " +
           "LEFT JOIN FETCH p.especificaciones " +
           "LEFT JOIN FETCH p.comentarios")
    List<Producto> findAll();

    // 2. Hacemos lo mismo para cuando buscas por ID (para que el detalle cargue instantáneo)
    @Override
    @Query("SELECT p FROM Producto p " +
           "LEFT JOIN FETCH p.especificaciones " +
           "LEFT JOIN FETCH p.comentarios " +
           "WHERE p.id = :id")
    Optional<Producto> findById(Long id);

    // 3. Y también para el filtro de categorías
    @Query("SELECT DISTINCT p FROM Producto p " +
           "LEFT JOIN FETCH p.especificaciones " +
           "LEFT JOIN FETCH p.comentarios " +
           "WHERE LOWER(p.categoria) = LOWER(:categoria)")
    List<Producto> findByCategoriaIgnoreCase(String categoria);
}