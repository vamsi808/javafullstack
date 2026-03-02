import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
    const navigate = useNavigate();

    const getStatusBadge = (status) => {
        const sl = status.toLowerCase();
        return <span className={`badge badge-${sl}`}>{status}</span>;
    };

    const getPriorityClass = (priority) => {
        switch (priority.toLowerCase()) {
            case 'urgent': return 'priority-urgent-bg';
            case 'high': return 'priority-high-bg';
            case 'medium': return 'priority-medium-bg';
            default: return 'priority-low-bg';
        }
    };

    return (
        <div
            className={`ticket-card glass-panel ${getPriorityClass(ticket.priority)}`}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
        >
            <div className="card-header">
                <span className="ticket-id">#{ticket.id}</span>
                {getStatusBadge(ticket.status)}
            </div>

            <h3 className="card-title">{ticket.title}</h3>

            <p className="card-desc">
                {ticket.description.length > 80
                    ? ticket.description.substring(0, 80) + '...'
                    : ticket.description}
            </p>

            <div className="card-footer">
                <div className="footer-item">
                    <Clock size={14} />
                    <span>{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="footer-item">
                    <User size={14} />
                    <span>{ticket.contactId}</span>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
