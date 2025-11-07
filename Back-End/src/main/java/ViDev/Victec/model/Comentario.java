package ViDev.Victec.model;

// 1. --- IMPORTA JsonBackReference ---
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "comentarios")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 2. --- ¡CAMBIA ESTO! ---
    @JsonBackReference // <-- De @JsonIgnore a @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    private String autor;
    private int rating; // 1-5
    
    @Lob 
    @Column(columnDefinition = "TEXT")
    private String texto;
    
    private String fecha;

    // --- (Constructores, Getters y Setters se quedan igual) ---

    public Comentario() {}
    
    public Comentario(String autor, int rating, String texto, String fecha) {
        this.autor = autor;
        this.rating = rating;
        this.texto = texto;
        this.fecha = fecha;
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

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
}