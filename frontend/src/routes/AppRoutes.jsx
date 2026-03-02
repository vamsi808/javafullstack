import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import TicketsPage from '../pages/TicketsPage';
import ContactsPage from '../pages/ContactsPage';
import NotFound from '../components/common/NotFound';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets/*" element={<TicketsPage />} />
            <Route path="/contacts/*" element={<ContactsPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
