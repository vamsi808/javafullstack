import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { ticketService } from '../../services/ticketService';
import Loader from '../common/Loader';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import TicketTable from './TicketTable';
import TicketCard from './TicketCard';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const navigate = useNavigate();
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { currentPage, itemsPerPage, paginate, setPage, resetPage } = usePagination(1, 10);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await ticketService.getAll();
            // Sort by newest first
            setTickets(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSolve = async (ticket) => {
        try {
            await ticketService.update(ticket.id, { ...ticket, status: 'Resolved' });
            fetchTickets(); // Refresh the list
        } catch (error) {
            console.error('Failed to solve ticket:', error);
        }
    };

    // Filter 
    const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        ticket.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const paginatedTickets = paginate(filteredTickets);
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    useEffect(() => {
        resetPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm]);

    if (loading) return <Loader />;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Tickets</h1>
                    <p className="text-slate-400 mt-1">Manage and resolve customer inquiries.</p>
                </div>
                <button className="btn-primary flex items-center justify-center gap-2" onClick={() => navigate('/tickets/new')}>
                    <Plus size={18} /> New Ticket
                </button>
            </div>

            <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:max-w-md">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm('')}
                        placeholder="Search by ID, Title, or Status..."
                    />
                </div>

                <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                    <button
                        className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                        onClick={() => setViewMode('table')}
                        title="Table View"
                    >
                        <ListIcon size={20} />
                    </button>
                    <button
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredTickets.length === 0 ? (
                    <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <ListIcon size={32} className="text-slate-500" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No tickets found</h3>
                        <p className="text-slate-400">Try adjusting your search or create a new ticket.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'table' ? (
                            <div className="glass-panel overflow-hidden">
                                <TicketTable tickets={paginatedTickets} onSolve={handleSolve} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {paginatedTickets.map(ticket => (
                                    <TicketCard key={ticket.id} ticket={ticket} onSolve={handleSolve} />
                                ))}
                            </div>
                        )}

                        <div className="flex justify-center pt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TicketList;
