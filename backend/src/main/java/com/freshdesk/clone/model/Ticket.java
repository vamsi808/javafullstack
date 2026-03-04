package com.freshdesk.clone.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "contact_id")
    private String contactId;

    @NotBlank(message = "Contact email is mandatory")
    private String contactEmail;

    private String assignedToEmail; // The admin or specific agent handling the ticket

    @NotBlank(message = "Title is mandatory")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status;
    private String priority;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
