package ViDev.Victec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void enviarCorreoSoporte(String nombre, String emailCliente, String mensaje) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            
            // Configuración idéntica a SenaleStudio: Definir explícitamente el From
            email.setFrom("vixdeev@gmail.com");
            
            email.setTo("vixdeev@gmail.com");
            email.setSubject("Soporte VicTec: " + nombre);
            
            // Construcción simple del mensaje
            String texto = "Has recibido un nuevo mensaje de soporte:\n\n" +
                           "De: " + nombre + "\n" +
                           "Email del cliente: " + emailCliente + "\n\n" +
                           "Mensaje:\n" + mensaje;
            
            email.setText(texto);
            
            mailSender.send(email);
            System.out.println("Email enviado con éxito (Configuración SenaleStudio)");
            
        } catch (Exception e) {
            System.err.println("Error al enviar el correo: " + e.getMessage());
            e.printStackTrace();
        }
    }
}