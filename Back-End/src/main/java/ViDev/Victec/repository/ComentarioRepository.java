package ViDev.Victec.repository;

import ViDev.Victec.model.Comentario; // Importa tu modelo
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    // Esto administrará tu tabla 'comentarios'
}