package com.internverse.backend.service;

import com.internverse.backend.dto.AddInternRequest;
import com.internverse.backend.dto.AssignTaskRequest;
import com.internverse.backend.dto.SubmitEvaluationRequest;
import com.internverse.backend.dto.SubmitTaskRequest;
import com.internverse.backend.model.Evaluation;
import com.internverse.backend.model.Intern;
import com.internverse.backend.model.Task;
import com.internverse.backend.model.UserAccount;
import com.internverse.backend.repository.EvaluationRepository;
import com.internverse.backend.repository.InternRepository;
import com.internverse.backend.repository.TaskRepository;
import com.internverse.backend.repository.UserAccountRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class InMemoryDataService {
  private final TaskRepository taskRepository;
  private final InternRepository internRepository;
  private final EvaluationRepository evaluationRepository;
  private final UserAccountRepository userAccountRepository;
  private final PasswordEncoder passwordEncoder;

  public InMemoryDataService(
    TaskRepository taskRepository,
    InternRepository internRepository,
    EvaluationRepository evaluationRepository,
    UserAccountRepository userAccountRepository,
    PasswordEncoder passwordEncoder
  ) {
    this.taskRepository = taskRepository;
    this.internRepository = internRepository;
    this.evaluationRepository = evaluationRepository;
    this.userAccountRepository = userAccountRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @PostConstruct
  public void seedIfEmpty() {
    if (internRepository.count() == 0) {
      internRepository.saveAll(List.of(
        new Intern("intern-1", "Alex Johnson", "alex@internverse.com", "Frontend Development", "Active", "2025-06-01", "2025-08-31", 87),
        new Intern("intern-2", "Nina Patel", "nina@internverse.com", "Backend Development", "Active", "2025-06-01", "2025-08-31", 92),
        new Intern("intern-3", "Carlos Rivera", "carlos@internverse.com", "Data Science", "Completed", "2025-03-01", "2025-05-31", 95),
        new Intern("intern-4", "Priya Singh", "priya@internverse.com", "UI/UX Design", "Active", "2025-06-15", "2025-09-15", 78),
        new Intern("intern-5", "Leo Zhang", "leo@internverse.com", "DevOps", "Inactive", "2025-05-01", "2025-07-31", 65)
      ));
    }

    if (taskRepository.count() == 0) {
      taskRepository.saveAll(List.of(
        new Task("t1", "Build REST API Documentation", "Write comprehensive API docs for the user module using Swagger.", "2025-07-20", "Pending", "intern-1", "", ""),
        new Task("t2", "UI Component Library", "Create a reusable component library using React and Storybook.", "2025-07-25", "Submitted", "intern-1", "https://github.com/alex/ui-lib", "All components done"),
        new Task("t3", "Database Schema Design", "Design ER diagram and schema for the analytics module.", "2025-07-30", "Evaluated", "intern-1", "https://drive.google.com/file/xyz", ""),
        new Task("t4", "Mobile Responsive Testing", "Test all pages for mobile responsiveness and fix issues.", "2025-08-05", "Pending", "intern-2", "", ""),
        new Task("t5", "Authentication Module", "Implement JWT authentication with refresh tokens.", "2025-08-10", "Submitted", "intern-2", "https://github.com/nina/auth-module", "Using passport.js")
      ));
    }

    if (evaluationRepository.count() == 0) {
      evaluationRepository.saveAll(List.of(
        new Evaluation("e1", "intern-1", "Alex Johnson", "t2", "UI Component Library", "https://github.com/alex/ui-lib", 9, "Excellent work! Clean code and well-documented components.", "2025-07-18"),
        new Evaluation("e2", "intern-1", "Alex Johnson", "t3", "Database Schema Design", "https://drive.google.com/file/xyz", 8, "Good schema design, could improve normalization.", "2025-07-28"),
        new Evaluation("e3", "intern-2", "Nina Patel", "t5", "Authentication Module", "https://github.com/nina/auth-module", null, "", "")
      ));
    }

    if (userAccountRepository.count() == 0) {
      userAccountRepository.saveAll(List.of(
        new UserAccount("intern-1", "intern@internverse.com", passwordEncoder.encode("password123"), "intern", "Alex Johnson", "AJ"),
        new UserAccount("admin-1", "admin@internverse.com", passwordEncoder.encode("password123"), "admin", "Sarah Mitchell", "SM"),
        new UserAccount("hr-1", "hr@internverse.com", passwordEncoder.encode("password123"), "hr", "James Carter", "JC")
      ));
    }
  }

  public List<Task> tasks(String internId) {
    if (internId == null || internId.isBlank()) return taskRepository.findAll();
    return taskRepository.findByAssignedTo(internId);
  }

  public Map<String, Object> submitTask(SubmitTaskRequest req) {
    Task task = taskRepository.findById(req.taskId()).orElseThrow(() -> new IllegalArgumentException("Task not found"));
    task.setSubmissionLink(req.submissionLink());
    task.setComments(req.comments() == null ? "" : req.comments());
    task.setStatus("Submitted");
    taskRepository.save(task);
    return Map.of("success", true);
  }

  public List<Intern> interns() {
    return internRepository.findAll();
  }

  public Intern addIntern(AddInternRequest req) {
    String id = "intern-" + System.currentTimeMillis();
    Intern intern = new Intern(id, req.name(), req.email(), req.domain(), req.status(), req.startDate(), req.endDate(), 0);
    return internRepository.save(intern);
  }

  public Map<String, Object> assignTask(AssignTaskRequest req) {
    String id = "t" + System.currentTimeMillis();
    taskRepository.save(new Task(id, req.title(), req.description(), req.deadline(), "Pending", req.internId(), "", ""));
    return Map.of("success", true, "id", id);
  }

  public List<Task> submissions() {
    return taskRepository.findByStatusIn(List.of("Submitted", "Evaluated"));
  }

  public List<Evaluation> evaluations() {
    return evaluationRepository.findAll();
  }

  public Map<String, Object> submitEvaluation(SubmitEvaluationRequest req) {
    Evaluation evaluation = evaluationRepository.findById(req.evaluationId()).orElseThrow(() -> new IllegalArgumentException("Evaluation not found"));
    evaluation.setRating(req.rating());
    evaluation.setFeedback(req.feedback() == null ? "" : req.feedback());
    evaluation.setDate(LocalDate.now().toString());
    evaluationRepository.save(evaluation);

    taskRepository.findById(evaluation.getTaskId()).ifPresent(task -> {
      task.setStatus("Evaluated");
      taskRepository.save(task);
    });

    return Map.of("success", true);
  }

  public Map<String, Object> certificate(String internId) {
    return Map.of("url", "http://localhost:8081/api/certificates/" + internId + ".pdf");
  }

  public Map<String, Object> performance(String internId) {
    Intern intern = internRepository.findById(internId).orElse(new Intern("", "", "", "", "", "", "", 0));
    List<Task> internTasks = taskRepository.findByAssignedTo(internId);
    List<Evaluation> internEvals = evaluationRepository.findByInternId(internId);

    List<Map<String, Object>> ratings = internEvals.stream()
      .filter(e -> e.getRating() != null)
      .map(e -> {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("task", e.getTaskTitle());
        row.put("rating", e.getRating());
        row.put("feedback", e.getFeedback() == null ? "" : e.getFeedback());
        return row;
      })
      .toList();

    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("score", intern.getScore());
    payload.put("totalTasks", internTasks.size());
    payload.put("completed", internTasks.stream().filter(t -> "Evaluated".equals(t.getStatus())).count());
    payload.put("submitted", internTasks.stream().filter(t -> "Submitted".equals(t.getStatus())).count());
    payload.put("pending", internTasks.stream().filter(t -> "Pending".equals(t.getStatus())).count());
    payload.put("ratings", ratings);
    return payload;
  }
}