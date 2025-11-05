package ViDev.Victec.Controller;

import ViDev.Victec.model.Pedido;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.UsuarioRepository;
import ViDev.Victec.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @PostMapping("/crear")
    public ResponseEntity<Pedido> crearPedido(@RequestBody Map<String, Long> payload) {
        Long direccionId = payload.get("direccionId");
        Usuario currentUser = getCurrentUser();
        Pedido pedido = pedidoService.crearPedidoDesdeCarrito(currentUser.getId(), direccionId);
        return ResponseEntity.ok(pedido);
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> getPedidos() {
        Usuario currentUser = getCurrentUser();
        return ResponseEntity.ok(pedidoService.getPedidosPorUsuario(currentUser.getId()));
    }

    @GetMapping("/{pedidoId}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long pedidoId) {
        Usuario currentUser = getCurrentUser();
        return ResponseEntity.ok(pedidoService.getPedidoById(pedidoId, currentUser.getId()));
    }
}
