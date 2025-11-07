package ViDev.Victec.repository;

import ViDev.Victec.model.Producto; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // 1. IMPORTAR LIST

@Repository 
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // ... (tus métodos findById, findAll, etc., ya existen) ...

    // 1. --- MÉTODO ANTIGUO ELIMINADO ---
    // List<Producto> findByNombreContainingIgnoreCase(String nombre);
    
    // 2. --- MÉTODO NUEVO AÑADIDO ---
    // Esto busca productos donde la 'categoria' coincida (ignorando mayúsculas)
    List<Producto> findByCategoriaIgnoreCase(String categoria);
}