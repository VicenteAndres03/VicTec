package ViDev.Victec.service;

import ViDev.Victec.model.*;
import ViDev.Victec.repository.CarritoRepository;
import ViDev.Victec.repository.ProductoRepository;
import ViDev.Victec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Optional<Carrito> getCarritoByUsuarioId(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId);
    }

    public Carrito addProductoToCarrito(Long usuarioId, Long productoId, int cantidad) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Producto producto = productoRepository.findById(productoId).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId).orElseGet(() -> {
            Carrito newCarrito = new Carrito();
            newCarrito.setUsuario(usuario);
            return newCarrito;
        });

        Optional<CarritoItem> itemOpt = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(productoId))
                .findFirst();

        if (itemOpt.isPresent()) {
            CarritoItem item = itemOpt.get();
            item.setCantidad(item.getCantidad() + cantidad);
        } else {
            CarritoItem newItem = new CarritoItem();
            newItem.setProducto(producto);
            newItem.setCantidad(cantidad);
            newItem.setCarrito(carrito);
            carrito.getItems().add(newItem);
        }

        return carritoRepository.save(carrito);
    }

    public Carrito removeProductoFromCarrito(Long usuarioId, Long productoId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId).orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        carrito.getItems().removeIf(item -> item.getProducto().getId().equals(productoId));

        return carritoRepository.save(carrito);
    }

    public void clearCarrito(Long usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId).orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }
}
