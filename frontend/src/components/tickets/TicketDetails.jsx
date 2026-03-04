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
    const [isEditingAssignee, setIsEditingAssignee] = useState(false);
    const [newAssignee, setNewAssignee] = useState('');

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

    const handleAssign = async () => {
        try {
            const updated = await ticketService.update(id, { ...ticket, assignedToEmail: newAssignee });
            setTicket(updated);
            setIsEditingAssignee(false);
        } catch (error) {
            console.error('Failed to assign ticket:', error);
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
                            <span className="property-label"><User size={16} className="text-slate-500 inline mr-1" /> Customer</span>
                            <span className="property-value link-text" onClick={() => navigate(`/contacts/${ticket.contactId}`)}>
                                {ticket.contactEmail || ticket.contactId}
                            </span>
                        </div>

                        <div className="property-item mt-4 pb-4 border-b border-slate-700/50">
                            <div className="flex justify-between items-center w-full">
                                <span className="property-label text-amber-500 font-bold"><User size={16} className="inline mr-1" /> Assigned To</span>
                                {!isEditingAssignee && (
                                    <button onClick={() => { setIsEditingAssignee(true); setNewAssignee(ticket.assignedToEmail || ''); }} className="text-xs text-primary hover:underline">
                                        Change
                                    </button>
                                )}
                            </div>

                            {isEditingAssignee ? (
                                <div className="mt-2 flex gap-2">
                                    <input
                                        type="email"
                                        value={newAssignee}
                                        onChange={(e) => setNewAssignee(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm outline-none focus:border-primary text-white"
                                        placeholder="agent@freshdesk.com"
                                    />
                                    <button onClick={handleAssign} className="bg-primary hover:bg-primary-hover text-white px-2 rounded text-xs">Save</button>
                                    <button onClick={() => setIsEditingAssignee(false)} className="text-slate-400 hover:text-white px-2 text-xs">Cancel</button>
                                </div>
                            ) : (
                                <span className="property-value font-medium mt-1 block px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-300">
                                    {ticket.assignedToEmail || 'Unassigned'}
                                </span>
                            )}
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
