package ViDev.Victec.service;

import ViDev.Victec.model.Comentario;
import ViDev.Victec.model.Especificacion;
import ViDev.Victec.model.Producto;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service // <-- 1. Le dice a Spring que esto es un Servicio
public class ProductoService {

    // 2. Aquí guardaremos nuestra lista de productos, simulando la BD
    private final List<Producto> productList = new ArrayList<>();

    // 3. Este método se ejecutará automáticamente cuando el servidor inicie
    @PostConstruct
    private void loadMockData() {
        // --- Producto 1: Auriculares ---
        List<Especificacion> specsAudifonos = List.of(
            new Especificacion("Conexión", "Bluetooth 5.2"),
            new Especificacion("Batería", "40 horas (con ANC apagado)"),
            new Especificacion("Cancelación de Ruido", "Activa (ANC) Híbrida"),
            new Especificacion("Peso", "220g")
        );
        List<Comentario> comentariosAudifonos = List.of(
            new Comentario(1L, "Carla M.", 5, "¡Me encantaron! La cancelación de ruido es increíble para el precio. Muy cómodos.", "hace 2 días"),
            new Comentario(2L, "Felipe González", 4, "Buenos audífonos, el material se siente de calidad y la batería dura muchísimo.", "hace 1 semana")
        );
        Producto audifonos = new Producto(
            1L,
            "Auriculares Pro-Gen",
            "VicTec",
            39990,
            59990.0, // El .0 lo convierte en Double
            true,
            "https://i.imgur.com/8Q1mP0B.png",
            "VT-AUD-PRO-001",
            25,
            "Audio",
            "Sumérgete en el sonido con los Auriculares Pro-Gen. Cancelación de ruido activa, 40 horas de batería y un diseño ergonómico para tu día a día.",
            specsAudifonos,
            comentariosAudifonos
        );

        // --- Producto 2: Smartwatch ---
        List<Especificacion> specsSmartwatch = List.of(
            new Especificacion("Pantalla", "1.8\" AMOLED"),
            new Especificacion("Resistencia al Agua", "5 ATM (Hasta 50m)"),
            new Especificacion("Sensores", "Ritmo Cardíaco, SpO2, GPS"),
            new Especificacion("Material", "Caja de aleación de aluminio")
        );
        List<Comentario> comentariosSmartwatch = List.of(
            new Comentario(3L, "Juan Pablo", 5, "Excelente reloj, la pantalla se ve muy nítida y el GPS es preciso. 10/10.", "hace 5 días")
        );
        Producto smartwatch = new Producto(
            2L,
            "Smartwatch X5",
            "VicTec",
            179990,
            null, // No tiene precio antiguo
            false,
            "https://i.imgur.com/7H2j3bE.png",
            "VT-SW-X5-002",
            10,
            "Smartwatches",
            "El Smartwatch X5 es tu compañero de salud. Mide tu ritmo cardíaco, oxígeno en sangre, y te mantiene conectado con notificaciones inteligentes.",
            specsSmartwatch,
            comentariosSmartwatch
        );

        // 4. Añadimos los productos a nuestra lista
        this.productList.add(audifonos);
        this.productList.add(smartwatch);
    }

    // --- Métodos Públicos (para que el Controlador los use) ---

    /**
     * Devuelve la lista completa de productos.
     */
    public List<Producto> getAllProductos() {
        return this.productList;
    }

    /**
     * Busca un producto por su ID.
     * Usamos Optional para manejar de forma segura si un producto no se encuentra.
     */
    public Optional<Producto> getProductoById(long id) {
        return this.productList.stream()
            .filter(producto -> producto.getId() == id)
            .findFirst();
    }
}