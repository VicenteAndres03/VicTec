package ViDev.Victec.repository;

import ViDev.Victec.model.Producto; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // 1. IMPORTAR LIST

@Repository 
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // ... (tus métodos findById, findAll, etc., ya existen) ...

    // 2. --- MÉTODO AÑADIDO ---
    // Esto busca productos donde el 'nombre' contenga el texto de la consulta
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}