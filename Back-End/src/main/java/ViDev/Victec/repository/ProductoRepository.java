package ViDev.Victec.repository;

import ViDev.Victec.model.Producto; 
// 1. --- ¡Quitamos el import de EntityGraph! ---
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional; 

@Repository 
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // --- INICIO DE LA MODIFICACIÓN ---
    // (Quitamos todos los @EntityGraph de aquí)

    // Sobrescribe findById (sin @EntityGraph)
    Optional<Producto> findById(Long id);

    // Sobrescribe findAll (sin @EntityGraph)
    List<Producto> findAll();

    // Método de categoría (sin @EntityGraph)
    List<Producto> findByCategoriaIgnoreCase(String categoria);

    // --- FIN DE LA MODIFICACIÓN ---
}