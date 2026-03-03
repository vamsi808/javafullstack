package com.freshdesk.clone.service;

import com.freshdesk.clone.model.Contact;
import com.freshdesk.clone.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final AuthService authService;

    @Autowired
    public ContactService(ContactRepository contactRepository, AuthService authService) {
        this.contactRepository = contactRepository;
        this.authService = authService;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Optional<Contact> getContactById(String id) {
        return contactRepository.findById(id);
    }

    public Contact createContact(Contact contact) {
        Contact savedContact = contactRepository.save(contact);
        authService.createCustomerUser(savedContact.getEmail(), savedContact.getName());
        return savedContact;
    }

    public Contact updateContact(String id, Contact contactDetails) {
        return contactRepository.findById(id).map(contact -> {
            contact.setName(contactDetails.getName());
            contact.setEmail(contactDetails.getEmail());
            contact.setPhone(contactDetails.getPhone());
            contact.setCompany(contactDetails.getCompany());
            return contactRepository.save(contact);
        }).orElseThrow(() -> new RuntimeException("Contact not found with id " + id));
    }

    public void deleteContact(String id) {
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found with id " + id);
        }
        contactRepository.deleteById(id);
    }
}
