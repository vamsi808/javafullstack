import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, Settings, Contact } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 text-slate-300 flex flex-col transition-all duration-300 z-10">
            <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-primary/20">
                    FD
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    FreshClone
                </h1>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary !border-l-4 !border-primary' : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/tickets" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary !border-l-4 !border-primary' : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'}`}>
                    <Ticket size={20} />
                    <span>Tickets</span>
                </NavLink>
                <NavLink to="/contacts" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary !border-l-4 !border-primary' : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'}`}>
                    <Contact size={20} />
                    <span>Contacts</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary !border-l-4 !border-primary' : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'}`}>
                    <Users size={20} />
                    <span>Profile</span>
                </NavLink>
            </nav>

            <div className="p-4 border-t border-slate-700/50">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-200">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
