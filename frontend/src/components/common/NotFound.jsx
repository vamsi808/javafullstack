import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content glass-panel">
                <AlertTriangle size={64} className="warning-icon" />
                <h2>Page Not Found</h2>
                <p>The page you are looking for doesn't exist or has been moved.</p>
                <Link to="/dashboard" className="btn btn-primary">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
