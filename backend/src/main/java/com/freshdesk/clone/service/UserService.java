package com.freshdesk.clone.service;

import com.freshdesk.clone.model.User;
import com.freshdesk.clone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getPendingUsers() {
        // Fetch all users where isApproved is false
        return userRepository.findByIsApprovedFalse();
    }

    public void approveUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(true);
        userRepository.save(user);
    }
}
