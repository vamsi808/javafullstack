import React, { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle, MessageSquare, Plus, RefreshCw, Star } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const CustomerPortal = () => {
    const { user, logout } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async () => {
        try {
            const response = await axios.get(`/api/v1/tickets/contact/email/${user.email}`);
            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [user.email]);

    const handleFeedback = async (ticketId) => {
        setSubmitting(true);
        try {
            await axios.put(`/api/v1/tickets/${ticketId}`, {
                ...selectedTicket,
                feedback: feedback
            });
            await fetchTickets();
            setSelectedTicket(null);
            setFeedback('');
        } catch (error) {
            console.error("Failed to save feedback", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReopen = async (ticket) => {
        try {
            await axios.put(`/api/v1/tickets/${ticket.id}`, {
                ...ticket,
                status: 'Open'
            });
            await fetchTickets();
        } catch (error) {
            console.error("Failed to re-open ticket", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background-start flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background-start text-white p-4 md:p-8">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Welcome, {user.name}
                    </h1>
                    <p className="text-slate-400 mt-1">Manage your support requests and feedback.</p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
                >
                    Sign Out
                </button>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Statistics Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Clock size={20} className="text-primary" />
                            Overview
                        </h2>
                        <div className="space-y-4">
                            <SmallStat label="Open Issues" value={tickets.filter(t => t.status === 'Open').length} color="bg-primary" />
                            <SmallStat label="Resolved" value={tickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length} color="bg-success" />
                            <SmallStat label="Total Tickets" value={tickets.length} color="bg-slate-700" />
                        </div>
                    </div>

                    <button className="w-full py-4 bg-primary hover:bg-primary-hover rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group">
                        <Plus className="group-hover:rotate-90 transition-transform" />
                        Raise New Ticket
                    </button>
                </div>

                {/* Ticket List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <Ticket size={24} className="text-secondary" />
                        Your Recent Tickets
                    </h2>

                    <AnimatePresence>
                        {tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <motion.div
                                    key={ticket.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-slate-900/30 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all group cursor-pointer"
                                    onClick={() => setSelectedTicket(ticket)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{ticket.title}</h3>
                                            <p className="text-slate-500 text-sm mt-1 line-clamp-1">{ticket.description}</p>
                                        </div>
                                        <StatusBadge status={ticket.status} />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <div className="flex gap-4">
                                            <span className="flex items-center gap-1">
                                                <div className={clsx("w-2 h-2 rounded-full", ticket.priority === 'High' ? 'bg-danger' : 'bg-amber-400')} />
                                                {ticket.priority} Priority
                                            </span>
                                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {['Resolved', 'Closed'].includes(ticket.status) && (
                                            <span className="text-success flex items-center gap-1">
                                                <CheckCircle size={14} />
                                                Ready for feedback
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                                <MessageSquare className="mx-auto text-slate-700 mb-4" size={48} />
                                <p className="text-slate-500 italic">No tickets found. Raise one above!</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Ticket Detail & Feedback Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedTicket(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <StatusBadge status={selectedTicket.status} />
                                    <h2 className="text-2xl font-bold mt-2">{selectedTicket.title}</h2>
                                </div>
                                <button onClick={() => setSelectedTicket(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                                    <p className="text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700/30">
                                        {selectedTicket.description}
                                    </p>
                                </div>

                                {['Resolved', 'Closed'].includes(selectedTicket.status) ? (
                                    <div className="space-y-4 pt-6 border-t border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-success flex items-center gap-2">
                                                <Star className="fill-success" size={18} />
                                                How was your experience?
                                            </h4>
                                            <button
                                                onClick={() => handleReopen(selectedTicket)}
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <RefreshCw size={12} />
                                                Problem still appears? Re-open
                                            </button>
                                        </div>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Tell us what you liked or what we could do better..."
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm outline-none focus:border-primary transition-all h-24"
                                            defaultValue={selectedTicket.feedback}
                                            disabled={!!selectedTicket.feedback}
                                        />
                                        {!selectedTicket.feedback && (
                                            <button
                                                onClick={() => handleFeedback(selectedTicket.id)}
                                                disabled={submitting || !feedback.trim()}
                                                className="w-full py-3 bg-success hover:bg-emerald-600 disabled:bg-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                {submitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Feedback"}
                                            </button>
                                        )}
                                        {selectedTicket.feedback && (
                                            <p className="text-xs text-slate-500 italic text-center">Your feedback has been recorded. Thank you!</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                                        <Clock className="text-primary" size={20} />
                                        <p className="text-sm text-primary">An agent is currently looking into this issue.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SmallStat = ({ label, value, color }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <div className="flex items-center gap-3">
            <span className="text-sm font-bold">{value}</span>
            <div className={clsx("w-2 h-8 rounded-full", color)} />
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const colors = {
        Open: 'bg-primary/20 text-primary border-primary/30',
        Pending: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
        Resolved: 'bg-success/20 text-success border-success/30',
        Closed: 'bg-slate-500/20 text-slate-500 border-slate-500/30',
    };
    return (
        <span className={clsx("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", colors[status] || colors.Open)}>
            {status}
        </span>
    );
};

export default CustomerPortal;
