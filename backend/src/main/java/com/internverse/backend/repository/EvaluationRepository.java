package com.internverse.backend.repository;

import com.internverse.backend.model.Evaluation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EvaluationRepository extends MongoRepository<Evaluation, String> {
  List<Evaluation> findByInternId(String internId);
}