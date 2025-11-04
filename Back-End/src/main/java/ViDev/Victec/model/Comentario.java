package ViDev.Victec.model;

public class Comentario {
    private long id;
    private String autor;
    private int rating;
    private String texto;
    private String fecha;

    // Constructor
    public Comentario(long id, String autor, int rating, String texto, String fecha) {
        this.id = id;
        this.autor = autor;
        this.rating = rating;
        this.texto = texto;
        this.fecha = fecha;
    }

    // Getters y Setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
}