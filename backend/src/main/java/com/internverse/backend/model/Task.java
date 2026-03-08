package com.internverse.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tasks")
public class Task {
  @Id
  private String id;
  private String title;
  private String description;
  private String deadline;
  private String status;
  private String assignedTo;
  private String submissionLink;
  private String comments;

  public Task() {}

  public Task(String id, String title, String description, String deadline, String status, String assignedTo, String submissionLink, String comments) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.status = status;
    this.assignedTo = assignedTo;
    this.submissionLink = submissionLink;
    this.comments = comments;
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public String getDeadline() { return deadline; }
  public void setDeadline(String deadline) { this.deadline = deadline; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getAssignedTo() { return assignedTo; }
  public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
  public String getSubmissionLink() { return submissionLink; }
  public void setSubmissionLink(String submissionLink) { this.submissionLink = submissionLink; }
  public String getComments() { return comments; }
  public void setComments(String comments) { this.comments = comments; }
}