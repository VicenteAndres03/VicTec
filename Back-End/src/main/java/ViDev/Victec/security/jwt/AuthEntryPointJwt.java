package ViDev.Victec.security.jwt;

import java.io.IOException;
// 1. Importa Map y ObjectMapper
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType; // 2. Importa MediaType
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

  private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) 
      throws IOException, ServletException {
        
    logger.error("Unauthorized error: {}", authException.getMessage());

    // 3. NO uses response.sendError()
    // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");

    // 4. En su lugar, crea una respuesta JSON
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    // 5. Crea el cuerpo del error
    final Map<String, Object> body = Map.of(
        "status", HttpServletResponse.SC_UNAUTHORIZED,
        "error", "No autorizado",
        "message", authException.getMessage(),
        "path", request.getServletPath()
    );

    // 6. Escribe el JSON en la respuesta
    final ObjectMapper mapper = new ObjectMapper();
    mapper.writeValue(response.getOutputStream(), body);
  }
}