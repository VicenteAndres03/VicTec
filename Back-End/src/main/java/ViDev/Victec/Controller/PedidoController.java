package ViDev.Victec.Controller;

import ViDev.Victec.model.Pedido;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.UsuarioRepository;
import ViDev.Victec.service.PedidoService;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.exceptions.MPApiException;
import org.springframework.http.HttpStatus;
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

    /**
     * Endpoint unificado para crear la preferencia de pago.
     * Llama al PedidoService para manejar la lógica transaccional.
     */
    @PostMapping("/crear-y-pagar")
    public ResponseEntity<?> crearPedidoYPreferencia(@RequestBody Map<String, Long> payload) {
        Long direccionId = payload.get("direccionId");
        Usuario currentUser = getCurrentUser();

        try {
            // Llama al servicio, que ahora es transaccional y maneja la lógica
            Preference preference = pedidoService.crearPreferenciaDePago(currentUser.getId(), direccionId);
            
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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Endpoint para obtener todos los pedidos del usuario autenticado.
     */
    @GetMapping
    public ResponseEntity<List<Pedido>> getPedidos() {
        Usuario currentUser = getCurrentUser();
        return ResponseEntity.ok(pedidoService.getPedidosPorUsuario(currentUser.getId()));
    }

    /**
     * Endpoint para obtener un pedido específico por ID.
     */
    @GetMapping("/{pedidoId}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long pedidoId) {
        Usuario currentUser = getCurrentUser();
        return ResponseEntity.ok(pedidoService.getPedidoById(pedidoId, currentUser.getId()));
    }
}