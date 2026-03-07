package com.internverse.backend.service;

import com.internverse.backend.dto.AddInternRequest;
import com.internverse.backend.dto.AssignTaskRequest;
import com.internverse.backend.dto.SubmitEvaluationRequest;
import com.internverse.backend.dto.SubmitTaskRequest;
import com.internverse.backend.model.Evaluation;
import com.internverse.backend.model.Intern;
import com.internverse.backend.model.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class InMemoryDataService {
  private final List<Task> tasks = new ArrayList<>();
  private final List<Intern> interns = new ArrayList<>();
  private final List<Evaluation> evaluations = new ArrayList<>();
  private final AtomicLong taskSeq = new AtomicLong(100);
  private final AtomicLong internSeq = new AtomicLong(100);

  public InMemoryDataService() {
    seed();
  }

  private void seed() {
    tasks.add(new Task("t1", "Build REST API Documentation", "Write comprehensive API docs for the user module using Swagger.", "2025-07-20", "Pending", "intern-1", "", ""));
    tasks.add(new Task("t2", "UI Component Library", "Create a reusable component library using React and Storybook.", "2025-07-25", "Submitted", "intern-1", "https://github.com/alex/ui-lib", "All components done"));
    tasks.add(new Task("t3", "Database Schema Design", "Design ER diagram and schema for the analytics module.", "2025-07-30", "Evaluated", "intern-1", "https://drive.google.com/file/xyz", ""));
    tasks.add(new Task("t4", "Mobile Responsive Testing", "Test all pages for mobile responsiveness and fix issues.", "2025-08-05", "Pending", "intern-2", "", ""));
    tasks.add(new Task("t5", "Authentication Module", "Implement JWT authentication with refresh tokens.", "2025-08-10", "Submitted", "intern-2", "https://github.com/nina/auth-module", "Using passport.js"));

    interns.add(new Intern("intern-1", "Alex Johnson", "alex@internverse.com", "Frontend Development", "Active", "2025-06-01", "2025-08-31", 87));
    interns.add(new Intern("intern-2", "Nina Patel", "nina@internverse.com", "Backend Development", "Active", "2025-06-01", "2025-08-31", 92));
    interns.add(new Intern("intern-3", "Carlos Rivera", "carlos@internverse.com", "Data Science", "Completed", "2025-03-01", "2025-05-31", 95));
    interns.add(new Intern("intern-4", "Priya Singh", "priya@internverse.com", "UI/UX Design", "Active", "2025-06-15", "2025-09-15", 78));
    interns.add(new Intern("intern-5", "Leo Zhang", "leo@internverse.com", "DevOps", "Inactive", "2025-05-01", "2025-07-31", 65));

    evaluations.add(new Evaluation("e1", "intern-1", "Alex Johnson", "t2", "UI Component Library", "https://github.com/alex/ui-lib", 9, "Excellent work! Clean code and well-documented components.", "2025-07-18"));
    evaluations.add(new Evaluation("e2", "intern-1", "Alex Johnson", "t3", "Database Schema Design", "https://drive.google.com/file/xyz", 8, "Good schema design, could improve normalization.", "2025-07-28"));
    evaluations.add(new Evaluation("e3", "intern-2", "Nina Patel", "t5", "Authentication Module", "https://github.com/nina/auth-module", null, "", ""));
  }

  public synchronized List<Task> tasks(String internId) {
    if (internId == null || internId.isBlank()) return new ArrayList<>(tasks);
    return tasks.stream().filter(t -> internId.equals(t.getAssignedTo())).toList();
  }

  public synchronized Map<String, Object> submitTask(SubmitTaskRequest req) {
    Task task = tasks.stream().filter(t -> req.taskId().equals(t.getId())).findFirst().orElseThrow(() -> new IllegalArgumentException("Task not found"));
    task.setSubmissionLink(req.submissionLink());
    task.setComments(req.comments() == null ? "" : req.comments());
    task.setStatus("Submitted");
    return Map.of("success", true);
  }

  public synchronized List<Intern> interns() {
    return new ArrayList<>(interns);
  }

  public synchronized Intern addIntern(AddInternRequest req) {
    String id = "intern-" + internSeq.incrementAndGet();
    Intern intern = new Intern(id, req.name(), req.email(), req.domain(), req.status(), req.startDate(), req.endDate(), 0);
    interns.add(intern);
    return intern;
  }

  public synchronized Map<String, Object> assignTask(AssignTaskRequest req) {
    String id = "t" + taskSeq.incrementAndGet();
    tasks.add(new Task(id, req.title(), req.description(), req.deadline(), "Pending", req.internId(), "", ""));
    return Map.of("success", true, "id", id);
  }

  public synchronized List<Task> submissions() {
    return tasks.stream().filter(t -> "Submitted".equals(t.getStatus()) || "Evaluated".equals(t.getStatus())).toList();
  }

  public synchronized List<Evaluation> evaluations() {
    return new ArrayList<>(evaluations);
  }

  public synchronized Map<String, Object> submitEvaluation(SubmitEvaluationRequest req) {
    Evaluation evaluation = evaluations.stream().filter(e -> req.evaluationId().equals(e.getId())).findFirst().orElseThrow(() -> new IllegalArgumentException("Evaluation not found"));
    evaluation.setRating(req.rating());
    evaluation.setFeedback(req.feedback() == null ? "" : req.feedback());
    evaluation.setDate(LocalDate.now().toString());

    tasks.stream()
      .filter(t -> t.getId().equals(evaluation.getTaskId()))
      .findFirst()
      .ifPresent(t -> t.setStatus("Evaluated"));

    return Map.of("success", true);
  }

  public Map<String, Object> certificate(String internId) {
    return Map.of("url", "http://localhost:8081/api/certificates/" + internId + ".pdf");
  }

  public synchronized Map<String, Object> performance(String internId) {
    Intern intern = interns.stream().filter(i -> i.getId().equals(internId)).findFirst().orElse(new Intern("", "", "", "", "", "", "", 0));
    List<Task> internTasks = tasks.stream().filter(t -> internId.equals(t.getAssignedTo())).toList();

    List<Map<String, Object>> ratings = evaluations.stream()
      .filter(e -> internId.equals(e.getInternId()) && e.getRating() != null)
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