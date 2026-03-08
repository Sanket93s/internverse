package com.internverse.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SignupRequest(
  @NotBlank String name,
  @NotBlank @Email String email,
  @NotBlank String password,
  @NotBlank String role
) {}
