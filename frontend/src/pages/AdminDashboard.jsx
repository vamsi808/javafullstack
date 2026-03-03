import React, { useState, useEffect } from 'react';
import { Ticket, Users, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/v1/analytics/admin-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const chartData = [
        { name: 'Open', value: stats.openTickets, color: '#3b82f6' },
        { name: 'Pending', value: stats.pendingTickets, color: '#f59e0b' },
        { name: 'Resolved', value: stats.resolvedTickets, color: '#10b981' },
        { name: 'Closed', value: stats.closedTickets, color: '#64748b' },
    ];

    const priorityData = Object.keys(stats.priorityStats).map(key => ({
        name: key,
        value: stats.priorityStats[key]
    }));

    const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">System Insights</h1>
                    <p className="text-slate-400">Real-time performance across the helpdesk.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Clock size={18} className="text-primary" />
                    <span className="text-sm text-slate-300">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Ticket className="text-primary" />} label="Total Tickets" value={stats.totalTickets} trend="+5%" />
                <StatCard icon={<Clock className="text-amber-500" />} label="Avg. Response" value="1.2h" trend="-10%" />
                <StatCard icon={<CheckCircle className="text-success" />} label="Resolution Rate" value="94%" trend="+3%" />
                <StatCard icon={<Users className="text-violet-500" />} label="Total Contacts" value={stats.totalContacts} trend="+12%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Breakdown Bar Chart */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-lg font-semibold text-white mb-6">Ticket Status Breakdown</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Pie Chart */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-lg font-semibold text-white mb-6">Priority Distribution</h2>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {priorityData.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                <span className="text-sm text-slate-400">{item.name} ({item.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Critical Issues Placeholder */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Attention Required</h2>
                    <span className="text-xs bg-danger/20 text-danger px-2 py-1 rounded-full border border-danger/30 font-medium">Critical Issues</span>
                </div>
                <div className="space-y-4">
                    {stats.priorityStats.High > 0 ? (
                        <div className="flex items-center gap-4 p-4 bg-danger/5 border border-danger/10 rounded-xl">
                            <AlertTriangle className="text-danger flex-shrink-0" size={24} />
                            <div>
                                <p className="text-white font-medium">Resolution Overdue</p>
                                <p className="text-sm text-slate-400">{stats.priorityStats.High} tickets require immediate attention.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8 border border-dashed border-slate-700 rounded-xl">
                            <p className="text-slate-500 italic">No urgent tickets at the moment. Great job!</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, trend }) => (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl group hover:border-primary/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                <TrendingUp size={12} className={trend.startsWith('+') ? '' : 'rotate-180'} />
                {trend}
            </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-slate-500 text-sm">{label}</p>
    </div>
);

export default AdminDashboard;
