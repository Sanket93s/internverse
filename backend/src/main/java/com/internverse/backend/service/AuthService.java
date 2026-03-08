package com.internverse.backend.service;

import com.internverse.backend.dto.ForgotPasswordRequest;
import com.internverse.backend.dto.LoginRequest;
import com.internverse.backend.dto.SignupRequest;
import com.internverse.backend.model.UserAccount;
import com.internverse.backend.repository.UserAccountRepository;
import com.internverse.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;

@Service
public class AuthService {
  private final UserAccountRepository users;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserAccountRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public Map<String, Object> login(LoginRequest req) {
    UserAccount user = users.findByEmail(req.email().toLowerCase(Locale.ROOT))
      .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
      throw new IllegalArgumentException("Invalid email or password");
    }

    if (req.role() != null && !req.role().isBlank() && !user.getRole().equalsIgnoreCase(req.role())) {
      throw new IllegalArgumentException("Role does not match this account");
    }

    return authPayload(user);
  }

  public Map<String, Object> signup(SignupRequest req) {
    String email = req.email().trim().toLowerCase(Locale.ROOT);
    String role = req.role().trim().toLowerCase(Locale.ROOT);

    if (!role.equals("intern") && !role.equals("admin") && !role.equals("hr")) {
      throw new IllegalArgumentException("Invalid role");
    }

    if (req.password().length() < 6) {
      throw new IllegalArgumentException("Password must be at least 6 characters");
    }

    if (users.findByEmail(email).isPresent()) {
      throw new IllegalArgumentException("Email already registered");
    }

    String id = role + "-" + System.currentTimeMillis();
    String name = req.name().trim();
    String avatar = initials(name);

    UserAccount user = new UserAccount(
      id,
      email,
      passwordEncoder.encode(req.password()),
      role,
      name,
      avatar
    );

    users.save(user);
    return authPayload(user);
  }

  public Map<String, Object> forgotPassword(ForgotPasswordRequest req) {
    String email = req.email().trim().toLowerCase(Locale.ROOT);
    String role = req.role().trim().toLowerCase(Locale.ROOT);

    if (!role.equals("intern") && !role.equals("admin") && !role.equals("hr")) {
      throw new IllegalArgumentException("Invalid role");
    }

    if (req.newPassword().length() < 6) {
      throw new IllegalArgumentException("New password must be at least 6 characters");
    }

    UserAccount user = users.findByEmail(email)
      .orElseThrow(() -> new IllegalArgumentException("Account not found for this email"));

    if (!user.getRole().equalsIgnoreCase(role)) {
      throw new IllegalArgumentException("Role does not match this account");
    }

    user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
    users.save(user);

    return Map.of("success", true, "message", "Password updated. You can now sign in.");
  }

  private Map<String, Object> authPayload(UserAccount user) {
    String token = jwtService.generateToken(user);
    return Map.of(
      "success", true,
      "token", token,
      "user", Map.of(
        "id", user.getId(),
        "name", user.getName(),
        "email", user.getEmail(),
        "role", user.getRole(),
        "avatar", user.getAvatar()
      )
    );
  }

  private String initials(String name) {
    String[] parts = name.trim().split("\\s+");
    if (parts.length == 0) return "IV";
    if (parts.length == 1) {
      String p = parts[0];
      return p.length() >= 2 ? p.substring(0, 2).toUpperCase(Locale.ROOT) : p.toUpperCase(Locale.ROOT);
    }
    return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase(Locale.ROOT);
  }
}
