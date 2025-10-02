package com.example.Backend.service;

import com.example.Backend.model.Leave;
import com.example.Backend.repository.LeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;

    @Autowired
    public LeaveServiceImpl(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    @Override
    public Leave applyLeave(Leave leave) {
        return leaveRepository.save(leave);
    }

    @Override
    public List<Leave> getUserLeaves(String userId) {
        return leaveRepository.findByUserIdOrderByAppliedOnDesc(userId);
    }

    @Override
    public Optional<Leave> getLeaveById(String id) {
        return leaveRepository.findById(id);
    }

    @Override
    public Leave updateLeaveStatus(String id, String status) {
        Optional<Leave> leaveOpt = leaveRepository.findById(id);
        if (leaveOpt.isPresent()) {
            Leave leave = leaveOpt.get();
            leave.setStatus(status);
            return leaveRepository.save(leave);
        }
        throw new IllegalArgumentException("Leave not found with id: " + id);
    }
}
