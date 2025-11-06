package ViDev.Victec.service;

import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// --- AÑADE ESTA IMPORTACIÓN ---
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario register(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        if (usuario.getRoles() == null || usuario.getRoles().isEmpty()) {
            usuario.getRoles().add("ROLE_USER");
        }
        return usuarioRepository.save(usuario);
    }

    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    // --- INICIO: AÑADE ESTE MÉTODO NUEVO ---
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
    }
    // --- FIN: MÉTODO NUEVO ---
}