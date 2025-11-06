package ViDev.Victec.service;

import ViDev.Victec.model.*;
import ViDev.Victec.repository.*;
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

    // --- INYECCIÓN AÑADIDA ---
    @Autowired
    private PedidoItemRepository pedidoItemRepository; // Necesitamos esto para guardar los items

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

        // --- INICIO DE LÓGICA CORREGIDA ---
        
        // 1. Guarda el pedido PRIMERO (sin items y con total 0) para que obtenga un ID.
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
            pedidoItem.setPedido(pedidoGuardado); // 2. Asigna el Pedido con ID
            pedidoItem.setProducto(producto);
            pedidoItem.setCantidad(carritoItem.getCantidad());
            pedidoItem.setPrecio(BigDecimal.valueOf(producto.getPrecio()));
            
            // 3. ¡MUY IMPORTANTE! Guarda el item individualmente
            pedidoItemRepository.save(pedidoItem);
            
            pedidoItems.add(pedidoItem);

            total = total.add(pedidoItem.getPrecio().multiply(BigDecimal.valueOf(carritoItem.getCantidad())));

            // Actualizar stock
            producto.setStock(producto.getStock() - carritoItem.getCantidad());
            productoRepository.save(producto);
        }

        // 4. Actualiza el pedido con el total real y la lista de items
        pedidoGuardado.setItems(pedidoItems);
        pedidoGuardado.setTotal(total);
        Pedido pedidoFinal = pedidoRepository.save(pedidoGuardado);

        // Limpiar carrito
        carrito.getItems().clear();
        carritoRepository.save(carrito);

        return pedidoFinal; // 5. Devuelve el pedido completo y actualizado
        // --- FIN DE LÓGICA CORREGIDA ---
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
}