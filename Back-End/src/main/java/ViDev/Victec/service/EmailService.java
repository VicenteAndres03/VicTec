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

    // Esta etiqueta es la MAGIA. Hace que este método se ejecute 
    // en un hilo separado, liberando al usuario inmediatamente.
    @Async 
    public void enviarCorreoSoporte(String nombre, String emailCliente, String mensaje) {
        try {
            // Simulación de espera (para que veas que no afecta al usuario)
            // Thread.sleep(1000); 

            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo("vixdeev@gmail.com"); // Tu correo
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
            
            System.out.println("✅ Email de soporte enviado en segundo plano.");

        } catch (Exception e) {
            // Como es asíncrono, si falla aquí el usuario no se entera, 
            // por lo que es vital dejar registro en el log.
            System.err.println("❌ Error enviando email async: " + e.getMessage());
            e.printStackTrace();
        }
    }
}