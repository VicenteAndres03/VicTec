package ViDev.Victec.service;

import ViDev.Victec.model.*;
import ViDev.Victec.repository.*;
// --- INICIO DE IMPORTACIONES AÑADIDAS ---
import ViDev.Victec.service.PaymentService;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.exceptions.MPApiException;
// --- FIN DE IMPORTACIONES AÑADIDAS ---
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional // Movido a nivel de clase
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PedidoItemRepository pedidoItemRepository;

    // --- INYECCIÓN AÑADIDA ---
    @Autowired
    private PaymentService paymentService;

    @Transactional // Mantenemos transaccional el método original
    public Pedido crearPedidoDesdeCarrito(Long usuarioId, Long direccionId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId).orElseThrow(() -> new RuntimeException("Carrito no encontrado o está vacío"));
        Direccion direccion = direccionRepository.findById(direccionId).orElseThrow(() -> new RuntimeException("Dirección no encontrada"));

        if (!direccion.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("La dirección no pertenece al usuario");
        }
        
        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setDireccionEnvio(direccion);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.PENDIENTE);
        
        pedido.setTotal(BigDecimal.ZERO);
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        Set<PedidoItem> pedidoItems = new HashSet<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CarritoItem carritoItem : carrito.getItems()) {
            Producto producto = carritoItem.getProducto();
            if (producto.getStock() < carritoItem.getCantidad()) {
                // Si falla aquí, la transacción hará rollback
                throw new RuntimeException("No hay suficiente stock para el producto: " + producto.getNombre());
            }

            PedidoItem pedidoItem = new PedidoItem();
            pedidoItem.setPedido(pedidoGuardado); 
            pedidoItem.setProducto(producto);
            pedidoItem.setCantidad(carritoItem.getCantidad());
            pedidoItem.setPrecio(BigDecimal.valueOf(producto.getPrecio()));
            
            pedidoItemRepository.save(pedidoItem);
            
            pedidoItems.add(pedidoItem);

            total = total.add(pedidoItem.getPrecio().multiply(BigDecimal.valueOf(carritoItem.getCantidad())));

            // Actualizar stock
            producto.setStock(producto.getStock() - carritoItem.getCantidad());
            productoRepository.save(producto);
        }

        pedidoGuardado.setItems(pedidoItems);
        pedidoGuardado.setTotal(total);
        Pedido pedidoFinal = pedidoRepository.save(pedidoGuardado);

        // Limpiar carrito
        carrito.getItems().clear();
        carritoRepository.save(carrito);

        return pedidoFinal; 
    }

    public List<Pedido> getPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public Pedido getPedidoById(Long pedidoId, Long usuarioId) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        if (!pedido.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tiene permiso para ver este pedido");
        }
        return pedido;
    }

    // --- INICIO DEL NUEVO MÉTODO ---
    /**
     * Operación atómica:
     * 1. Crea el Pedido (reduce stock, limpia carrito).
     * 2. Crea la Preferencia de Pago en MercadoPago.
     * Si el paso 2 falla, la transacción completa (incluyendo el paso 1) se revierte.
     */
    @Transactional(rollbackFor = {MPException.class, MPApiException.class, RuntimeException.class})
    public Preference crearPedidoYPreferencia(Long usuarioId, Long direccionId) 
            throws MPException, MPApiException, RuntimeException {
        
        // 1. Llama a tu lógica existente para crear el pedido
        //    (Esto reduce el stock y limpia el carrito)
        Pedido pedidoGuardado = crearPedidoDesdeCarrito(usuarioId, direccionId);

        // 2. Carga el pedido con sus items para MercadoPago
        //    Es necesario porque la sesión de 'pedidoGuardado' podría estar cerrada
        Pedido pedidoCompleto = pedidoRepository.findByIdWithItems(pedidoGuardado.getId())
                .orElseThrow(() -> new RuntimeException("Error al recargar el pedido para el pago"));
        
        // 3. Intenta crear la preferencia de pago
        try {
            Preference preference = paymentService.createPreference(pedidoCompleto);
            if (preference == null || preference.getInitPoint() == null) {
                // Forzamos un rollback si MercadoPago no da una URL
                throw new RuntimeException("No se pudo crear la preferencia de pago (init_point nulo)");
            }
            // Si todo OK, la transacción hace commit y devuelve la preferencia
            return preference;
        } catch (MPException | MPApiException | RuntimeException e) {
            // Si esto falla, @Transactional se encargará de revertir todo
            // (incluyendo la reducción de stock y la creación del pedido)
            throw e; 
        }
    }
    // --- FIN DEL NUEVO MÉTODO ---
}