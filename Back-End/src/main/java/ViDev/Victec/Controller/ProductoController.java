package ViDev.Victec.Controller;

import ViDev.Victec.model.Producto;
import ViDev.Victec.service.ProductoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/productos") // La URL base para todos los productos
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // --- ENDPOINT PÚBLICO: Obtener todos los productos ---
    // Usado por: Pagina de Inicio, Página de Productos
    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    // --- ENDPOINT PÚBLICO: Obtener un producto por ID ---
    // Usado por: Página de Detalle de Producto
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Optional<Producto> productoOpt = productoService.getProductoById(id);
        
        if (productoOpt.isPresent()) {
            return new ResponseEntity<>(productoOpt.get(), HttpStatus.OK);
        } else {
            // Si no se encuentra, devuelve 404
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // --- ENDPOINT ADMIN: Crear un nuevo producto ---
    // Usado por: GestionProductosPage
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        // Asegura que las relaciones (hijos) estén vinculadas al padre
        if (producto.getEspecificaciones() != null) {
            producto.getEspecificaciones().forEach(spec -> spec.setProducto(producto));
        }
        if (producto.getComentarios() != null) {
            producto.getComentarios().forEach(com -> com.setProducto(producto));
        }
        
        Producto nuevoProducto = productoService.saveProducto(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    // --- ENDPOINT ADMIN: Actualizar un producto existente ---
    // Usado por: GestionProductosPage
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto productoActualizado) {
        Optional<Producto> productoOpt = productoService.updateProducto(id, productoActualizado);

        if (productoOpt.isPresent()) {
            return new ResponseEntity<>(productoOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // --- ENDPOINT ADMIN: Eliminar un producto ---
    // Usado por: GestionProductosPage
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        boolean eliminado = productoService.deleteProducto(id);
        
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Éxito, sin contenido que devolver
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // No se encontró para eliminar
        }
    }

    // --- ENDPOINT ADMIN: Actualizar solo el stock de un producto ---
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        Integer newStock = payload.get("stock");
        if (newStock == null) {
            return ResponseEntity.badRequest().build(); // O un mensaje de error más explícito
        }

        Optional<Producto> productoOpt = productoService.updateStock(id, newStock);

        if (productoOpt.isPresent()) {
            return new ResponseEntity<>(productoOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // --- (Estos métodos son NUEVOS) ---
    // Los métodos de persistencia (save/update/delete) están implementados
    // en `ProductoService`. Este controlador solo delega en ese servicio.
}