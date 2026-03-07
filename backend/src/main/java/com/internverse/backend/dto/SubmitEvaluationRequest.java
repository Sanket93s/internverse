package com.internverse.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record SubmitEvaluationRequest(@NotBlank String evaluationId, @Min(1) @Max(10) int rating, String feedback) {}