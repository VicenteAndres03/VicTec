package ViDev.Victec.Controller;

import ViDev.Victec.model.Carrito;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.UsuarioRepository;
import ViDev.Victec.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private UsuarioRepository usuarioRepository; // Para buscar el usuario por email

    private Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping
    public ResponseEntity<Carrito> getCarrito() {
        Usuario currentUser = getCurrentUser();
        return carritoService.getCarritoByUsuarioId(currentUser.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<Carrito> addProductoToCarrito(@RequestBody Map<String, Object> payload) {
        Long productoId = Long.parseLong(payload.get("productoId").toString());
        int cantidad = Integer.parseInt(payload.get("cantidad").toString());
        Usuario currentUser = getCurrentUser();
        Carrito carrito = carritoService.addProductoToCarrito(currentUser.getId(), productoId, cantidad);
        return ResponseEntity.ok(carrito);
    }

    @DeleteMapping("/remove/{productoId}")
    public ResponseEntity<Carrito> removeProductoFromCarrito(@PathVariable Long productoId) {
        Usuario currentUser = getCurrentUser();
        Carrito carrito = carritoService.removeProductoFromCarrito(currentUser.getId(), productoId);
        return ResponseEntity.ok(carrito);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCarrito() {
        Usuario currentUser = getCurrentUser();
        carritoService.clearCarrito(currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
