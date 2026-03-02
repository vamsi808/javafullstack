import React from 'react';
import { Ticket, Users, CheckCircle, Clock } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="page-header">
                <h1 className="page-title">Dashboard Overview</h1>
                <p className="subtitle">Welcome back! Here is what's happening today.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper resolved">
                        <CheckCircle size={28} />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-value">124</h3>
                        <p className="stat-label">Resolved Tickets</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper pending">
                        <Clock size={28} />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-value">38</h3>
                        <p className="stat-label">Pending Tickets</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper total">
                        <Ticket size={28} />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-value">162</h3>
                        <p className="stat-label">Total Tickets</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper contacts">
                        <Users size={28} />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-value">84</h3>
                        <p className="stat-label">Active Contacts</p>
                    </div>
                </div>
            </div>

            <div className="recent-activity glass-panel">
                <h2 className="section-title">Recent Activity</h2>
                <div className="empty-state">
                    <p>No recent activity to display. Start by managing your tickets.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
