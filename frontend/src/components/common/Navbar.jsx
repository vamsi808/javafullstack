import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="h-16 border-b border-slate-700/50 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 z-10 shadow-sm shadow-slate-900/20">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-200" size={18} />
                    <input
                        type="text"
                        placeholder="Search tickets, contacts..."
                        className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-slate-800 transition-all duration-300"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors duration-200 bg-slate-800/30 hover:bg-slate-800/80 rounded-full">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-slate-900"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-700/50 cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary transition-all duration-300 shadow-inner">
                        <User size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">Admin User</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
