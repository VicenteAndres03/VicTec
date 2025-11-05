package ViDev.Victec.Controller;

import ViDev.Victec.model.Direccion;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.UsuarioRepository;
import ViDev.Victec.service.DireccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/direcciones")
public class DireccionController {

    @Autowired
    private DireccionService direccionService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping
    public ResponseEntity<List<Direccion>> getDirecciones() {
        Usuario currentUser = getCurrentUser();
        return ResponseEntity.ok(direccionService.getDireccionesByUsuarioId(currentUser.getId()));
    }

    @PostMapping
    public ResponseEntity<Direccion> addDireccion(@RequestBody Direccion direccion) {
        Usuario currentUser = getCurrentUser();
        return ResponseEntity.ok(direccionService.addDireccion(currentUser.getId(), direccion));
    }

    @DeleteMapping("/{direccionId}")
    public ResponseEntity<Void> deleteDireccion(@PathVariable Long direccionId) {
        Usuario currentUser = getCurrentUser();
        direccionService.deleteDireccion(direccionId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
