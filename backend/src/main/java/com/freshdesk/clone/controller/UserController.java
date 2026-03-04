package com.freshdesk.clone.controller;

import com.freshdesk.clone.model.User;
import com.freshdesk.clone.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveUser(@PathVariable String id) {
        userService.approveUser(id);
        return ResponseEntity.ok("User approved successfully");
    }
}
