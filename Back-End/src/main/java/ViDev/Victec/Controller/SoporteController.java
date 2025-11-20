package ViDev.Victec.Controller;

import ViDev.Victec.service.EmailService; // Importamos el nuevo servicio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

// DTO (Se mantiene igual)
class SoporteRequest {
    private String name;
    private String email;
    private String message;

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
    private EmailService emailService; // Inyectamos NUESTRO servicio, no el JavaMailSender directo

    @PostMapping("/enviar-email")
    public String enviarEmail(@RequestBody SoporteRequest req) {
        
        // Llamamos al método asíncrono.
        // Java NO esperará a que termine, pasará a la siguiente línea INMEDIATAMENTE.
        emailService.enviarCorreoSoporte(req.getName(), req.getEmail(), req.getMessage());

        // Le respondemos al usuario al instante
        return "{\"status\": \"exito\", \"message\": \"Mensaje recibido. Te responderemos pronto.\"}";
    }
}