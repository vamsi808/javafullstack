import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-search">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search tickets, contacts..."
                    className="search-input"
                />
            </div>

            <div className="navbar-actions">
                <button className="action-btn">
                    <Bell size={20} />
                    <span className="badge-indicator"></span>
                </button>
                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <span className="user-name">Admin User</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
