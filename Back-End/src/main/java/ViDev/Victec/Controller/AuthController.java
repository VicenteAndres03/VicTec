package ViDev.Victec.Controller;

import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.UsuarioRepository; // --- NUEVA IMPORTACIÓN ---
import ViDev.Victec.security.jwt.JwtUtils;
import ViDev.Victec.security.services.UserDetailsImpl;
import ViDev.Victec.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder; // --- NUEVA IMPORTACIÓN ---
import org.springframework.web.bind.annotation.*;

// --- NUEVAS IMPORTACIONES DE GOOGLE ---
// --- NUEVAS IMPORTACIONES DE GOOGLE (Añade estas líneas) ---
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload; // <-- Esta es la que falta
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory; // <-- Y esta también
import java.util.Collections;
// --- FIN DE LAS IMPORTACIONES A AÑADIR ---
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
// --- FIN NUEVAS IMPORTACIONES ---

import java.util.HashSet;
import java.util.Map;
import java.util.Optional; // --- NUEVA IMPORTACIÓN ---
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    // --- NUEVOS CAMPOS INYECTADOS ---
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${google.client.id}")
    private String googleClientId;
    // --- FIN DE NUEVOS CAMPOS ---

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email and password required"));
        }

        if (usuarioService.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "email already in use"));
        }

        Set<String> roles = req.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = new HashSet<>();
            roles.add("ROLE_USER");
            req.setRoles(roles);
        }

        // Usamos el servicio que ya envía el email de bienvenida
        Usuario saved = usuarioService.register(req);
        return ResponseEntity.ok(Map.of("id", saved.getId(), "email", saved.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        String token = jwtUtils.generateJwtToken(auth);

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Set<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toSet());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "id", userDetails.getId(),
            "email", userDetails.getEmail(),
            "nombre", userDetails.getNombre(),
            "roles", roles
        ));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload, Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userEmail = userDetails.getUsername();

        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Se requieren ambas contraseñas"));
        }

        try {
            usuarioService.changePassword(userEmail, oldPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- INICIO: ENDPOINT NUEVO PARA GOOGLE LOGIN ---
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        String googleToken = payload.get("token");
        if (googleToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se proporcionó el token de Google"));
        }

        // 1. Inicializar el verificador de Google
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
            .setAudience(Collections.singletonList(googleClientId))
            .build();

        GoogleIdToken idToken;
        try {
            // 2. Verificar el token que nos envió el frontend
            idToken = verifier.verify(googleToken);
        } catch (GeneralSecurityException | IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token de Google inválido o expirado"));
        }

        if (idToken != null) {
            // 3. Si el token es válido, extraemos los datos
            Payload googlePayload = idToken.getPayload();
            String email = googlePayload.getEmail();
            String nombre = (String) googlePayload.get("name");

            // 4. Lógica de "Buscar o Crear"
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

            Usuario usuario;
            if (usuarioOpt.isPresent()) {
                // 4a. Usuario YA EXISTE
                usuario = usuarioOpt.get();
                System.out.println("Usuario existente encontrado: " + email);
            } else {
                // 4b. Usuario NO EXISTE -> Lo creamos
                System.out.println("Usuario nuevo, registrando: " + email);
                Usuario usuarioParaRegistrar = new Usuario();
                usuarioParaRegistrar.setEmail(email);
                usuarioParaRegistrar.setNombre(nombre);
                
                // Generamos una contraseña aleatoria (no la usará, pero es 'not null')
                String randomPassword = java.util.UUID.randomUUID().toString();
                usuarioParaRegistrar.setPassword(randomPassword); // El servicio la encriptará
                
                // Usamos el servicio de registro (que ya asigna roles y envía email)
                usuario = usuarioService.register(usuarioParaRegistrar);
            }

            // 5. Generar NUESTRO token (VicTec) para este usuario
            // (Replicamos la lógica del endpoint /login)
            
            UserDetailsImpl userDetails = UserDetailsImpl.build(usuario);
            
            Authentication auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            );
            
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = jwtUtils.generateJwtToken(auth);

            Set<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toSet());

            // 6. Devolver la respuesta (igual que /login)
            return ResponseEntity.ok(Map.of(
                "token", token,
                "id", userDetails.getId(),
                "email", userDetails.getEmail(),
                "nombre", userDetails.getNombre(),
                "roles", roles
            ));

        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No se pudo verificar el token de Google"));
        }
    }
    // --- FIN: ENDPOINT NUEVO ---
}