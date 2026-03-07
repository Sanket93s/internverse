package com.internverse.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignTaskRequest(@NotBlank String title, @NotBlank String description, @NotBlank String deadline, @NotBlank String internId) {}