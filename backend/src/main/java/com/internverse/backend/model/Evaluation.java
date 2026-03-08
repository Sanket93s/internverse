package com.internverse.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "evaluations")
public class Evaluation {
  @Id
  private String id;
  private String internId;
  private String internName;
  private String taskId;
  private String taskTitle;
  private String submissionLink;
  private Integer rating;
  private String feedback;
  private String date;

  public Evaluation() {}

  public Evaluation(String id, String internId, String internName, String taskId, String taskTitle, String submissionLink, Integer rating, String feedback, String date) {
    this.id = id;
    this.internId = internId;
    this.internName = internName;
    this.taskId = taskId;
    this.taskTitle = taskTitle;
    this.submissionLink = submissionLink;
    this.rating = rating;
    this.feedback = feedback;
    this.date = date;
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getInternId() { return internId; }
  public void setInternId(String internId) { this.internId = internId; }
  public String getInternName() { return internName; }
  public void setInternName(String internName) { this.internName = internName; }
  public String getTaskId() { return taskId; }
  public void setTaskId(String taskId) { this.taskId = taskId; }
  public String getTaskTitle() { return taskTitle; }
  public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }
  public String getSubmissionLink() { return submissionLink; }
  public void setSubmissionLink(String submissionLink) { this.submissionLink = submissionLink; }
  public Integer getRating() { return rating; }
  public void setRating(Integer rating) { this.rating = rating; }
  public String getFeedback() { return feedback; }
  public void setFeedback(String feedback) { this.feedback = feedback; }
  public String getDate() { return date; }
  public void setDate(String date) { this.date = date; }
}