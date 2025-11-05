package ViDev.Victec.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

// DTO simple para recibir los datos del formulario
// (Puedes crear un archivo .java separado para esto si quieres)
class SoporteRequest {
    private String name;
    private String email;
    private String message;

    // Getters y Setters (importante para que Spring lea el JSON)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

@RestController
@RequestMapping("/api/v1/soporte")
public class SoporteController {

    @Autowired
    private JavaMailSender mailSender;

    // Tu email personal al que quieres que lleguen los mensajes
    private String miEmailPersonal = "vixdeev@gmail.com";

    @PostMapping("/enviar-email")
    public String enviarEmail(@RequestBody SoporteRequest soporteRequest) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            
            // A quién le llega el correo (a ti)
            email.setTo(miEmailPersonal);
            
            // El asunto del correo
            email.setSubject("Nuevo Mensaje de Soporte de: " + soporteRequest.getName());
            
            // El cuerpo del mensaje
            String textoMensaje = "Has recibido un nuevo mensaje de tu página VicTec:\n\n" +
                                  "De: " + soporteRequest.getName() + "\n" +
                                  "Email del cliente: " + soporteRequest.getEmail() + "\n\n" +
                                  "Mensaje:\n" + soporteRequest.getMessage();
            
            email.setText(textoMensaje);

            // El email "desde" el que se envía (configurado en .properties)
            // email.setFrom("tu-email-de-soporte@gmail.com"); // Spring lo hace automático

            mailSender.send(email);
            
            return "{\"status\": \"exito\", \"message\": \"Email enviado exitosamente\"}";
        } catch (Exception e) {
            // Manejo de errores
            e.printStackTrace();
            return "{\"status\": \"error\", \"message\": \"Error al enviar el email\"}";
        }
    }
}
