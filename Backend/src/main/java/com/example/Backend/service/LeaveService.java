package com.example.Backend.service;

import com.example.Backend.model.Leave;

import java.util.List;
import java.util.Optional;

public interface LeaveService {
    Leave applyLeave(Leave leave);
    List<Leave> getUserLeaves(String userId);
    Optional<Leave> getLeaveById(String id);
    Leave updateLeaveStatus(String id, String status);
}
