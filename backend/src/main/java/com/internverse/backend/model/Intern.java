package com.internverse.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "interns")
public class Intern {
  @Id
  private String id;
  private String name;
  private String email;
  private String domain;
  private String status;
  private String startDate;
  private String endDate;
  private int score;

  public Intern() {}

  public Intern(String id, String name, String email, String domain, String status, String startDate, String endDate, int score) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.domain = domain;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.score = score;
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getDomain() { return domain; }
  public void setDomain(String domain) { this.domain = domain; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getStartDate() { return startDate; }
  public void setStartDate(String startDate) { this.startDate = startDate; }
  public String getEndDate() { return endDate; }
  public void setEndDate(String endDate) { this.endDate = endDate; }
  public int getScore() { return score; }
  public void setScore(int score) { this.score = score; }
}