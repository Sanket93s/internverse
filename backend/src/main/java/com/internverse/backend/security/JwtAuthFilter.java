package com.internverse.backend.security;

import com.internverse.backend.repository.UserAccountRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserAccountRepository users;

  public JwtAuthFilter(JwtService jwtService, UserAccountRepository users) {
    this.jwtService = jwtService;
    this.users = users;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String auth = request.getHeader("Authorization");
    if (auth == null || !auth.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = auth.substring(7);
    if (!jwtService.isValid(token)) {
      filterChain.doFilter(request, response);
      return;
    }

    String email = jwtService.extractEmail(token);
    users.findByEmail(email).ifPresent(user -> {
      var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()));
      var authToken = new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
      SecurityContextHolder.getContext().setAuthentication(authToken);
    });

    filterChain.doFilter(request, response);
  }
}