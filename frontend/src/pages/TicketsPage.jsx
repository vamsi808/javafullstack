import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TicketList from '../components/tickets/TicketList';
import TicketForm from '../components/tickets/TicketForm';
import TicketDetails from '../components/tickets/TicketDetails';

const TicketsPage = () => {
    return (
        <div className="tickets-page">
            <Routes>
                <Route path="/" element={<TicketList />} />
                <Route path="/new" element={<TicketForm />} />
                <Route path="/edit/:id" element={<TicketForm />} />
                <Route path="/:id" element={<TicketDetails />} />
            </Routes>
        </div>
    );
};

export default TicketsPage;
