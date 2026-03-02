-- Create the database
CREATE DATABASE freshdeskdb;

-- Use the new database
USE freshdeskdb;

-- Creating the Contacts table
CREATE TABLE contacts (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating the Tickets table
CREATE TABLE tickets (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    contact_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
);

-- Insert Sample Contact
INSERT INTO contacts (id, name, email, phone, company) 
VALUES ('c-101', 'Admin Supervisor', 'admin@freshdesk.test', '555-0100', 'Admin Corp');

-- Insert Sample Ticket
INSERT INTO tickets (id, title, description, status, priority, contact_id)
VALUES ('t-201', 'Database Connection Error', 'Cannot connect to MySQL database.', 'Open', 'Urgent', 'c-101');
