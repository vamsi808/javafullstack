import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, Briefcase, Calendar, Ticket } from 'lucide-react';
import { contactService } from '../../services/contactService';
import { ticketService } from '../../services/ticketService';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/helpers';
import TicketCard from './../tickets/TicketCard';

const ContactDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContactData();
    }, [id]);

    const fetchContactData = async () => {
        try {
            setLoading(true);
            const [contactData, ticketsData] = await Promise.all([
                contactService.getById(id),
                ticketService.getAll() // Ideally fetch tickets BY contact ID, but filtering locally for now
            ]);
            setContact(contactData);
            setTickets(ticketsData.filter(t => t.contactId === id || t.contactEmail === contactData.email));
        } catch (err) {
            setError('Failed to load contact details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
            try {
                await contactService.delete(id);
                navigate('/contacts');
            } catch (err) {
                console.error('Failed to delete contact', err);
                alert('Failed to delete contact.');
            }
        }
    };

    if (loading) return <Loader />;
    if (error || !contact) return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
            <h2 className="text-2xl font-bold text-white mb-2">Contact Not Found</h2>
            <p className="text-slate-400 mb-6">{error || "The contact you're looking for doesn't exist or has been removed."}</p>
            <button className="btn-primary" onClick={() => navigate('/contacts')}>
                Return to Contacts
            </button>
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/contacts')}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-lg shadow-lg">
                                {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            {contact.name || 'Unnamed Contact'}
                        </h1>
                        <p className="text-slate-400 mt-1 pl-14">Customer Profile</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 pl-14 sm:pl-0">
                    <button
                        onClick={() => navigate(`/contacts/edit/${id}`)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Edit size={16} /> Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn-danger flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Info Cards */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Main Details Card */}
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-bold text-white border-b border-slate-700/50 pb-3 mb-4">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="text-primary mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Email Address</p>
                                    <a href={`mailto:${contact.email}`} className="text-slate-200 hover:text-primary transition-colors inline-block break-all">{contact.email || 'N/A'}</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="text-secondary mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                                    <span className="text-slate-200">{contact.phone || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="text-emerald-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Customer Since</p>
                                    <span className="text-slate-200">{contact.createdAt ? formatDate(contact.createdAt) : 'Unknown'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Work Details Card */}
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-bold text-white border-b border-slate-700/50 pb-3 mb-4">Professional Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Building className="text-amber-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Company</p>
                                    <span className="text-slate-200">{contact.company || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Briefcase className="text-rose-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Job Title</p>
                                    <span className="text-slate-200">{contact.title || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Associated Tickets */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Ticket size={20} className="text-slate-400" />
                                Associated Tickets
                                <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full border border-slate-700">{tickets.length}</span>
                            </h3>
                            <button
                                onClick={() => navigate('/tickets/new')}
                                className="text-sm text-primary hover:text-white transition-colors"
                            >
                                + New Ticket for {contact.name?.split(' ')[0] || 'Contact'}
                            </button>
                        </div>

                        {tickets.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <Ticket size={28} className="text-slate-500" />
                                </div>
                                <h4 className="text-lg font-medium text-white mb-2">No tickets history</h4>
                                <p className="text-slate-400">This contact hasn't submitted any support tickets yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {tickets.map(ticket => (
                                    <TicketCard key={ticket.id} ticket={ticket} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactDetails;
