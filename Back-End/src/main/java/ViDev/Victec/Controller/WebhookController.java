package ViDev.Victec.Controller;

import ViDev.Victec.service.PaymentService;
import ViDev.Victec.service.PedidoService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/webhooks")
public class WebhookController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ObjectMapper objectMapper; // Spring inyecta esto automáticamente

    /**
     * Este es el endpoint que MercadoPago llamará cuando un pago cambie de estado.
     * Lo configuraremos en el panel de Mercado Pago para que apunte a nuestra URL pública
     * (ej: https://tu-backend.com/api/v1/webhooks/mercadopago)
     */
    @PostMapping("/mercadopago")
    public ResponseEntity<Void> handleMercadoPagoWebhook(
            @RequestParam("data.id") String paymentId,
            @RequestBody(required = false) Map<String, Object> payload) {

        System.out.println("--- INICIO WEBHOOK MERCADOPAGO ---");
        System.out.println("ID del Pago recibido: " + paymentId);

        if (paymentId == null || paymentId.isEmpty()) {
            // Si no hay ID, no podemos hacer nada.
            return ResponseEntity.badRequest().build();
        }

        try {
            // 1. Obtenemos los detalles del pago desde Mercado Pago
            Payment payment = paymentService.getPaymentDetails(paymentId);

            // 2. Verificamos si el pago fue aprobado
            if (payment != null && "approved".equals(payment.getStatus())) {
                System.out.println("Pago APROBADO. Procesando...");

                // 3. Obtenemos la referencia que guardamos en el Paso 1
                String externalRef = payment.getExternalReference();
                System.out.println("ExternalReference: " + externalRef);

                if (externalRef == null) {
                    throw new RuntimeException("ExternalReference es nula, no se puede finalizar el pedido");
                }
                
                // 4. Convertimos la referencia (String JSON) a un Mapa
                Map<String, Long> refMap = objectMapper.readValue(
                    externalRef, 
                    new TypeReference<Map<String, Long>>(){}
                );
                
                Long userId = refMap.get("userId");
                Long addressId = refMap.get("addressId");

                if (userId == null || addressId == null) {
                    throw new RuntimeException("Faltan IDs en la ExternalReference");
                }

                // 5. ¡Llamamos a la lógica para finalizar la compra!
                //    (Esta es la función que descuenta stock y limpia el carrito)
                System.out.println(String.format("Finalizando compra para Usuario ID %d con Dirección ID %d", userId, addressId));
                pedidoService.finalizarCompra(userId, addressId);

                System.out.println("--- FIN WEBHOOK: Pedido creado exitosamente ---");
            
            } else if (payment != null) {
                System.out.println("Estado del pago no es 'approved': " + payment.getStatus());
            } else {
                System.out.println("No se pudo obtener la información del pago.");
            }

            // 6. Enviamos un OK (200) a Mercado Pago para que sepa que recibimos la notificación
            return ResponseEntity.ok().build();

        } catch (MPException | MPApiException e) {
            System.err.println("Error de API MercadoPago al procesar Webhook: " + e.getMessage());
            return ResponseEntity.status(500).build();
        } catch (Exception e) {
            System.err.println("Error inesperado al procesar Webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}