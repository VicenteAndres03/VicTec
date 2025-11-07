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
import java.util.Map;

@Service
public class PaymentService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public Preference createPreference(Carrito carrito, Long direccionId) throws MPException, MPApiException {
        if (carrito == null || carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new IllegalArgumentException("El carrito no tiene items");
        }

        List<PreferenceItemRequest> items = new ArrayList<>();
        
        // --- INICIO DE LA MODIFICACIÓN ---

        // 1. Calcular el subtotal de los productos
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (CarritoItem carritoItem : carrito.getItems()) {
            if (carritoItem.getProducto() == null) {
                throw new IllegalArgumentException("Un item del carrito no tiene producto asociado");
            }
            
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
            
            // Sumamos al subtotal
            subtotal = subtotal.add(itemPrice.multiply(new BigDecimal(quantity)));
        }

        // 2. Definir la lógica de envío (debe ser IDÉNTICA a la del frontend)
        BigDecimal costoEnvio = BigDecimal.ZERO;
        if (subtotal.compareTo(BigDecimal.ZERO) > 0) { // si subtotal > 0
            if (subtotal.compareTo(new BigDecimal("50000")) >= 0) { // >= 50000
                costoEnvio = BigDecimal.ZERO; // Envío gratis
            } else if (subtotal.compareTo(new BigDecimal("25000")) >= 0) { // >= 25000
                costoEnvio = new BigDecimal("1990"); // Envío reducido
            } else {
                costoEnvio = new BigDecimal("3500"); // Envío estándar
            }
        }

        // 3. Añadir el envío como un item más a Mercado Pago
        // (Si el envío es gratis, simplemente no se añade)
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
        
        // --- FIN DE LA MODIFICACIÓN ---

        if (items.isEmpty()) {
            throw new IllegalArgumentException("No se pudieron crear items para la preferencia");
        }

        String externalRef = String.format(
            "{\"userId\":%d, \"cartId\":%d, \"addressId\":%d}", 
            carrito.getUsuario().getId(), 
            carrito.getId(), 
            direccionId
        );

        PreferenceRequest request = PreferenceRequest.builder()
                .items(items) // <-- Esta lista 'items' AHORA INCLUYE EL ENVÍO
                .externalReference(externalRef) 
                .backUrls(PreferenceBackUrlsRequest.builder()
                        .success("http://localhost:5173/compra-exitosa")
                        .failure("http://localhost:5173/checkout")
                        .pending("http://localhost:5173/pago-pendiente")
                        .build())
                .build();

        PreferenceClient client = new PreferenceClient();
        return client.create(request);
    }

    public Payment getPaymentDetails(String paymentId) throws MPException, MPApiException {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            throw new IllegalArgumentException("El paymentId no puede ser nulo o vacío");
        }
        
        PaymentClient client = new PaymentClient();
        return client.get(Long.parseLong(paymentId));
    }
}