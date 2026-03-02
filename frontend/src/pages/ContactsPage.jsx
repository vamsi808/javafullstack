import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ContactList from '../components/contacts/ContactList';
import ContactForm from '../components/contacts/ContactForm';
import ContactDetails from '../components/contacts/ContactDetails';

const ContactsPage = () => {
    return (
        <div className="contacts-page">
            <Routes>
                <Route path="/" element={<ContactList />} />
                <Route path="/new" element={<ContactForm />} />
                <Route path="/edit/:id" element={<ContactForm />} />
                <Route path="/:id" element={<ContactDetails />} />
            </Routes>
        </div>
    );
};

export default ContactsPage;
