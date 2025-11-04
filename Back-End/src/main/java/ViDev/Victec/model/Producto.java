package ViDev.Victec.model;

import java.util.List;

public class Producto {
    private long id;
    private String nombre;
    private String marca;
    private double precio;
    private Double precioAntiguo; // Usamos Double (objeto) para que pueda ser null
    private boolean enOferta;
    private String imgUrl;
    private String sku;
    private int stock;
    private String categoria;
    private String descripcion;
    private List<Especificacion> especificaciones;
    private List<Comentario> comentarios;

    // Constructor
    public Producto(long id, String nombre, String marca, double precio, Double precioAntiguo, boolean enOferta, String imgUrl, String sku, int stock, String categoria, String descripcion, List<Especificacion> especificaciones, List<Comentario> comentarios) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.precio = precio;
        this.precioAntiguo = precioAntiguo;
        this.enOferta = enOferta;
        this.imgUrl = imgUrl;
        this.sku = sku;
        this.stock = stock;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.especificaciones = especificaciones;
        this.comentarios = comentarios;
    }

    // Getters y Setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }
    public Double getPrecioAntiguo() { return precioAntiguo; }
    public void setPrecioAntiguo(Double precioAntiguo) { this.precioAntiguo = precioAntiguo; }
    public boolean isEnOferta() { return enOferta; }
    public void setEnOferta(boolean enOferta) { this.enOferta = enOferta; }
    public String getImgUrl() { return imgUrl; }
    public void setImgUrl(String imgUrl) { this.imgUrl = imgUrl; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public List<Especificacion> getEspecificaciones() { return especificaciones; }
    public void setEspecificaciones(List<Especificacion> especificaciones) { this.especificaciones = especificaciones; }
    public List<Comentario> getComentarios() { return comentarios; }
    public void setComentarios(List<Comentario> comentarios) { this.comentarios = comentarios; }
}
