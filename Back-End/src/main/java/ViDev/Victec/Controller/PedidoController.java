package ViDev.Victec.Controller;

import ViDev.Victec.model.Pedido;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.UsuarioRepository;
import ViDev.Victec.service.PedidoService;
// --- INICIO DE IMPORTACIONES AÑADIDAS ---
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.exceptions.MPApiException;
import org.springframework.http.HttpStatus;
// --- FIN DE IMPORTACIONES AÑADIDAS ---
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

    // --- INICIO DEL NUEVO ENDPOINT ---
    @PostMapping("/crear-y-pagar")
    public ResponseEntity<?> crearPedidoYPreferencia(@RequestBody Map<String, Long> payload) {
        Long direccionId = payload.get("direccionId");
        Usuario currentUser = getCurrentUser();

        try {
            // Llama al nuevo método atómico del servicio
            Preference preference = pedidoService.crearPedidoYPreferencia(currentUser.getId(), direccionId);
            
            // Si todo sale bien, devolvemos solo lo que el frontend necesita
            Map<String, String> response = Map.of(
                "preferenceId", preference.getId(),
                "init_point", preference.getInitPoint()
            );
            return ResponseEntity.ok(response);

        } catch (MPApiException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error de API de MercadoPago: " + e.getApiResponse().getContent()));
        } catch (MPException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error de MercadoPago: " + e.getMessage()));
        } catch (RuntimeException e) {
            e.printStackTrace();
            // Esto capturará errores como "Stock insuficiente" o "Carrito vacío"
            // Gracias al @Transactional, el stock no se habrá descontado.
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    // --- FIN DEL NUEVO ENDPOINT ---

    @PostMapping("/crear")
    public ResponseEntity<Pedido> crearPedido(@RequestBody Map<String, Long> payload) {
        // Este endpoint ahora solo se usa para "Transferencia Bancaria"
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