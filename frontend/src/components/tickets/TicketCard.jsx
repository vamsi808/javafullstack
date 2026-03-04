import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const TicketCard = ({ ticket, onSolve }) => {
    const navigate = useNavigate();

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'open': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'closed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getPriorityBorder = (priority) => {
        switch (priority.toLowerCase()) {
            case 'urgent':
            case 'high': return 'border-t-rose-500';
            case 'medium': return 'border-t-amber-500';
            default: return 'border-t-slate-500';
        }
    };

    return (
        <div
            className={`glass-panel border-t-4 p-5 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 flex flex-col h-full group ${getPriorityBorder(ticket.priority)}`}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">#{ticket.id.substring(0, 8)}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize inline-flex items-center gap-1 ${getStatusStyle(ticket.status)}`}>
                    {ticket.status === 'open' && <AlertCircle size={10} />}
                    {ticket.status}
                </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">{ticket.title}</h3>

            <p className="text-sm text-slate-400 mb-6 flex-grow line-clamp-3">
                {ticket.description}
            </p>

            {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onSolve) onSolve(ticket);
                        }}
                        className="text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded border border-emerald-500/20 text-xs font-bold transition-all inline-flex items-center gap-1"
                    >
                        <CheckCircle size={14} /> Mark Solved
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={14} />
                    <span>{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-2 flex-shrink border border-slate-700 w-32 py-1 overflow-hidden overflow-ellipsis rounded-md" title={ticket.contactEmail || ticket.contactId}>
                    <User size={14} />
                    <span className="truncate">{ticket.contactEmail || ticket.contactId || 'No Contact'}</span>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
