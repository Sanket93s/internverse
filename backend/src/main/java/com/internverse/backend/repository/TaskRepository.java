package com.internverse.backend.repository;

import com.internverse.backend.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
  List<Task> findByAssignedTo(String assignedTo);
  List<Task> findByStatusIn(List<String> statuses);
}