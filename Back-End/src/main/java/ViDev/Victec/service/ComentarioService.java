package ViDev.Victec.service;

import ViDev.Victec.model.Comentario;
import ViDev.Victec.model.Producto;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.payload.ComentarioRequest;
import ViDev.Victec.repository.ComentarioRepository;
import ViDev.Victec.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public Comentario addComentario(Long productoId, Usuario usuario, ComentarioRequest comentarioRequest) {
        
        // 1. Busca el producto
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));

        // 2. Crea el nuevo comentario
        Comentario comentario = new Comentario();
        comentario.setProducto(producto);
        comentario.setAutor(usuario.getNombre()); // Usamos el nombre del usuario logueado
        comentario.setTexto(comentarioRequest.getTexto());
        comentario.setRating(comentarioRequest.getRating());
        
        // 3. Formatea la fecha actual
        String fechaHoy = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        comentario.setFecha(fechaHoy);

        // 4. Guarda y devuelve el comentario
        return comentarioRepository.save(comentario);
    }
}