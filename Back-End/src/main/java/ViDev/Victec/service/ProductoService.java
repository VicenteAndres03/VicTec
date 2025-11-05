package ViDev.Victec.service;

import ViDev.Victec.model.Comentario;
import ViDev.Victec.model.Especificacion;
import ViDev.Victec.model.Producto;
import ViDev.Victec.repository.ProductoRepository; // <-- 1. Importa tu Repositorio
import org.springframework.beans.factory.annotation.Autowired; // <-- 2. Importa Autowired
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional; // <-- 3. Importa Transactional

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    // 4. Inyecta el Repositorio de la base de datos
    @Autowired
    private ProductoRepository productoRepository;

    // 5. YA NO NECESITAMOS LA LISTA SIMULADA
    // private final List<Producto> productList = new ArrayList<>();

    
    // 6. Mantenemos @PostConstruct para POBLAR tu base de datos
    //    automáticamente la primera vez que inicies el servidor.
    @PostConstruct
    @Transactional // <-- 7. Asegura que todo se guarde correctamente
    private void loadMockData() {
        
        // Si la base de datos ya tiene productos, no hacemos nada.
        if (productoRepository.count() > 0) {
            return;
        }

        // --- Producto 1: Auriculares ---
        Producto audifonos = new Producto();
        audifonos.setNombre("Auriculares Pro-Gen");
        audifonos.setMarca("VicTec");
        audifonos.setPrecio(39990);
        audifonos.setPrecioAntiguo(59990.0);
        audifonos.setEnOferta(true);
        audifonos.setImgUrl("https://i.imgur.com/8Q1mP0B.png");
        audifonos.setSku("VT-AUD-PRO-001");
        audifonos.setStock(25);
        audifonos.setCategoria("Audio");
        audifonos.setDescripcion("Sumérgete en el sonido con los Auriculares Pro-Gen...");

        List<Especificacion> specsAudifonos = new ArrayList<>(List.of(
            new Especificacion("Conexión", "Bluetooth 5.2"),
            new Especificacion("Batería", "40 horas (con ANC apagado)")
        ));
        List<Comentario> comentariosAudifonos = new ArrayList<>(List.of(
            new Comentario("Carla M.", 5, "¡Me encantaron!", "hace 2 días")
        ));

        // 8. ¡MUY IMPORTANTE! Establecemos la relación en ambos sentidos
        audifonos.setEspecificaciones(specsAudifonos);
        audifonos.setComentarios(comentariosAudifonos);
        specsAudifonos.forEach(spec -> spec.setProducto(audifonos));
        comentariosAudifonos.forEach(com -> com.setProducto(audifonos));

        // --- Producto 2: Smartwatch ---
        Producto smartwatch = new Producto();
        smartwatch.setNombre("Smartwatch X5");
        smartwatch.setMarca("VicTec");
        smartwatch.setPrecio(179990);
        smartwatch.setPrecioAntiguo(null); // Acepta null porque es Double
        smartwatch.setEnOferta(false);
        smartwatch.setImgUrl("https://i.imgur.com/7H2j3bE.png");
        smartwatch.setSku("VT-SW-X5-002");
        smartwatch.setStock(10);
        smartwatch.setCategoria("Smartwatches");
        smartwatch.setDescripcion("El Smartwatch X5 es tu compañero de salud...");

        List<Especificacion> specsSmartwatch = new ArrayList<>(List.of(
            new Especificacion("Pantalla", "1.8\" AMOLED"),
            new Especificacion("Resistencia al Agua", "5 ATM (Hasta 50m)")
        ));
        List<Comentario> comentariosSmartwatch = new ArrayList<>(List.of(
            new Comentario("Juan Pablo", 5, "Excelente reloj, 10/10.", "hace 5 días")
        ));

        // 8. Establecemos la relación en ambos sentidos
        smartwatch.setEspecificaciones(specsSmartwatch);
        smartwatch.setComentarios(comentariosSmartwatch);
        specsSmartwatch.forEach(spec -> spec.setProducto(smartwatch));
        comentariosSmartwatch.forEach(com -> com.setProducto(smartwatch));


        // 9. Guardamos los productos en la BASE DE DATOS
        //    (CascadeType.ALL guardará las especificaciones y comentarios automáticamente)
        productoRepository.save(audifonos);
        productoRepository.save(smartwatch);
        
        System.out.println(">>> Base de datos poblada con 2 productos de prueba. <<<");
    }

    // --- Métodos Públicos (Ahora leen de la BD) ---

    /**
     * Devuelve la lista completa de productos.
     */
    public List<Producto> getAllProductos() {
        // 10. Lee desde la base de datos
        return productoRepository.findAll();
    }

    /**
     * Busca un producto por su ID.
     */
    public Optional<Producto> getProductoById(Long id) {
        // 11. Busca en la base de datos
        return productoRepository.findById(id);
    }
    
    /**
     * Guarda un nuevo producto en la base de datos.
     */
    @Transactional
    public Producto saveProducto(Producto producto) {
        // Asegura que las relaciones (hijos) estén vinculadas al padre
        if (producto.getEspecificaciones() != null) {
            producto.getEspecificaciones().forEach(spec -> spec.setProducto(producto));
        }
        if (producto.getComentarios() != null) {
            producto.getComentarios().forEach(com -> com.setProducto(producto));
        }
        return productoRepository.save(producto);
    }

    /**
     * Actualiza un producto existente.
     */
    @Transactional
    public Optional<Producto> updateProducto(Long id, Producto productoActualizado) {
        // 1. Busca el producto existente
        Optional<Producto> productoOpt = productoRepository.findById(id);

        if (productoOpt.isPresent()) {
            Producto productoExistente = productoOpt.get();

            // 2. Actualiza los campos simples
            productoExistente.setNombre(productoActualizado.getNombre());
            productoExistente.setMarca(productoActualizado.getMarca());
            productoExistente.setPrecio(productoActualizado.getPrecio());
            productoExistente.setPrecioAntiguo(productoActualizado.getPrecioAntiguo());
            productoExistente.setEnOferta(productoActualizado.isEnOferta());
            productoExistente.setImgUrl(productoActualizado.getImgUrl());
            productoExistente.setSku(productoActualizado.getSku());
            productoExistente.setStock(productoActualizado.getStock());
            productoExistente.setCategoria(productoActualizado.getCategoria());
            productoExistente.setDescripcion(productoActualizado.getDescripcion());

            // 3. Borra las especificaciones y comentarios antiguos
            productoExistente.getEspecificaciones().clear();
            productoExistente.getComentarios().clear();

            // 4. Añade las nuevas especificaciones y establece la relación
            if (productoActualizado.getEspecificaciones() != null) {
                for (Especificacion spec : productoActualizado.getEspecificaciones()) {
                    spec.setProducto(productoExistente); // Vincula al padre
                    productoExistente.getEspecificaciones().add(spec);
                }
            }

            // 5. Añade los nuevos comentarios y establece la relación
            if (productoActualizado.getComentarios() != null) {
                for (Comentario com : productoActualizado.getComentarios()) {
                    com.setProducto(productoExistente); // Vincula al padre
                    productoExistente.getComentarios().add(com);
                }
            }

            // 6. Guarda el producto actualizado (con sus hijos)
            return Optional.of(productoRepository.save(productoExistente));
        } else {
            // Si no se encuentra, devuelve un Optional vacío
            return Optional.empty();
        }
    }

    /**
     * Elimina un producto por su ID.
     */
    public boolean deleteProducto(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return true; // Se eliminó con éxito
        } else {
            return false; // No se encontró para eliminar
        }
    }

    @Transactional
    public Optional<Producto> updateStock(Long id, int stock) {
        Optional<Producto> productoOpt = productoRepository.findById(id);
        if (productoOpt.isPresent()) {
            Producto producto = productoOpt.get();
            producto.setStock(stock);
            return Optional.of(productoRepository.save(producto));
        } else {
            return Optional.empty();
        }
    }
}