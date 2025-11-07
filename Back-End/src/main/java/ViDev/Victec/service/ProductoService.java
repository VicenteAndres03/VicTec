package ViDev.Victec.service;

import ViDev.Victec.model.Comentario;
import ViDev.Victec.model.Especificacion;
import ViDev.Victec.model.Producto;
import ViDev.Victec.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @PostConstruct
    @Transactional
    private void loadMockData() {
        
        if (productoRepository.count() > 0) {
            return;
        }

        // --- Producto 1: Auriculares ---
        Producto audifonos = new Producto();
        audifonos.setNombre("Auriculares TWS Modelo Mate50"); // <-- Nombre actualizado
        audifonos.setMarca("XIAOMI"); // <-- Marca actualizada
        audifonos.setPrecio(12000); // <-- Precio actualizado
        audifonos.setPrecioAntiguo(null); // <-- Sin precio antiguo
        audifonos.setEnOferta(false); // <-- No en oferta
        audifonos.setImgUrl("https://i.imgur.com/333A19a.png"); // <-- URL de imagen actualizada
        audifonos.setSku("XI-TWS-M50-001");
        audifonos.setStock(84);
        audifonos.setCategoria("Audio");
        audifonos.setDescripcion("Descubre la libertad del verdadero sonido inalámbrico con los auriculares TWS Mate50. Diseñados para tu estilo de vida activo, estos auriculares combinan un diseño ergonómico y ligero con la última tecnología Bluetooth para ofrecerte una experiencia auditiva superior sin enredos de cables. Características Principales: Sonido Estéreo de Alta Fidelidad (Hi-Fi): Disfruta de tu música, podcasts y llamadas con bajos potentes y agudos claros y nítidos. Conectividad Bluetooth 5.2: La última versión de Bluetooth garantiza una conexión más rápida, estable y con menor consumo de energía. Olvídate de los cortes y disfruta de una transmisión fluida. Controles Táctiles Inteligentes: Maneja tu música y tus llamadas con un simple toque. Pausa, reproduce, salta canciones o contesta y cuelga llamadas sin sacar tu teléfono del bolsillo. Estuche de Carga Portátil: El estuche compacto no solo protege tus auriculares, sino que también funciona como una batería portátil, dándote múltiples cargas adicionales para que la música nunca pare. Pantalla LED Digital (Opcional, si tu modelo la tiene): Algunos modelos incluyen una práctica pantalla LED en el estuche que te muestra el porcentaje exacto de batería restante. Micrófonos Integrados: Realiza y recibe llamadas con manos libres y total claridad. Diseño Cómodo y Ligero: Su diseño ergonómico se ajusta perfectamente a tu oído, haciéndolos ideales para largas sesiones de escucha, para ir al gimnasio o para correr. Amplia Compatibilidad: Conéctalos fácilmente con cualquier dispositivo habilitado para Bluetooth, ya sea Android, iOS (iPhone) o Windows. Ideal para: Hacer deporte Viajar en transporte público Jugar videojuegos (baja latencia) Videollamadas y trabajo.");

        // Datos de prueba actualizados para que coincidan con la imagen
        audifonos.setEspecificaciones(new ArrayList<>());
        audifonos.setComentarios(new ArrayList<>());
        
        productoRepository.save(audifonos);
        
        System.out.println(">>> Base de datos poblada con 1 producto de prueba (Mate50). <<<");
    }

    // --- Métodos Públicos (Ahora leen de la BD) ---

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }
    
    // --- ¡MÉTODO NUEVO AÑADIDO! ---
    public List<Producto> searchProductos(String query) {
        // Llama al nuevo método del repositorio
        return productoRepository.findByNombreContainingIgnoreCase(query);
    }
    // --- FIN DEL MÉTODO NUEVO ---

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

    public boolean deleteProducto(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return true;
        } else {
            return false;
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