package com.internverse.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record SubmitTaskRequest(@NotBlank String taskId, @NotBlank String submissionLink, String comments) {}