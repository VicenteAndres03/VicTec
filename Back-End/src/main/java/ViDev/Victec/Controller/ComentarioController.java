package ViDev.Victec.Controller;

import ViDev.Victec.model.Comentario;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.payload.ComentarioRequest;
import ViDev.Victec.repository.UsuarioRepository;
import ViDev.Victec.service.ComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @Autowired
    private UsuarioRepository usuarioRepository; // Para buscar el usuario por email

    // Helper para obtener el usuario autenticado
    private Usuario getCurrentUser(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // --- ESTE ES EL NUEVO ENDPOINT ---
    // POST /api/v1/productos/1/comentarios
    @PostMapping("/productos/{productoId}/comentarios")
    public ResponseEntity<Comentario> crearComentario(
            @PathVariable Long productoId,
            @RequestBody ComentarioRequest comentarioRequest,
            Authentication authentication) {
        
        Usuario usuario = getCurrentUser(authentication);
        
        Comentario nuevoComentario = comentarioService.addComentario(productoId, usuario, comentarioRequest);
        
        return ResponseEntity.ok(nuevoComentario);
    }
}