package ViDev.Victec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Inyectamos el correo configurado para usarlo como remitente
    @Value("${spring.mail.username}")
    private String remitente;

    @Async 
    public void enviarCorreoSoporte(String nombre, String emailCliente, String mensaje) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            
            // Es importante establecer el 'From' igual al usuario autenticado
            email.setFrom(remitente); 
            
            email.setTo("vixdeev@gmail.com"); 
            email.setSubject("Nuevo Mensaje de Soporte de: " + nombre);
            
            String textoMensaje = String.format(
                "Has recibido un nuevo mensaje de soporte:\n\n" +
                "De: %s\n" +
                "Email: %s\n\n" +
                "Mensaje:\n%s",
                nombre, emailCliente, mensaje
            );
            
            email.setText(textoMensaje);
            mailSender.send(email);
            
            System.out.println("✅ Email de soporte enviado correctamente a vixdeev@gmail.com");

        } catch (Exception e) {
            System.err.println("❌ Error CRÍTICO enviando email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}