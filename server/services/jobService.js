const Stock = require('../models/Stock');
const { fetchStockData, NSE_STOCKS } = require('./dataService');
const { scanStock } = require('./scannerService');

const runScanner = async () => {
    console.log('--- Starting Stock Scan (Yahoo Finance) ---');

    for (const symbol of NSE_STOCKS) {
        try {
            const rawData = await fetchStockData(symbol);
            if (!rawData) continue;

            const scanResult = scanStock(rawData);

            await Stock.findOneAndUpdate(
                { symbol },
                {
                    symbol,
                    data: {
                        price: rawData.price,
                        change: rawData.change,
                        changePercent: (rawData.change / rawData.price) * 100,
                        volume: rawData.volume,
                        ema9: scanResult.ema9,
                        ema21: scanResult.ema21,
                        rsi: scanResult.rsi,
                    },
                    signals: {
                        trend: scanResult.trend,
                        smc: scanResult.smc,
                        action: scanResult.action
                    },
                    historical: rawData.historical,
                    lastUpdate: new Date()
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            console.log(`Scan completed for ${symbol}. Price: ₹${rawData.price.toFixed(2)}`);
            // Small delay to avoid aggressive scraping detection
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Error scanning ${symbol}:`, error.message);
        }
    }
    console.log('--- Scan Completed ---');
};

module.exports = { runScanner };
