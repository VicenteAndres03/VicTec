package ViDev.Victec.service;

import ViDev.Victec.model.*;
import ViDev.Victec.repository.*;
import ViDev.Victec.service.PaymentService;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional 
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

    @Autowired
    private PaymentService paymentService;

    // ... (El método finalizarCompra se queda igual) ...
    @Transactional(rollbackFor = RuntimeException.class)
    public Pedido finalizarCompra(Long usuarioId, Long direccionId) {
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
        pedido.setEstado(EstadoPedido.PROCESANDO); 
        
        pedido.setTotal(BigDecimal.ZERO);
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        Set<PedidoItem> pedidoItems = new HashSet<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CarritoItem carritoItem : carrito.getItems()) {
            Producto producto = carritoItem.getProducto();
            if (producto.getStock() < carritoItem.getCantidad()) {
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

            producto.setStock(producto.getStock() - carritoItem.getCantidad());
            productoRepository.save(producto);
        }

        pedidoGuardado.setItems(pedidoItems);
        pedidoGuardado.setTotal(total);
        Pedido pedidoFinal = pedidoRepository.save(pedidoGuardado);

        carrito.getItems().clear();
        carritoRepository.save(carrito);

        return pedidoFinal; 
    }

    // --- AQUÍ ESTÁ EL CAMBIO ---
    public List<Pedido> getPedidosPorUsuario(Long usuarioId) {
        // Ahora llamamos al nuevo método que carga todo
        return pedidoRepository.findByUsuarioIdWithItemsAndProducts(usuarioId);
    }
    // --- FIN DEL CAMBIO ---

    public Pedido getPedidoById(Long pedidoId, Long usuarioId) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        if (!pedido.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tiene permiso para ver este pedido");
        }
        return pedido;
    }

    @Transactional(readOnly = true) 
    public Preference crearPreferenciaDePago(Long usuarioId, Long direccionId) 
            throws MPException, MPApiException, RuntimeException {
        
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }
        return paymentService.createPreference(carrito, direccionId);
    }
}