package ViDev.Victec.Controller;

import ViDev.Victec.model.Usuario;
import ViDev.Victec.security.jwt.JwtUtils;
import ViDev.Victec.security.services.UserDetailsImpl;
import ViDev.Victec.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Map;
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email and password required"));
        }

        if (usuarioService.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "email already in use"));
        }

        // assign default role
        Set<String> roles = req.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = new HashSet<>();
            roles.add("ROLE_USER");
            req.setRoles(roles);
        }

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
            "nombre", userDetails.getNombre(), // <-- AÑADE ESTA LÍNEA
            "roles", roles
        ));

    }
}