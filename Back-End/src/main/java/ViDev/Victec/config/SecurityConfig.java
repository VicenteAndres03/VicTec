package ViDev.Victec.config;

import ViDev.Victec.security.jwt.AuthEntryPointJwt;
import ViDev.Victec.security.jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // --- AQUÍ ESTÁ EL CAMBIO ---
        // Autorizamos a tu PC local Y a tu nueva web en Netlify
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",           // Pruebas en tu PC
            "https://victec.netlify.app"       // <--- TU NUEVA TIENDA EN VIVO
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, UserDetailsService userDetailsService) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                
                // Rutas de Autenticación (Públicas)
                .requestMatchers("/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/google-login").permitAll()
                .requestMatchers("/api/v1/auth/**").authenticated()
                
                // Rutas de Productos (Ver es público, editar es admin)
                .requestMatchers(HttpMethod.GET, "/api/v1/productos", "/api/v1/productos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/productos", "/api/v1/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/productos", "/api/v1/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/productos", "/api/v1/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/v1/productos", "/api/v1/productos/**").hasRole("ADMIN")

                // Comentarios (Requiere login)
                .requestMatchers(HttpMethod.POST, "/api/v1/productos/{productoId}/comentarios").authenticated()
                
                // Rutas Públicas Generales (Webhooks y Soporte)
                .requestMatchers("/api/v1/soporte/**").permitAll()
                .requestMatchers("/api/v1/webhooks/**").permitAll() 
                .requestMatchers("/compra-exitosa", "/pago-fallido", "/pago-pendiente").permitAll()
                .requestMatchers("/error").permitAll() 
                
                // Rutas de Admin (Panel)
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                // Rutas de Usuario (Carrito, Pedidos, Perfil)
                .requestMatchers("/api/v1/carrito/**").authenticated()
                .requestMatchers("/api/v1/direcciones/**").authenticated()
                .requestMatchers("/api/v1/pedidos/**").authenticated()
                .requestMatchers("/api/v1/payment/**").authenticated()
                
                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider(userDetailsService))
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler));
        
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}