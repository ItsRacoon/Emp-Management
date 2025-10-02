package com.example.Backend.repository;

import com.example.Backend.model.Leave;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LeaveRepository extends MongoRepository<Leave, String> {
    List<Leave> findByUserId(String userId);
    List<Leave> findByUserIdOrderByAppliedOnDesc(String userId);
}