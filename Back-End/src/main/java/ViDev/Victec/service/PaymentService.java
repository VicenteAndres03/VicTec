package ViDev.Victec.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import ViDev.Victec.model.Pedido;
import ViDev.Victec.model.PedidoItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    @Value("${mercado_pago.access_token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public String createPreference(Pedido pedido) {
        try {
            List<PreferenceItemRequest> items = new ArrayList<>();

            for (PedidoItem item : pedido.getItems()) {
                PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                        .title(item.getProducto().getNombre())
                        .quantity(item.getCantidad())
                        .unitPrice(new BigDecimal(item.getPrecio()))
                        .currencyId("CLP")
                        .build();
                items.add(itemRequest);
            }

            // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
            // Configuramos las URLs para que redirijan a tu sitio en NETLIFY
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://victec.netlify.app/compra-exitosa") // <--- Página de éxito real
                    .failure("https://victec.netlify.app/carrito")       // Si falla, vuelve al carrito
                    .pending("https://victec.netlify.app/carrito")       // Si queda pendiente
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .autoReturn("approved") // Esto hace que redirija automáticamente sin que el usuario haga click
                    .externalReference(String.valueOf(pedido.getId())) // Guardamos el ID del pedido para saber cuál es
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference.getInitPoint(); // Retorna el link de pago

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}