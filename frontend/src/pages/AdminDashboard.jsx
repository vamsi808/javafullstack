import React, { useState, useEffect } from 'react';
import { Ticket, Users, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/analytics/admin-stats');
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
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full space-y-4">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">Loading Analytics Data...</p>
        </div>
    );

    // Fallback data if API returns empty
    const displayStats = stats || {
        totalTickets: 0, openTickets: 0, pendingTickets: 0, resolvedTickets: 0, closedTickets: 0,
        totalContacts: 0, priorityStats: { High: 0, Medium: 0, Low: 0 }
    };

    const chartData = [
        { name: 'Open', value: displayStats.openTickets, color: '#3b82f6' },
        { name: 'Pending', value: displayStats.pendingTickets, color: '#f59e0b' },
        { name: 'Resolved', value: displayStats.resolvedTickets, color: '#10b981' },
        { name: 'Closed', value: displayStats.closedTickets, color: '#64748b' },
    ];

    const priorityData = Object.keys(displayStats.priorityStats).map(key => ({
        name: key,
        value: displayStats.priorityStats[key]
    })).filter(item => item.value > 0);

    const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 space-y-8 max-w-7xl mx-auto"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">System Insights</h1>
                    <p className="text-slate-400 mt-1">Real-time performance across the helpdesk.</p>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-inner">
                    <Clock size={18} className="text-primary animate-pulse" />
                    <span className="text-sm font-medium text-slate-300">Updated: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Ticket className="text-blue-400" />} bgClass="bg-blue-500/10" borderClass="border-blue-500/20" label="Total Tickets" value={displayStats.totalTickets} trend="+5%" title="Tickets Volume" />
                <StatCard icon={<Clock className="text-amber-400" />} bgClass="bg-amber-500/10" borderClass="border-amber-500/20" label="Avg. Response" value="1.2h" trend="-10%" title="Response Metric" />
                <StatCard icon={<CheckCircle className="text-emerald-400" />} bgClass="bg-emerald-500/10" borderClass="border-emerald-500/20" label="Resolution Rate" value="94%" trend="+3%" title="Efficiency" />
                <StatCard icon={<Users className="text-violet-400" />} bgClass="bg-violet-500/10" borderClass="border-violet-500/20" label="Total Contacts" value={displayStats.totalContacts} trend="+12%" title="User Base" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Breakdown Bar Chart */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-primary rounded-full"></div>
                        Ticket Status Breakdown
                    </h2>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Pie Chart */}
                <div className="glass-panel p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-secondary rounded-full"></div>
                        Priority Distribution
                    </h2>

                    {priorityData.length > 0 ? (
                        <>
                            <div className="h-[260px] flex-1 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={priorityData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {priorityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 pt-6 border-t border-slate-700/50">
                                {priorityData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-sm font-medium text-slate-300">{item.name} <span className="text-slate-500 ml-1">({item.value})</span></span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-slate-500 italic">No priority data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Critical Issues Box */}
            <div className="relative overflow-hidden glass-panel p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80">
                <div className="absolute top-0 left-0 w-1 h-full bg-danger"></div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Attention Required</h2>
                        <p className="text-sm text-slate-400 mt-1">Issues needing immediate intervention</p>
                    </div>
                    {(displayStats.priorityStats.High > 0) && (
                        <span className="text-xs bg-danger/10 text-danger px-3 py-1.5 rounded-full border border-danger/20 font-bold tracking-wide uppercase">Critical</span>
                    )}
                </div>

                <div className="space-y-4">
                    {displayStats.priorityStats.High > 0 ? (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-start gap-4 p-5 bg-gradient-to-r from-danger/10 to-transparent border border-danger/20 rounded-xl"
                        >
                            <div className="p-3 bg-danger/20 rounded-full flex-shrink-0 animate-pulse">
                                <AlertTriangle className="text-danger" size={24} />
                            </div>
                            <div>
                                <p className="text-lg text-white font-bold">Resolution Overdue Risk</p>
                                <p className="text-slate-300 mt-1">There are <span className="text-white font-bold">{displayStats.priorityStats.High}</span> high priority tickets that require your immediate attention to prevent SLA breaches.</p>
                                <button className="mt-3 text-sm font-medium text-danger hover:text-white transition-colors flex items-center gap-1">
                                    Review high priority tickets &rarr;
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-10 border border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
                            <CheckCircle size={40} className="text-emerald-500/50 mb-3" />
                            <p className="text-slate-300 font-medium">No urgent tickets at the moment.</p>
                            <p className="text-slate-500 text-sm mt-1">Your helpdesk is running smoothly.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, trend, title, bgClass, borderClass }) => {
    const isPositive = trend.startsWith('+');
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group glass-panel p-6 relative overflow-hidden"
        >
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-current transition-all duration-500 group-hover:scale-150" />

            <div className="flex items-start justify-between mb-6 relative">
                <div className={`p-3 rounded-xl border ${bgClass} ${borderClass} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    <TrendingUp size={12} className={isPositive ? '' : 'rotate-180'} />
                    {trend}
                </div>
            </div>

            <div className="relative">
                <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{value}</h3>
                <p className="text-slate-400 text-sm font-medium">{label}</p>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
