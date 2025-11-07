package ViDev.Victec.service;

import ViDev.Victec.model.Comentario;
import ViDev.Victec.model.Especificacion;
import ViDev.Victec.model.Producto;
import ViDev.Victec.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

// 1. --- ¡IMPORTACIÓN CORREGIDA! ---
// Asegúrate de que sea la anotación de Spring
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
// 2. --- ANOTACIÓN AÑADIDA A LA CLASE ---
// Esto hace que todos los métodos sean transaccionales y de solo lectura por defecto.
@Transactional(readOnly = true)
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @PostConstruct
    // 3. --- MÉTODO DE ESCRITURA ---
    // Anulamos readOnly=true porque este método SÍ escribe en la BD.
    @Transactional
    private void loadMockData() {
        
        if (productoRepository.count() > 0) {
            return;
        }

        // --- Producto 1: Auriculares ---
        Producto audifonos = new Producto();
        audifonos.setNombre("Auriculares TWS Modelo Mate50"); 
        audifonos.setMarca("XIAOMI"); 
        audifonos.setPrecio(12000); 
        audifonos.setPrecioAntiguo(null); 
        audifonos.setEnOferta(false); 
        audifonos.setImgUrl("https://i.imgur.com/333A19a.png"); 
        audifonos.setSku("XI-TWS-M50-001");
        audifonos.setStock(84);
        audifonos.setCategoria("Audio"); // <-- Categoría importante para el filtro
        audifonos.setDescripcion("Descubre la libertad del verdadero sonido inalámbrico con los auriculares TWS Mate50. Diseñados para tu estilo de vida activo, estos auriculares combinan un diseño ergonómico y ligero con la última tecnología Bluetooth para ofrecerte una experiencia auditiva superior sin enredos de cables. Características Principales: Sonido Estéreo de Alta Fidelidad (Hi-Fi): Disfruta de tu música, podcasts y llamadas con bajos potentes y agudos claros y nítidos. Conectividad Bluetooth 5.2: La última versión de Bluetooth garantiza una conexión más rápida, estable y con menor consumo de energía. Olvídate de los cortes y disfruta de una transmisión fluida. Controles Táctiles Inteligentes: Maneja tu música y tus llamadas con un simple toque. Pausa, reproduce, salta canciones o contesta y cuelga llamadas sin sacar tu teléfono del bolsillo. Estuche de Carga Portátil: El estuche compacto no solo protege tus auriculares, sino que también funciona como una batería portátil, dándote múltiples cargas adicionales para que la música nunca pare. Pantalla LED Digital (Opcional, si tu modelo la tiene): Algunos modelos incluyen una práctica pantalla LED en el estuche que te muestra el porcentaje exacto de batería restante. Micrófonos Integrados: Realiza y recibe llamadas con manos libres y total claridad. Diseño Cómodo y Ligero: Su diseño ergonómico se ajusta perfectamente a tu oído, haciéndolos ideales para largas sesiones de escucha, para ir al gimnasio o para correr. Amplia Compatibilidad: Conéctalos fácilmente con cualquier dispositivo habilitado para Bluetooth, ya sea Android, iOS (iPhone) o Windows. Ideal para: Hacer deporte Viajar en transporte público Jugar videojuegos (baja latencia) Videollamadas y trabajo.");

        audifonos.setEspecificaciones(new ArrayList<>());
        audifonos.setComentarios(new ArrayList<>());
        
        productoRepository.save(audifonos);
        
        System.out.println(">>> Base de datos poblada con 1 producto de prueba (Mate50). <<<");
    }

    // --- Métodos Públicos (Ahora leen de la BD) ---

    // (Este método ahora hereda @Transactional(readOnly = true) de la clase)
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    // (Este método ahora hereda @Transactional(readOnly = true) de la clase)
    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }
    
    // 4. --- MÉTODO CORREGIDO ---
    // (Este método ahora hereda @Transactional(readOnly = true) de la clase)
    public List<Producto> getProductosByCategoria(String categoria) {
        // Llama al nuevo método del repositorio
        return productoRepository.findByCategoriaIgnoreCase(categoria);
    }

    // 5. --- MÉTODO DE ESCRITURA ---
    // Anulamos readOnly=true
    @Transactional
    public Producto saveProducto(Producto producto) {
        
        if (producto.getEspecificaciones() == null) {
            producto.setEspecificaciones(new ArrayList<>());
        }
        if (producto.getComentarios() == null) {
            producto.setComentarios(new ArrayList<>());
        }

        if (producto.getEspecificaciones() != null) {
            producto.getEspecificaciones().forEach(spec -> spec.setProducto(producto));
        }
        if (producto.getComentarios() != null) {
            producto.getComentarios().forEach(com -> com.setProducto(producto));
        }
        return productoRepository.save(producto);
    }

    // 6. --- MÉTODO DE ESCRITURA ---
    // Anulamos readOnly=true
    @Transactional
    public Optional<Producto> updateProducto(Long id, Producto productoActualizado) {
        Optional<Producto> productoOpt = productoRepository.findById(id);

        if (productoOpt.isPresent()) {
            Producto productoExistente = productoOpt.get();

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

            productoExistente.getEspecificaciones().clear();
            productoExistente.getComentarios().clear();

            if (productoActualizado.getEspecificaciones() != null) {
                for (Especificacion spec : productoActualizado.getEspecificaciones()) {
                    spec.setProducto(productoExistente);
                    productoExistente.getEspecificaciones().add(spec);
                }
            }

            if (productoActualizado.getComentarios() != null) {
                for (Comentario com : productoActualizado.getComentarios()) {
                    com.setProducto(productoExistente);
                    productoExistente.getComentarios().add(com);
                }
            }

            return Optional.of(productoRepository.save(productoExistente));
        } else {
            return Optional.empty();
        }
    }

    // 7. --- MÉTODO DE ESCRITURA ---
    // Anulamos readOnly=true
    @Transactional
    public boolean deleteProducto(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // 8. --- MÉTODO DE ESCRITURA ---
    // Anulamos readOnly=true
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