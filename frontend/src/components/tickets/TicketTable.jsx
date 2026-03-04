import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { Mail, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const TicketTable = ({ tickets, onSolve }) => {
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

    const getPriorityStyle = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
            case 'urgent': return 'bg-rose-500 text-white';
            case 'medium': return 'bg-amber-500 text-white';
            default: return 'bg-slate-400 text-white';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/20">
                        <th className="py-4 px-6 font-medium text-slate-400 text-sm uppercase tracking-wider">Ticket Details</th>
                        <th className="py-4 px-6 font-medium text-slate-400 text-sm uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 font-medium text-slate-400 text-sm uppercase tracking-wider">Priority</th>
                        <th className="py-4 px-6 font-medium text-slate-400 text-sm uppercase tracking-wider">Created</th>
                        <th className="py-4 px-6 font-medium text-slate-400 text-sm uppercase tracking-wider">Contact</th>
                        <th className="py-4 px-6 font-medium text-slate-400 text-sm uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {tickets.map(ticket => (
                        <tr
                            key={ticket.id}
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                            className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                        >
                            <td className="py-4 px-6">
                                <div className="flex flex-col">
                                    <span className="text-white font-medium group-hover:text-primary transition-colors line-clamp-1">{ticket.title}</span>
                                    <span className="text-xs text-slate-500 mt-1 font-mono">#{ticket.id.substring(0, 8)}</span>
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize whitespace-nowrap inline-flex items-center gap-1 ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status === 'open' && <AlertCircle size={12} />}
                                    {ticket.status}
                                </span>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${getPriorityStyle(ticket.priority)}`}></span>
                                    <span className="text-slate-300 text-sm capitalize">{ticket.priority}</span>
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Clock size={14} />
                                    <span>{formatDate(ticket.createdAt)}</span>
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-800/50 w-fit px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <Mail size={14} className="text-slate-500" />
                                    {ticket.contactEmail || ticket.contactId || 'No email provided'}
                                </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                                {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onSolve) onSolve(ticket);
                                        }}
                                        className="text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded border border-emerald-500/20 text-xs font-bold transition-all inline-flex items-center gap-1"
                                    >
                                        <CheckCircle size={14} /> Solved
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketTable;
