import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Higher Order Component to protect routes based on authentication and user roles.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Target component to render.
 * @param {Array<string>} props.allowedRoles - Roles allowed to access this route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-start">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user doesn't have the role, redirect based on their own role
        return <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/portal'} replace />;
    }

    // Handle password forcing for customers
    if (user.role === 'CUSTOMER' && !user.isPasswordSet && location.pathname !== '/set-password') {
        return <Navigate to="/set-password" replace />;
    }

    return children;
};

export default ProtectedRoute;
