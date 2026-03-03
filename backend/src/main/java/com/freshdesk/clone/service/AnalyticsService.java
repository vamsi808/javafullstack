package com.freshdesk.clone.service;

import com.freshdesk.clone.repository.ContactRepository;
import com.freshdesk.clone.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TicketRepository ticketRepository;
    private final ContactRepository contactRepository;

    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalTickets", ticketRepository.count());
        stats.put("totalContacts", contactRepository.count());
        
        // Status breakdown
        stats.put("openTickets", ticketRepository.countByStatus("Open"));
        stats.put("pendingTickets", ticketRepository.countByStatus("Pending"));
        stats.put("resolvedTickets", ticketRepository.countByStatus("Resolved"));
        stats.put("closedTickets", ticketRepository.countByStatus("Closed"));
        
        // Priority breakdown
        Map<String, Long> priorityStats = new HashMap<>();
        priorityStats.put("High", ticketRepository.countByPriority("High"));
        priorityStats.put("Medium", ticketRepository.countByPriority("Medium"));
        priorityStats.put("Low", ticketRepository.countByPriority("Low"));
        stats.put("priorityStats", priorityStats);
        
        return stats;
    }
}
