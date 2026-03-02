import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">FD</div>
                <h1 className="logo-text">FreshClone</h1>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/tickets" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Ticket size={20} />
                    <span>Tickets</span>
                </NavLink>
                <NavLink to="/contacts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Contacts</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item btn-transparent">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
