package com.internverse.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class UserAccount {
  @Id
  private String id;
  private String email;
  private String passwordHash;
  private String role;
  private String name;
  private String avatar;

  public UserAccount() {}

  public UserAccount(String id, String email, String passwordHash, String role, String name, String avatar) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.name = name;
    this.avatar = avatar;
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getAvatar() { return avatar; }
  public void setAvatar(String avatar) { this.avatar = avatar; }
}