import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import AdminProfile from '../pages/AdminProfile';
import TicketsPage from '../pages/TicketsPage';
import ContactsPage from '../pages/ContactsPage';
import LoginPage from '../pages/Auth/LoginPage';
import SetPasswordPage from '../pages/Auth/SetPasswordPage';
import CustomerPortal from '../pages/CustomerPortal';
import NotFound from '../components/common/NotFound';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Customer Routes */}
            <Route path="/set-password" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <SetPasswordPage />
                </ProtectedRoute>
            } />
            <Route path="/portal" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <CustomerPortal />
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminProfile />
                </ProtectedRoute>
            } />
            <Route path="/tickets/*" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <TicketsPage />
                </ProtectedRoute>
            } />
            <Route path="/contacts/*" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ContactsPage />
                </ProtectedRoute>
            } />

            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
