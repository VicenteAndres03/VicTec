package ViDev.Victec.model;

// 1. IMPORTA ESTAS DOS CLASES
import jakarta.persistence.Column;
import jakarta.persistence.Lob;

// 2. IMPORTA ArrayList
import java.util.ArrayList; 
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
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

    // 3. ¡AQUÍ ESTÁ EL ARREGLO!
    // Inicializa las listas para que nunca sean 'null'.
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Especificacion> especificaciones = new ArrayList<>();

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comentario> comentarios = new ArrayList<>();

    // --- Getters y Setters (Sin cambios) ---

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
    public List<Especificacion> getEspecificaciones() {
        return especificaciones;
    }
    public void setEspecificaciones(List<Especificacion> especificaciones) {
        this.especificaciones = especificaciones;
    }
    public List<Comentario> getComentarios() {
        return comentarios;
    }
    public void setComentarios(List<Comentario> comentarios) {
        this.comentarios = comentarios;
    }
}