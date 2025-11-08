package ViDev.Victec.repository;

import ViDev.Victec.model.Producto; 
import org.springframework.data.jpa.repository.EntityGraph; // <-- ¡AÑADE ESTE IMPORT!
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional; // <-- ¡AÑADE ESTE IMPORT!

@Repository 
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // --- INICIO DE LA MODIFICACIÓN ---

    // Sobrescribe findById para que cargue las listas (para DetalleProductoPage)
    @EntityGraph(attributePaths = {"comentarios", "especificaciones"})
    Optional<Producto> findById(Long id);

    // Sobrescribe findAll para que cargue las listas (para HomePage y ProductosPage 'Todos')
    @EntityGraph(attributePaths = {"comentarios", "especificaciones"})
    List<Producto> findAll();

    // Añade EntityGraph al método de categoría (para ProductosPage con filtro)
    @EntityGraph(attributePaths = {"comentarios", "especificaciones"})
    List<Producto> findByCategoriaIgnoreCase(String categoria);

    // --- FIN DE LA MODIFICACIÓN ---
}