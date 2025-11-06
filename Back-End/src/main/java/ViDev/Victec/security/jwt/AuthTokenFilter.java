package ViDev.Victec.security.jwt;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import ViDev.Victec.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthTokenFilter extends OncePerRequestFilter {
  @Autowired
  private JwtUtils jwtUtils;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String path = request.getServletPath();
    
    // Log para debugging
    if (path.contains("/payment")) {
      logger.info("Procesando petición a: {}", path);
      String authHeader = request.getHeader("Authorization");
      logger.info("Authorization header presente: {}", authHeader != null);
      if (authHeader != null) {
        logger.info("Authorization header: {}", authHeader.substring(0, Math.min(20, authHeader.length())) + "...");
      }
    }
    
    try {
      String jwt = parseJwt(request);
      if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
        String username = jwtUtils.getUserNameFromJwtToken(jwt);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.debug("Usuario autenticado exitosamente: {}", username);
        
        if (path.contains("/payment")) {
          logger.info("Autenticación configurada para usuario: {}", username);
        }
      } else {
        if (jwt != null) {
          logger.warn("Token JWT inválido o expirado en ruta: {}", path);
          if (path.contains("/payment")) {
            logger.error("Token inválido para petición de payment");
          }
        } else {
          logger.debug("No se encontró token JWT en ruta: {}", path);
          if (path.contains("/payment")) {
            logger.error("No se encontró token para petición de payment");
          }
        }
      }
    } catch (Exception e) {
      logger.error("Cannot set user authentication: {}", e.getMessage());
      if (path.contains("/payment")) {
        logger.error("Error específico en payment: ", e);
      }
      // No hacer nada, simplemente continuar sin autenticación
      // Esto permite que las rutas públicas funcionen sin token
    }

    filterChain.doFilter(request, response);
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    String method = request.getMethod();
    // No aplicar el filtro a rutas públicas
    return path.startsWith("/api/v1/auth/") || 
           (path.startsWith("/api/v1/productos") && "GET".equalsIgnoreCase(method)) ||
           path.startsWith("/api/v1/soporte/");
  }

  private String parseJwt(HttpServletRequest request) {
    String headerAuth = request.getHeader("Authorization");

    if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
      return headerAuth.substring(7, headerAuth.length());
    }

    return null;
  }
}
