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
@RequestMapping("/api/v1/productos") 
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // --- ENDPOINT MODIFICADO ---
    // Ahora acepta un parámetro opcional ?categoria=...
    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos(
            @RequestParam(name = "categoria", required = false) String categoria) {
        
        List<Producto> productos;
        
        if (categoria != null && !categoria.isEmpty()) {
            // Si hay una categoría, filtra por categoría
            productos = productoService.getProductosByCategoria(categoria);
        } else {
            // Si no, devuelve todos
            productos = productoService.getAllProductos();
        }
        
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }
    // --- FIN DE LA MODIFICACIÓN ---

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Optional<Producto> productoOpt = productoService.getProductoById(id);
        
        if (productoOpt.isPresent()) {
            return new ResponseEntity<>(productoOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        if (producto.getEspecificaciones() != null) {
            producto.getEspecificaciones().forEach(spec -> spec.setProducto(producto));
        }
        if (producto.getComentarios() != null) {
            producto.getComentarios().forEach(com -> com.setProducto(producto));
        }
        
        Producto nuevoProducto = productoService.saveProducto(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        boolean eliminado = productoService.deleteProducto(id);
        
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        Integer newStock = payload.get("stock");
        if (newStock == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Producto> productoOpt = productoService.updateStock(id, newStock);

        if (productoOpt.isPresent()) {
            return new ResponseEntity<>(productoOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}