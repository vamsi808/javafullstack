import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminProfile = () => {
    const { user, logout } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 max-w-4xl mx-auto"
        >
            <h1 className="text-3xl font-bold text-white mb-8">Admin Profile</h1>

            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary/30 shadow-2xl">
                        <User className="text-primary" size={64} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                        <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider">
                            Administrator
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileItem icon={<Mail size={20} />} label="Email Address" value={user.email} />
                    <ProfileItem icon={<Shield size={20} />} label="Security Level" value="Full Access" />
                </div>

                <div className="mt-12 pt-12 border-t border-slate-800 flex flex-col md:flex-row gap-4">
                    <button className="px-8 py-3 bg-primary hover:bg-primary-hover rounded-xl font-bold transition-all">
                        Edit Profile
                    </button>
                    <button
                        onClick={logout}
                        className="px-8 py-3 bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ProfileItem = ({ icon, label, value }) => (
    <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
        <div className="flex items-center gap-3 mb-2 text-slate-400">
            {icon}
            <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-white font-medium">{value}</p>
    </div>
);

export default AdminProfile;
