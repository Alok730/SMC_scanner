import React from 'react';
import { LayoutDashboard, TrendingUp, Search, Bell, Menu, ExternalLink } from 'lucide-react';

const Sidebar = () => (
    <div className="w-64 h-screen glass-nav border-r fixed left-0 top-0 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SMC <span className="text-blue-500">Scanner</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
            <NavItem icon={<TrendingUp size={20} />} label="Bullish Setups" />
            <NavItem icon={<Bell size={20} />} label="Alerts" />
        </nav>

        <div className="pt-6 border-t border-white/5">
            <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-500/20">
                <p className="text-xs text-blue-400 font-medium mb-1">Market Status</p>
                <p className="text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Mode
                </p>
            </div>
        </div>
    </div>
);

const NavItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const Header = ({ onSearchChange }) => (
    <header className="h-16 glass-nav fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>Market</span>
            <span>/</span>
            <span className="text-white">NSE 100</span>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search stocks..."
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 w-64 transition-all"
                />
            </div>
            <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/5 transition-all">
                <Bell size={18} />
            </button>
        </div>
    </header>
);

const Dashboard = ({ children, onSearchChange }) => {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <Header onSearchChange={onSearchChange} />
            <main className="pl-64 pt-16">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
