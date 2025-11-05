package ViDev.Victec.repository;

import ViDev.Victec.model.Producto; // Importa tu modelo
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Le dice a Spring que esta es una interfaz de repositorio
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // JpaRepository<Producto, Long> significa:
    // "Quiero administrar la entidad 'Producto', y su Llave Primaria (ID) es de tipo 'Long'".

    // ¡Y eso es todo! Con solo esto, Spring te da automáticamente:
    // - findAll() (Obtener todos los productos)
    // - findById(Long id) (Buscar uno por ID)
    // - save(Producto producto) (Guardar o actualizar un producto)
    // - deleteById(Long id) (Borrar un producto)
    // ...¡y muchos más sin escribir una línea de SQL!
}