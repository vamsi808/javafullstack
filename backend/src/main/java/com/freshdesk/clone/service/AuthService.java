package com.freshdesk.clone.service;

import com.freshdesk.clone.model.Role;
import com.freshdesk.clone.model.User;
import com.freshdesk.clone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> login(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        var jwtToken = jwtService.generateToken(user);
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("role", user.getRole());
        response.put("name", user.getName());
        response.put("isPasswordSet", user.isPasswordSet());
        return response;
    }

    public void setPassword(String email, String newPassword) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordSet(true);
        userRepository.save(user);
    }

    public void createCustomerUser(String email, String name) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .name(name)
                    .role(Role.CUSTOMER)
                    .isPasswordSet(false)
                    // Set a default random password or leave empty if your security allows
                    .password(passwordEncoder.encode("Temporary123!")) 
                    .build();
            userRepository.save(user);
        }
    }

    public void createAdminIfNotExist(String email, String password, String name) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .name(name)
                    .role(Role.ADMIN)
                    .isPasswordSet(true)
                    .password(passwordEncoder.encode(password))
                    .build();
            userRepository.save(user);
        }
    }
}
