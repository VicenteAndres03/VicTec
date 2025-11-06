package ViDev.Victec.Controller;

import ViDev.Victec.model.Pedido;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.PedidoRepository;
import ViDev.Victec.repository.UsuarioRepository;
import ViDev.Victec.service.PaymentService;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null) {
            throw new RuntimeException("No hay autenticación en el SecurityContext");
        }
        
        if (authentication.getPrincipal() == null) {
            throw new RuntimeException("El principal de autenticación es null");
        }
        
        if (!(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("El principal no es una instancia de UserDetails: " + authentication.getPrincipal().getClass().getName());
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + userDetails.getUsername()));
    }

    @PostMapping("/create-preference")
    public ResponseEntity<?> createPreference(@RequestBody Map<String, Long> payload) {
        Long pedidoId = payload.get("pedidoId");
        
        // Log para debugging
        System.out.println("=== Creando preferencia de pago ===");
        System.out.println("PedidoId recibido: " + pedidoId);
        
        // Verificar autenticación antes de obtener usuario
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication: " + (authentication != null ? authentication.getName() : "null"));
        System.out.println("Is authenticated: " + (authentication != null && authentication.isAuthenticated()));
        
        if (authentication == null || authentication.getPrincipal() == null || !authentication.isAuthenticated()) {
            System.out.println("ERROR: No hay autenticación en el SecurityContext");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "No autorizado: No hay sesión activa"));
        }
        
        Usuario currentUser;
        try {
            currentUser = getCurrentUser();
            System.out.println("Usuario actual: " + currentUser.getEmail() + " (ID: " + currentUser.getId() + ")");
        } catch (Exception e) {
            System.out.println("ERROR al obtener usuario actual: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "No autorizado: " + e.getMessage()));
        }

        if (pedidoId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "pedidoId es requerido"));
        }

        // Buscar el pedido con items y productos cargados
        Pedido pedido = pedidoRepository.findByIdWithItems(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        System.out.println("Pedido encontrado: ID " + pedido.getId() + ", Usuario ID: " + pedido.getUsuario().getId());

        if (!pedido.getUsuario().getId().equals(currentUser.getId())) {
            System.out.println("ERROR: El pedido no pertenece al usuario actual");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "No tiene permiso para pagar este pedido"));
        }

        // Validar que el pedido tenga items
        if (pedido.getItems() == null || pedido.getItems().isEmpty()) {
            System.out.println("ERROR: El pedido no tiene items");
            return ResponseEntity.badRequest().body(Map.of("error", "El pedido no tiene items"));
        }

        System.out.println("El pedido tiene " + pedido.getItems().size() + " items");

        try {
            Preference preference = paymentService.createPreference(pedido);
            
            if (preference == null || preference.getInitPoint() == null) {
                System.out.println("ERROR: No se pudo crear la preferencia de pago");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo crear la preferencia de pago"));
            }
            
            System.out.println("Preferencia creada exitosamente: " + preference.getId());
            
            Map<String, String> response = new HashMap<>();
            response.put("preferenceId", preference.getId() != null ? preference.getId() : "");
            response.put("init_point", preference.getInitPoint());
            
            return ResponseEntity.ok(response);
        } catch (MPApiException e) {
            e.printStackTrace();
            System.out.println("ERROR MPApiException: " + e.getMessage());
            String errorMessage = "Error al crear la preferencia de pago";
            if (e.getApiResponse() != null && e.getApiResponse().getContent() != null) {
                errorMessage += ": " + e.getApiResponse().getContent();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", errorMessage));
        } catch (MPException e) {
            e.printStackTrace();
            System.out.println("ERROR MPException: " + e.getMessage());
            String errorMessage = "Error al crear la preferencia de pago: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", errorMessage));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("ERROR Exception: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error inesperado: " + e.getMessage()));
        }
    }
}