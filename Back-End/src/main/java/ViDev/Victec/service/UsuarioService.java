package ViDev.Victec.service;

import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
// --- (Estas importaciones ya deberían estar) ---
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender; // (Inyectado en el paso anterior)

    // --- INICIO DE LA MODIFICACIÓN EN 'register' ---
    public Usuario register(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        if (usuario.getRoles() == null || usuario.getRoles().isEmpty()) {
            usuario.getRoles().add("ROLE_USER");
        }
        
        // 1. Guardamos el usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // 2. Intentamos enviar el email de bienvenida
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(usuarioGuardado.getEmail());
            email.setSubject("¡Bienvenido a VicTec!");
            
            String textoMensaje = String.format(
                "¡Hola %s!\n\n" +
                "Gracias por registrarte en VicTec. Estamos emocionados de tenerte con nosotros.\n\n" +
                "Ya puedes iniciar sesión y explorar nuestros productos.\n\n" +
                "Saludos,\n" +
                "El equipo de VicTec",
                usuarioGuardado.getNombre() // Usamos el nombre del usuario guardado
            );
            
            email.setText(textoMensaje);
            mailSender.send(email);
            
        } catch (Exception e) {
            // Si el email falla, no rompemos el registro.
            // Solo lo informamos en la consola del servidor.
            System.err.println("Error al enviar email de bienvenida a: " + usuarioGuardado.getEmail());
            e.printStackTrace();
        }

        // 3. Devolvemos el usuario que acabamos de guardar
        return usuarioGuardado;
    }
    // --- FIN DE LA MODIFICACIÓN ---

    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(String.valueOf(email));
    }

    @Transactional
    public void changePassword(String userEmail, String oldPassword, String newPassword) {
        // 1. Encontrar al usuario
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Verificar que la contraseña antigua es correcta
        if (!passwordEncoder.matches(oldPassword, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // 3. (Opcional) Verificar que la nueva no sea igual a la antigua
        if (passwordEncoder.matches(newPassword, usuario.getPassword())) {
            throw new RuntimeException("La nueva contraseña no puede ser igual a la anterior");
        }

        // 4. Guardar la nueva contraseña encriptada
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
        
        // 5. Enviar email de confirmación de cambio de contraseña
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(usuario.getEmail()); 
            email.setSubject("Tu contraseña de VicTec ha sido actualizada");
            
            String textoMensaje = String.format(
                "Hola %s,\n\n" +
                "Te confirmamos que la contraseña de tu cuenta de VicTec ha sido actualizada exitosamente.\n\n" +
                "Si no fuiste tú quien realizó este cambio, por favor contacta a soporte inmediatamente.\n\n" +
                "Saludos,\n" +
                "El equipo de VicTec",
                usuario.getNombre()
            );
            
            email.setText(textoMensaje);
            
            mailSender.send(email); 
            
        } catch (Exception e) {
            System.err.println("Error al enviar email de confirmación de contraseña a: " + usuario.getEmail());
            e.printStackTrace();
        }
    }
}