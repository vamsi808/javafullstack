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
import './TicketList.css';

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
        <div className="ticket-list-container">
            <div className="page-header">
                <h1 className="page-title">Tickets</h1>
                <button className="btn btn-primary" onClick={() => navigate('/tickets/new')}>
                    <Plus size={18} /> New Ticket
                </button>
            </div>

            <div className="list-controls glass-panel">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={() => setSearchTerm('')}
                    placeholder="Search by ID, Title, or Status..."
                />

                <div className="view-toggles">
                    <button
                        className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                        title="Table View"
                    >
                        <ListIcon size={20} />
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </div>

            <div className="ticket-content-area">
                {filteredTickets.length === 0 ? (
                    <div className="empty-state glass-panel">
                        <p>No tickets found matching your search.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'table' ? (
                            <div className="glass-panel table-wrapper">
                                <TicketTable tickets={paginatedTickets} />
                            </div>
                        ) : (
                            <div className="tickets-grid">
                                {paginatedTickets.map(ticket => (
                                    <TicketCard key={ticket.id} ticket={ticket} />
                                ))}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default TicketList;
