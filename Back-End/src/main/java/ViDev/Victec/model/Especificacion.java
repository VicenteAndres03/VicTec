package ViDev.Victec.model;

public class Especificacion {
    private String key;
    private String value;

    // Constructor
    public Especificacion(String key, String value) {
        this.key = key;
        this.value = value;
    }

    // Getters y Setters (¡Importantes para que Spring los convierta a JSON!)
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
