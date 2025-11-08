package ViDev.Victec.payload;

// Este es un DTO (Data Transfer Object)
// Es una clase simple que solo sirve para "transportar"
// los datos del formulario de comentario desde el Frontend al Backend.

public class ComentarioRequest {
    
    private String texto;
    private int rating;

    // Getters y Setters (Spring los necesita para leer el JSON)

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}