package ViDev.Victec.model;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
// 1. --- ¡IMPORTA Set y HashSet! ---
import java.util.HashSet;
import java.util.Set; 

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
// 2. --- ¡Quitamos el import de FetchType y List! ---
import jakarta.persistence.Table;


@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String marca;
    private double precio;
    private Double precioAntiguo;
    private boolean enOferta;
    private String imgUrl;
    private String sku;
    private int stock;
    private String categoria;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // 3. --- ¡CAMBIO DE List A Set! ---
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Especificacion> especificaciones = new HashSet<>();

    // 4. --- ¡CAMBIO DE List A Set! ---
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Comentario> comentarios = new HashSet<>();

    // --- Getters y Setters (¡Actualizados a Set!) ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getMarca() {
        return marca;
    }
    public void setMarca(String marca) {
        this.marca = marca;
    }
    public double getPrecio() {
        return precio;
    }
    public void setPrecio(double precio) {
        this.precio = precio;
    }
    public Double getPrecioAntiguo() {
        return precioAntiguo;
    }
    public void setPrecioAntiguo(Double precioAntiguo) {
        this.precioAntiguo = precioAntiguo;
    }
    public boolean isEnOferta() {
        return enOferta;
    }
    public void setEnOferta(boolean enOferta) {
        this.enOferta = enOferta;
    }
    public String getImgUrl() {
        return imgUrl;
    }
    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }
    public String getSku() {
        return sku;
    }
    public void setSku(String sku) {
        this.sku = sku;
    }
    public int getStock() {
        return stock;
    }
    public void setStock(int stock) {
        this.stock = stock;
    }
    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // 5. --- Getter actualizado a Set ---
    public Set<Especificacion> getEspecificaciones() {
        return especificaciones;
    }
    // 6. --- Setter actualizado a Set ---
    public void setEspecificaciones(Set<Especificacion> especificaciones) {
        this.especificaciones = especificaciones;
    }

    // 7. --- Getter actualizado a Set ---
    public Set<Comentario> getComentarios() {
        return comentarios;
    }
    // 8. --- Setter actualizado a Set ---
    public void setComentarios(Set<Comentario> comentarios) {
        this.comentarios = comentarios;
    }
}