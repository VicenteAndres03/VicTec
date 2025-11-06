package ViDev.Victec.service;

import ViDev.Victec.model.Pedido;
import ViDev.Victec.model.PedidoItem;
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

    public Preference createPreference(Pedido pedido) throws MPException, MPApiException {
        if (pedido == null || pedido.getItems() == null || pedido.getItems().isEmpty()) {
            throw new IllegalArgumentException("El pedido no tiene items");
        }

        List<PreferenceItemRequest> items = new ArrayList<>();
        for (PedidoItem pedidoItem : pedido.getItems()) {
            if (pedidoItem.getProducto() == null) {
                throw new IllegalArgumentException("Un item del pedido no tiene producto asociado");
            }
            
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .id(pedidoItem.getProducto().getId().toString())
                    .title(pedidoItem.getProducto().getNombre())
                    .quantity(pedidoItem.getCantidad())
                    // --- INICIO DE LA CORRECCIÓN ---
                    // 1. Usamos pedidoItem.getPrecio() (que es un BigDecimal)
                    //    en lugar de crear un new BigDecimal desde un double.
                    .unitPrice(pedidoItem.getPrecio()) 
                    // --- FIN DE LA CORRECCIÓN ---
                    .currencyId("CLP")
                    .build();
            items.add(item);
        }

        if (items.isEmpty()) {
            throw new IllegalArgumentException("No se pudieron crear items para la preferencia");
        }

        PreferenceRequest request = PreferenceRequest.builder()
                .items(items)
                .externalReference(pedido.getId().toString())
                .backUrls(PreferenceBackUrlsRequest.builder()
                        .success("http://localhost:5173/compra-exitosa")
                        .failure("http://localhost:5173/checkout")
                        .pending("http://localhost:5173/pago-pendiente")
                        .build())
                // --- CORRECCIÓN 2: Eliminamos la línea .autoReturn("approved") ---
                .build();

        PreferenceClient client = new PreferenceClient();
        return client.create(request);
    }
}