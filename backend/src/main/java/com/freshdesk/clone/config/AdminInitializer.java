package com.freshdesk.clone.config;

import com.freshdesk.clone.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AuthService authService;

    @Override
    public void run(String... args) throws Exception {
        // Create a default admin account
        authService.createAdminIfNotExist("admin@freshdesk.com", "Admin@123", "Super Admin");
    }
}
