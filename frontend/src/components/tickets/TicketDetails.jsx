import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Clock, User, AlertCircle } from 'lucide-react';
import { ticketService } from '../../services/ticketService';
import { formatDate } from '../../utils/helpers';
import Loader from '../common/Loader';
import ConfirmModal from '../common/ConfirmModal';
import './TicketDetails.css';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchTicket();
        // eslint-disable-next-line
    }, [id]);

    const fetchTicket = async () => {
        try {
            const data = await ticketService.getById(id);
            setTicket(data);
        } catch (error) {
            console.error('Failed to fetch ticket:', error);
            navigate('/tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await ticketService.delete(id);
            navigate('/tickets');
        } catch (error) {
            console.error('Failed to delete ticket:', error);
            setDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    if (loading) return <Loader />;
    if (!ticket) return null;

    return (
        <div className="ticket-details-page">
            <div className="page-header">
                <div className="header-left">
                    <button className="btn btn-secondary back-btn" onClick={() => navigate('/tickets')}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="title-wrapper">
                        <span className="ticket-id-large">#{ticket.id}</span>
                        <h1 className="page-title">{ticket.title}</h1>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate(`/tickets/edit/${ticket.id}`)}>
                        <Edit2 size={18} /> Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => setDeleteModalOpen(true)}>
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>

            <div className="details-grid">
                <div className="main-content-col">
                    <div className="description-card glass-panel">
                        <h3 className="section-title">Description</h3>
                        <div className="description-content">
                            {ticket.description.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>

                    {/* Discussion / Comments section placeholder */}
                    <div className="discussion-card glass-panel">
                        <h3 className="section-title">Discussion</h3>
                        <div className="empty-state">
                            <p>No comments yet. Be the first to reply.</p>
                        </div>
                    </div>
                </div>

                <div className="sidebar-col">
                    <div className="properties-card glass-panel">
                        <h3 className="section-title">Properties</h3>

                        <div className="property-item">
                            <span className="property-label">Status</span>
                            <span className={`badge badge-${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                        </div>

                        <div className="property-item">
                            <span className="property-label">Priority</span>
                            <div className="priority-value">
                                <span className={`priority-indicator priority-${ticket.priority.toLowerCase()}`}></span>
                                {ticket.priority}
                            </div>
                        </div>

                        <div className="property-item mt-4">
                            <span className="property-label"><User size={16} className="inline-icon" /> Contact</span>
                            <span className="property-value link-text" onClick={() => navigate(`/contacts/${ticket.contactId}`)}>
                                {ticket.contactId}
                            </span>
                        </div>

                        <div className="property-item">
                            <span className="property-label"><Clock size={16} className="inline-icon" /> Created</span>
                            <span className="property-value">{formatDate(ticket.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Ticket"
                message="Are you sure you want to delete this ticket? This action cannot be undone."
                confirmText={deleting ? "Deleting..." : "Delete"}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                isDestructive={true}
            />
        </div>
    );
};

export default TicketDetails;
