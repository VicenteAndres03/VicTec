package ViDev.Victec.repository;

import ViDev.Victec.model.Especificacion; // Importa tu modelo
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspecificacionRepository extends JpaRepository<Especificacion, Long> {
    // Esto administrará tu tabla 'especificaciones'
}