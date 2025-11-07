package ViDev.Victec.model;

// 1. --- IMPORTA JsonBackReference ---
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "especificaciones")
public class Especificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 2. --- ¡CAMBIA ESTO! ---
    @JsonBackReference // <-- De @JsonIgnore a @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "spec_key")
    private String key;
    
    @Column(name = "spec_value")
    private String value;

    // --- (Constructores, Getters y Setters se quedan igual) ---

    public Especificacion() {}

    public Especificacion(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}