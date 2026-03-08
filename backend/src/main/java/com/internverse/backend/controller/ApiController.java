package com.internverse.backend.controller;

import com.internverse.backend.dto.AddInternRequest;
import com.internverse.backend.dto.AssignTaskRequest;
import com.internverse.backend.dto.ForgotPasswordRequest;
import com.internverse.backend.dto.LoginRequest;
import com.internverse.backend.dto.SignupRequest;
import com.internverse.backend.dto.SubmitEvaluationRequest;
import com.internverse.backend.dto.SubmitTaskRequest;
import com.internverse.backend.service.AuthService;
import com.internverse.backend.service.InMemoryDataService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {
  private final InMemoryDataService data;
  private final AuthService authService;

  public ApiController(InMemoryDataService data, AuthService authService) {
    this.data = data;
    this.authService = authService;
  }

  @GetMapping({"", "/"})
  public Map<String, Object> apiRoot() {
    return Map.of(
      "service", "internverse-backend",
      "status", "ok",
      "health", "/api/health"
    );
  }

  @GetMapping("/health")
  public Map<String, Object> health() {
    return Map.of("ok", true, "service", "internverse-backend");
  }

  @PostMapping("/auth/login")
  public Map<String, Object> login(@Valid @RequestBody LoginRequest req) {
    return authService.login(req);
  }

  @PostMapping("/auth/signup")
  public Map<String, Object> signup(@Valid @RequestBody SignupRequest req) {
    return authService.signup(req);
  }

  @PostMapping("/auth/forgot-password")
  public Map<String, Object> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
    return authService.forgotPassword(req);
  }

  @GetMapping("/tasks")
  public Object fetchTasks(@RequestParam(required = false) String internId) {
    return data.tasks(internId);
  }

  @PostMapping("/tasks/submit")
  public Object submitTask(@Valid @RequestBody SubmitTaskRequest req) {
    return data.submitTask(req);
  }

  @PostMapping("/tasks/assign")
  public Object assignTask(@Valid @RequestBody AssignTaskRequest req) {
    return data.assignTask(req);
  }

  @GetMapping("/submissions")
  public Object submissions() {
    return data.submissions();
  }

  @GetMapping("/interns")
  public Object interns() {
    return data.interns();
  }

  @PostMapping("/interns")
  public Object addIntern(@Valid @RequestBody AddInternRequest req) {
    return data.addIntern(req);
  }

  @GetMapping("/evaluations")
  public Object evaluations() {
    return data.evaluations();
  }

  @PostMapping("/evaluations/submit")
  public Object submitEvaluation(@Valid @RequestBody SubmitEvaluationRequest req) {
    return data.submitEvaluation(req);
  }

  @GetMapping("/certificates/{internId}")
  public Object certificate(@PathVariable String internId) {
    return data.certificate(internId);
  }

  @GetMapping("/performance/{internId}")
  public Object performance(@PathVariable String internId) {
    return data.performance(internId);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, Object>> badRequest(IllegalArgumentException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", ex.getMessage()));
  }
}
