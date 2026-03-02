package com.freshdesk.clone.service;

import com.freshdesk.clone.model.Ticket;
import com.freshdesk.clone.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public List<Ticket> getTicketsByContact(String contactId) {
        return ticketRepository.findByContactId(contactId);
    }

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(String id, Ticket ticketDetails) {
        return ticketRepository.findById(id).map(ticket -> {
            ticket.setTitle(ticketDetails.getTitle());
            ticket.setDescription(ticketDetails.getDescription());
            ticket.setStatus(ticketDetails.getStatus());
            ticket.setPriority(ticketDetails.getPriority());
            ticket.setContactId(ticketDetails.getContactId());
            return ticketRepository.save(ticket);
        }).orElseThrow(() -> new RuntimeException("Ticket not found with id " + id));
    }

    public void deleteTicket(String id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found with id " + id);
        }
        ticketRepository.deleteById(id);
    }
}
