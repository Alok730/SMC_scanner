import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, ArrowDownRight, Activity, Zap, Layers, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StockChart from './StockChart';

const StockScanner = ({ searchQuery = '' }) => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStock, setSelectedStock] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [activeTrend, setActiveTrend] = useState('ALL');

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5001/api/stocks');
            if (res.data && Array.isArray(res.data)) {
                setStocks(res.data);
            }
            setLoading(false);
        } catch (err) {
            console.error("Fetch stocks error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
        const interval = setInterval(fetchStocks, 300000);
        return () => clearInterval(interval);
    }, []);

    const handleStockClick = (stock) => {
        if (!stock) return;
        setSelectedStock(stock);
        setHistoricalData(stock.historical || []);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    const buyCount = stocks.filter(s => s.signals?.action === 'BUY').length;
    const sellCount = stocks.filter(s => s.signals?.action === 'SELL').length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="Total Stocks" value={stocks.length} icon={<Layers className="text-blue-400" />} />
                <StatCard label="Buy Signals" value={buyCount} icon={<Zap className="text-emerald-400" />} />
                <StatCard label="Sell Signals" value={sellCount} icon={<Activity className="text-rose-400" />} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        {['ALL', 'BUY', 'SELL'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        {['ALL', 'Bullish', 'Bearish', 'Neutral'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTrend(t)}
                                className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-tighter font-bold transition-all ${activeTrend === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchStocks}
                        disabled={loading}
                        className="p-3 glass-card rounded-xl border border-white/5 hover:bg-white/5 transition-all disabled:opacity-50"
                        title="Refresh Data"
                    >
                        <Activity size={20} className={loading ? 'animate-pulse text-blue-400' : 'text-slate-400'} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 glass-card rounded-2xl overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/5 text-slate-400 text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Symbol</th>
                                    <th className="px-6 py-4 font-semibold">Price</th>
                                    <th className="px-6 py-4 font-semibold">Signal</th>
                                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stocks
                                    .filter(stock => {
                                        const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesFilter = activeFilter === 'ALL' || stock.signals?.action === activeFilter;
                                        const matchesTrend = activeTrend === 'ALL' || stock.signals?.trend === activeTrend;
                                        return matchesSearch && matchesFilter && matchesTrend;
                                    })
                                    .map((stock) => {
                                    if (!stock) return null;
                                    const price = stock.data?.price || 0;
                                    const change = stock.data?.change || 0;
                                    const changePercent = stock.data?.changePercent || 0;
                                    const action = stock.signals?.action || 'NONE';

                                    return (
                                        <motion.tr
                                            key={stock.symbol}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                                            onClick={() => handleStockClick(stock)}
                                            className={`cursor-pointer transition-colors ${selectedStock?.symbol === stock.symbol ? 'bg-white/5' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-bold">{stock.symbol}</div>
                                                    <div className="text-[10px] text-slate-500">NSE INDIA</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-sm text-slate-200">₹{price.toFixed(2)}</div>
                                                <div className={`text-[10px] flex items-center ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                                    {Math.abs(changePercent).toFixed(2)}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`status-badge !text-[10px] ${action === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : action === 'SELL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                    {action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="bg-blue-600/10 hover:bg-blue-600/20 px-3 py-1 rounded text-blue-400 text-xs transition-all border border-blue-500/10">
                                                    View Chart
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedStock ? (
                            <motion.div
                                key={selectedStock.symbol}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6 "
                            >
                                <div className="glass-card p-6 rounded-2xl border border-white/5 relative bg-gradient-to-br from-blue-600/5 to-transparent">
                                    <button onClick={() => setSelectedStock(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                                        <X size={18} />
                                    </button>
                                    <h3 className="text-xl font-bold mb-1">{selectedStock.symbol}</h3>
                                    <p className="text-slate-400 text-sm mb-4">Smart Money Analysis</p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-3 bg-white/5 rounded-xl">
                                            <p className="text-[10px] text-slate-500 font-medium uppercase mb-1">Structure</p>
                                            <p className={`font-bold ${selectedStock.signals?.smc?.bos ? 'text-blue-400' : 'text-slate-500'}`}>
                                                {selectedStock.signals?.smc?.bos ? 'BOS Detected' : 'No Break'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl">
                                            <p className="text-[10px] text-slate-500 font-medium uppercase mb-1">Volume</p>
                                            <p className="font-bold text-white">Above Avg</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl">
                                            <p className="text-[10px] text-slate-500 font-medium uppercase mb-1">Trend</p>
                                            <p className={`font-bold ${selectedStock.signals?.trend === 'Bullish' ? 'text-emerald-400' : selectedStock.signals?.trend === 'Bearish' ? 'text-rose-400' : 'text-slate-400'}`}>
                                                {selectedStock.data?.price ? selectedStock.signals?.trend : 'Analysing...'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl">
                                            <p className="text-[10px] text-slate-500 font-medium uppercase mb-1">RSI (14)</p>
                                            <p className="font-bold text-slate-200">{selectedStock.data?.rsi?.toFixed(1) || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl border ${selectedStock.signals?.action === 'BUY' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold uppercase opacity-60">Recommendation</span>
                                            <span className={`text-xs font-bold ${selectedStock.signals?.action === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>{selectedStock.signals?.action || 'NONE'}</span>
                                        </div>
                                        <div className="text-lg font-bold">
                                            Entry: {selectedStock.data?.price ? `₹${selectedStock.data.price.toFixed(2)}` : 'Fetching Price...'}
                                        </div>
                                        <div className="text-sm opacity-70">
                                            Target: {selectedStock.data?.price ? `₹${(selectedStock.data.price * 1.05).toFixed(2)}` : '---'}
                                        </div>
                                    </div>
                                </div>

                                <StockChart data={historicalData} symbol={selectedStock.symbol} />
                            </motion.div>
                        ) : (
                            <div className="glass-card p-12 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Zap size={32} className="text-slate-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-400">Select a stock to view details</h3>
                                <p className="text-sm text-slate-500 mt-2">Click on any row in the scanner table to see advanced SMC analysis and charts.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon }) => (
    <div className="glass-card p-5 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">{label}</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                {icon}
            </div>
        </div>
        <div className="text-2xl font-bold">{value || 0}</div>
    </div>
);

const TrendingUp = ({ size, className }) => <Activity size={size} className={className} />;

export default StockScanner;
