import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { contactService } from '../../services/contactService';
import Loader from '../common/Loader';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import ContactTable from './ContactTable';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import './ContactList.css';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { currentPage, itemsPerPage, paginate, setPage, resetPage } = usePagination(1, 10);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await contactService.getAll();
            setContacts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const paginatedContacts = paginate(filteredContacts);
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

    useEffect(() => {
        resetPage();
        // eslint-disable-next-line
    }, [debouncedSearchTerm]);

    if (loading) return <Loader />;

    return (
        <div className="contact-list-container">
            <div className="page-header">
                <h1 className="page-title">Contacts</h1>
                <button className="btn btn-primary" onClick={() => navigate('/contacts/new')}>
                    <Plus size={18} /> New Contact
                </button>
            </div>

            <div className="list-controls glass-panel">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={() => setSearchTerm('')}
                    placeholder="Search by Name, Email, or Company..."
                />
            </div>

            <div className="contact-content-area glass-panel">
                {filteredContacts.length === 0 ? (
                    <div className="empty-state">
                        <p>No contacts found matching your search.</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <ContactTable contacts={paginatedContacts} />
                    </div>
                )}
            </div>

            {filteredContacts.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default ContactList;
