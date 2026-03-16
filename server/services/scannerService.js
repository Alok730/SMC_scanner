const calculateEMA = (data, period) => {
    if (data.length < period) return null;
    const k = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
    for (let i = period; i < data.length; i++) {
        ema = (data[i] - ema) * k + ema;
    }
    return ema;
};

const calculateRSI = (data, period = 14) => {
    if (data.length < period + 1) return 50;
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
        const diff = data[i] - data[i - 1];
        if (diff > 0) gains += diff;
        else losses -= diff;
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        if (diff > 0) {
            avgGain = (avgGain * (period - 1) + diff) / period;
            avgLoss = (avgLoss * (period - 1)) / period;
        } else {
            avgGain = (avgGain * (period - 1)) / period;
            avgLoss = (avgLoss * (period - 1) - diff) / period;
        }
    }

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
};

const detectSMC = (historical) => {
    // Simplified SMC logic for demo purposes
    // Break of Structure (BOS): Price breaks previous high/low
    // Order Blocks: Significant volume at a price level followed by a strong move

    const closes = historical.map(h => h.close);
    const lengths = closes.length;
    if (lengths < 20) return { bos: false, orderBlock: 'None', liquidity: false };

    const lastPrice = closes[lengths - 1];
    const prevHigh = Math.max(...closes.slice(lengths - 10, lengths - 1));
    const prevLow = Math.min(...closes.slice(lengths - 10, lengths - 1));

    const bos = lastPrice > prevHigh;
    const orderBlock = lastPrice > calculateEMA(closes, 9) ? 'Bullish OB' : 'Bearish OB';
    const liquidity = lastPrice < prevLow * 1.01 && lastPrice > prevLow;

    return { bos, orderBlock, liquidity };
};

const scanStock = (stockData) => {
    const closes = stockData.historical.map(h => h.close);
    const ema9 = calculateEMA(closes, 9);
    const ema21 = calculateEMA(closes, 21);
    const rsi = calculateRSI(closes, 14);
    const smc = detectSMC(stockData.historical);

    let trend = 'Neutral';
    if (ema9 > ema21 && stockData.price > ema9) trend = 'Bullish';
    else if (ema9 < ema21 && stockData.price < ema9) trend = 'Bearish';

    let action = 'NONE';
    if (trend === 'Bullish' && rsi > 50 && smc.bos) action = 'BUY';
    else if (trend === 'Bearish' && rsi < 50 && smc.bos) action = 'SELL';

    return {
        ema9,
        ema21,
        rsi,
        smc,
        trend,
        action
    };
};

module.exports = {
    scanStock
};
