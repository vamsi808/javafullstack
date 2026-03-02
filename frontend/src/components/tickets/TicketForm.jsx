import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { ticketService } from '../../services/ticketService';
import { contactService } from '../../services/contactService';
import { ticketStatuses, ticketPriorities } from '../../utils/constants';
import Loader from '../common/Loader';
import './TicketForm.css';

const TicketForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [contacts, setContacts] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: ticketStatuses.OPEN,
        priority: ticketPriorities.LOW,
        contactId: ''
    });

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [id]);

    const fetchData = async () => {
        try {
            const contactsData = await contactService.getAll();
            setContacts(contactsData);

            if (isEditMode) {
                const ticketData = await ticketService.getById(id);
                setFormData({
                    title: ticketData.title,
                    description: ticketData.description,
                    status: ticketData.status,
                    priority: ticketData.priority,
                    contactId: ticketData.contactId
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditMode) {
                await ticketService.update(id, formData);
                navigate(`/tickets/${id}`);
            } else {
                const newTicket = await ticketService.create(formData);
                navigate(`/tickets/${newTicket.id}`);
            }
        } catch (error) {
            console.error('Failed to save ticket:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="ticket-form-page">
            <div className="page-header">
                <div className="header-left">
                    <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="page-title">{isEditMode ? 'Edit Ticket' : 'Create New Ticket'}</h1>
                </div>
            </div>

            <div className="form-container glass-panel">
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label">Ticket Title <span className="required">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter a brief, descriptive title"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label className="form-label">Contact <span className="required">*</span></label>
                            <select
                                name="contactId"
                                value={formData.contactId}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="" disabled>Select a contact...</option>
                                {contacts.map(contact => (
                                    <option key={contact.id} value={contact.id}>
                                        {contact.name} ({contact.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group flex-1">
                            <label className="form-label">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {Object.values(ticketPriorities).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group flex-1">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {Object.values(ticketStatuses).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description <span className="required">*</span></label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field textarea-field"
                            placeholder="Provide a detailed description of the issue..."
                            required
                            rows={8}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
