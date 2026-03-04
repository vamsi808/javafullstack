import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Mail, Phone, Building, Edit, Trash2 } from 'lucide-react';
import { contactService } from '../../services/contactService';
import Loader from '../common/Loader';
import useDebounce from '../../hooks/useDebounce';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await contactService.getAll();
            setContacts(data);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            // Fallback for UI testing if endpoint is unstable
            if (contacts.length === 0) setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await contactService.delete(id);
                setContacts(contacts.filter(c => c.id !== id));
            } catch (error) {
                console.error('Failed to delete contact:', error);
            }
        }
    };

    const filteredContacts = contacts.filter(contact =>
        (contact.name || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (contact.email || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (contact.company || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Contacts</h1>
                    <p className="text-slate-400 mt-1">Manage your customer database and profiles.</p>
                </div>
                <button className="btn-primary flex items-center justify-center gap-2" onClick={() => navigate('/contacts/new')}>
                    <Plus size={18} /> Add Contact
                </button>
            </div>

            <div className="glass-panel p-4 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search contacts by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                </div>
                <div className="text-sm font-medium text-slate-400 ml-auto">
                    {filteredContacts.length} Contact{filteredContacts.length !== 1 ? 's' : ''}
                </div>
            </div>

            {filteredContacts.length === 0 ? (
                <div className="glass-panel p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <UserIconPlaceholder />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No contacts found</h3>
                    <p className="text-slate-400 max-w-md mb-6">You haven't added any contacts yet, or none match your current search criteria.</p>
                    <button className="btn-secondary flex items-center gap-2" onClick={() => navigate('/contacts/new')}>
                        <Plus size={18} /> Add Your First Contact
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => navigate(`/contacts/${contact.id}`)}
                            className="glass-panel p-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 hover:border-slate-600 transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
                        >
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>

                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl font-bold text-white shadow-lg border border-slate-600/50 group-hover:border-primary transition-colors">
                                        {(contact.name || contact.email || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{contact.name || 'Unnamed Contact'}</h3>
                                        {contact.title && <p className="text-xs text-slate-400">{contact.title}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/contacts/edit/${contact.id}`); }}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                                        onClick={(e) => handleDelete(contact.id, e)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto relative z-10 pt-4 border-t border-slate-700/50">
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-6 flex justify-center text-slate-500"><Mail size={16} /></div>
                                    <span className="truncate">{contact.email}</span>
                                </div>
                                {contact.phone && (
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-6 flex justify-center text-slate-500"><Phone size={16} /></div>
                                        <span>{contact.phone}</span>
                                    </div>
                                )}
                                {contact.company && (
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-6 flex justify-center text-slate-500"><Building size={16} /></div>
                                        <span className="truncate">{contact.company}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const UserIconPlaceholder = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export default ContactList;
