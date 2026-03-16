import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts';

const StockChart = ({ data, symbol }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const [interval, setInterval] = useState('1M');

    // Filtering logic based on interval
    const getFilteredData = () => {
        if (!data || data.length === 0) return [];
        const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        switch (interval) {
            case '1D':
                return sortedData.slice(-5); // Just a few days for "daily" view if only daily data is available
            case '1W':
                return sortedData.slice(-10);
            case '1M':
            default:
                return sortedData.slice(-60);
        }
    };

    useEffect(() => {
        if (!data || data.length === 0) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#94a3b8',
                fontSize: 10,
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 350,
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            crosshair: {
                vertLine: { color: '#6366f1', labelBackgroundColor: '#6366f1' },
                horzLine: { color: '#6366f1', labelBackgroundColor: '#6366f1' },
            },
        });

        chartRef.current = chart;

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        const filtered = getFilteredData();
        const processedData = filtered.map(item => ({
            time: new Date(item.date).getTime() / 1000,
            open: item.open || item.close,
            high: item.high || item.close,
            low: item.low || item.close,
            close: item.close,
        }));

        candleSeries.setData(processedData);

        // EMA Helper function
        const calculateEMA = (quotes, period) => {
            if (quotes.length < period) return [];
            const k = 2 / (period + 1);
            let ema = quotes.slice(0, period).reduce((a, b) => a + b.close, 0) / period;
            
            const results = [];
            for (let i = period; i < quotes.length; i++) {
                ema = (quotes[i].close - ema) * k + ema;
                results.push({ time: quotes[i].time, value: ema });
            }
            return results;
        };

        const ema9Series = chart.addSeries(LineSeries, {
            color: '#3b82f6',
            lineWidth: 1,
            lineStyle: 0,
            title: 'EMA 9',
            priceLineVisible: false,
        });
        ema9Series.setData(calculateEMA(processedData, 9));

        const ema21Series = chart.addSeries(LineSeries, {
            color: '#6366f1',
            lineWidth: 1,
            lineStyle: 0,
            title: 'EMA 21',
            priceLineVisible: false,
        });
        ema21Series.setData(calculateEMA(processedData, 21));

        chart.timeScale().fitContent();

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, interval]);

    return (
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/40">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {symbol} 
                        <span className="text-slate-500 font-normal text-xs bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">Technical View</span>
                    </h3>
                    <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">EMA 9</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">EMA 21</span>
                        </div>
                    </div>
                </div>
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                    {['1D', '1W', '1M'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setInterval(p)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${interval === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={chartContainerRef} className="w-full" />
        </div>
    );
};

export default StockChart;
