package ViDev.Victec.security.services;

import ViDev.Victec.model.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {
  private static final long serialVersionUID = 1L;

  private Long id;

  private String username;

  private String email;

  private String nombre; // <-- CAMBIO 1: Campo añadido

  @JsonIgnore
  private String password;

  private Collection<? extends GrantedAuthority> authorities;

  // CAMBIO 2: Constructor actualizado
  public UserDetailsImpl(Long id, String username, String email, String nombre, String password,
      Collection<? extends GrantedAuthority> authorities) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.nombre = nombre; // <-- Asignación añadida
    this.password = password;
    this.authorities = authorities;
  }

  // CAMBIO 3: Método build actualizado
  public static UserDetailsImpl build(Usuario user) {
    List<GrantedAuthority> authorities = user.getRoles().stream()
        .map(SimpleGrantedAuthority::new)
        .collect(Collectors.toList());

    return new UserDetailsImpl(
        user.getId(),
        user.getEmail(), // Usamos email como el username para Spring Security
        user.getEmail(),
        user.getNombre(), // <-- Se pasa el nombre desde el Usuario
        user.getPassword(),
        authorities);
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  // CAMBIO 4: Getter añadido
  public String getNombre() {
    return nombre;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    UserDetailsImpl user = (UserDetailsImpl) o;
    return Objects.equals(id, user.id);
  }
}