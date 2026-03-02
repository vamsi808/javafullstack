import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import './TicketTable.css';

const TicketTable = ({ tickets }) => {
    const navigate = useNavigate();

    const getStatusBadge = (status) => {
        const sl = status.toLowerCase();
        return <span className={`badge badge-${sl}`}>{status}</span>;
    };

    const getPriorityClass = (priority) => {
        switch (priority.toLowerCase()) {
            case 'urgent': return 'priority-urgent';
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            default: return 'priority-low';
        }
    };

    return (
        <table className="ticket-table">
            <thead>
                <tr>
                    <th>Ticket</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                    <th>Contact</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => (
                    <tr
                        key={ticket.id}
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="table-row-clickable"
                    >
                        <td>
                            <div className="ticket-info">
                                <span className="ticket-id">#{ticket.id}</span>
                                <span className="ticket-title">{ticket.title}</span>
                            </div>
                        </td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>
                            <span className={`priority-indicator ${getPriorityClass(ticket.priority)}`}></span>
                            {ticket.priority}
                        </td>
                        <td>{formatDate(ticket.createdAt)}</td>
                        <td>{ticket.contactId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TicketTable;
