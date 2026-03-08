package com.internverse.backend.security;

import com.internverse.backend.model.UserAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
  @Value("${app.jwt.secret}")
  private String jwtSecret;

  @Value("${app.jwt.expiration-ms:86400000}")
  private long expirationMs;

  private SecretKey key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  public String generateToken(UserAccount user) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
      .setSubject(user.getEmail())
      .claim("role", user.getRole())
      .setIssuedAt(new Date(now))
      .setExpiration(new Date(now + expirationMs))
      .signWith(key(), SignatureAlgorithm.HS256)
      .compact();
  }

  public String extractEmail(String token) {
    return claims(token).getSubject();
  }

  public boolean isValid(String token) {
    try {
      claims(token);
      return true;
    } catch (Exception ex) {
      return false;
    }
  }

  private Claims claims(String token) {
    return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody();
  }
}