package com.internverse.backend.repository;

import com.internverse.backend.model.Intern;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InternRepository extends MongoRepository<Intern, String> {
}