package ViDev.Victec.service;

import ViDev.Victec.model.Carrito;
import ViDev.Victec.model.CarritoItem;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    // 1. Método createPreference corregido para aceptar Carrito y Long (usado por PedidoService)
    public Preference createPreference(Carrito carrito, Long direccionId) throws MPException, MPApiException {
        if (carrito == null || carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new IllegalArgumentException("El carrito no tiene items");
        }

        List<PreferenceItemRequest> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (CarritoItem carritoItem : carrito.getItems()) {
            if (carritoItem.getProducto() == null) {
                throw new IllegalArgumentException("Un item del carrito no tiene producto asociado");
            }
            
            // Convertimos el precio (double) a BigDecimal correctamente
            BigDecimal itemPrice = BigDecimal.valueOf(carritoItem.getProducto().getPrecio());
            int quantity = carritoItem.getCantidad();
            
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .id(carritoItem.getProducto().getId().toString())
                    .title(carritoItem.getProducto().getNombre())
                    .quantity(quantity)
                    .unitPrice(itemPrice) 
                    .currencyId("CLP")
                    .build();
            items.add(item);
            
            subtotal = subtotal.add(itemPrice.multiply(new BigDecimal(quantity)));
        }

        // Lógica de Envío (Igual que en el Frontend)
        BigDecimal costoEnvio = BigDecimal.ZERO;
        if (subtotal.compareTo(BigDecimal.ZERO) > 0) { 
            if (subtotal.compareTo(new BigDecimal("50000")) >= 0) { 
                costoEnvio = BigDecimal.ZERO; 
            } else {
                costoEnvio = new BigDecimal("1000"); 
            }
        }

        if (costoEnvio.compareTo(BigDecimal.ZERO) > 0) {
            PreferenceItemRequest envioItem = PreferenceItemRequest.builder()
                    .id("envio")
                    .title("Costo de Envío")
                    .quantity(1)
                    .unitPrice(costoEnvio)
                    .currencyId("CLP")
                    .build();
            items.add(envioItem);
        }

        if (items.isEmpty()) {
            throw new IllegalArgumentException("No se pudieron crear items para la preferencia");
        }

        String externalRef = String.format(
            "{\"userId\":%d, \"cartId\":%d, \"addressId\":%d}", 
            carrito.getUsuario().getId(), 
            carrito.getId(), 
            direccionId
        );

        // --- URLs CONFIGURADAS PARA LOCALHOST ---
        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("http://localhost:5173/compra-exitosa") 
                .failure("http://localhost:5173/carrito")
                .pending("http://localhost:5173/carrito") 
                .build();

        PreferenceRequest request = PreferenceRequest.builder()
                .items(items)
                .externalReference(externalRef) 
                .backUrls(backUrls)
                .autoReturn("approved")
                .build();

        PreferenceClient client = new PreferenceClient();
        return client.create(request);
    }

    // 2. Método getPaymentDetails restaurado (usado por WebhookController)
    public Payment getPaymentDetails(String paymentId) throws MPException, MPApiException {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            throw new IllegalArgumentException("El paymentId no puede ser nulo o vacío");
        }
        
        PaymentClient client = new PaymentClient();
        return client.get(Long.parseLong(paymentId));
    }
}