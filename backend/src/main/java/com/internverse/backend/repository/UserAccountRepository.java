package com.internverse.backend.repository;

import com.internverse.backend.model.UserAccount;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserAccountRepository extends MongoRepository<UserAccount, String> {
  Optional<UserAccount> findByEmail(String email);
}