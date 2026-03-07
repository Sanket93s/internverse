package com.internverse.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AddInternRequest(
  @NotBlank String name,
  @NotBlank String email,
  @NotBlank String domain,
  @NotBlank String status,
  @NotBlank String startDate,
  @NotBlank String endDate
) {}