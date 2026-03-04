import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Search, User, LayoutDashboard, Ticket, Contact, Users, Settings } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="h-16 border-b border-slate-700/50 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-6 z-20 shadow-sm shadow-slate-900/20 sticky top-0">
            {/* Logo area */}
            <div className="flex items-center gap-6 mr-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-primary/20">
                        FD
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
                        FreshClone
                    </h1>
                </div>
            </div>

            {/* Navigation area */}
            <nav className="flex-1 flex items-center gap-1 overflow-x-auto hide-scrollbar">
                <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                    <LayoutDashboard size={18} />
                    <span className="hidden md:block">Dashboard</span>
                </NavLink>
                <NavLink to="/tickets" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                    <Ticket size={18} />
                    <span className="hidden md:block">Tickets</span>
                </NavLink>
                <NavLink to="/contacts" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                    <Contact size={18} />
                    <span className="hidden md:block">Contacts</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                    <Users size={18} />
                    <span className="hidden md:block">Profile</span>
                </NavLink>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-slate-400 hover:bg-slate-800/50 hover:text-white">
                    <Settings size={18} />
                    <span className="hidden md:block">Settings</span>
                </button>
            </nav>

            {/* Tools Area */}
            <div className="flex items-center gap-4 ml-6 flex-shrink-0">
                <div className="relative group hidden lg:block w-48 xl:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-200" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                </div>

                <div className="flex items-center gap-3 border-l border-slate-700/50 pl-4">
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors duration-200 bg-slate-800/30 hover:bg-slate-800/80 rounded-full">
                        <Bell size={18} />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-slate-900"></span>
                    </button>
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary transition-all duration-300 shadow-inner">
                            <User size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
