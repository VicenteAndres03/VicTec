package ViDev.Victec.security.jwt;

import java.util.Date;
// --- 1. IMPORTA ARRAYS ---
import java.util.Arrays; 

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import ViDev.Victec.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${victec.app.jwtSecret}")
  private String jwtSecret;

  @Value("${victec.app.jwtExpirationMs}")
  private int jwtExpirationMs;

  public String generateJwtToken(Authentication authentication) {

    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

    return Jwts.builder()
        .setSubject((userPrincipal.getUsername()))
        .setIssuedAt(new Date())
        .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
        .signWith(key(), SignatureAlgorithm.HS256)
        .compact();
  }
  
  // --- 2. MÉTODO key() CORREGIDO ---
  // (Esta es la lógica correcta que tenías en tu otro archivo JwtUtil.java)
  private Key key() {
    byte[] bytes = jwtSecret.getBytes();
    // Asegura que la clave tenga exactamente 32 bytes (256 bits) para HS256
    return Keys.hmacShaKeyFor(Arrays.copyOf(bytes, 32));
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parserBuilder().setSigningKey(key()).build()
               .parseClaimsJws(token).getBody().getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
      return true;
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    } catch (io.jsonwebtoken.security.SignatureException e) { // <-- Captura el error de firma
      logger.error("Invalid JWT signature: {}", e.getMessage());
    }

    return false;
  }
}