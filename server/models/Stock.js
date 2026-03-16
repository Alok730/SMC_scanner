const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String },
    sector: { type: String },
    lastUpdate: { type: Date, default: Date.now },
    data: {
        price: { type: Number },
        change: { type: Number },
        changePercent: { type: Number },
        volume: { type: Number },
        ema9: { type: Number },
        ema21: { type: Number },
        rsi: { type: Number },
    },
    signals: {
        trend: { type: String, enum: ['Bullish', 'Bearish', 'Neutral'], default: 'Neutral' },
        smc: {
            bos: { type: Boolean, default: false },
            orderBlock: { type: String },
            liquiditySweep: { type: Boolean, default: false },
        },
        action: { type: String, enum: ['BUY', 'SELL', 'NONE'], default: 'NONE' },
    },
    historical: [{
        date: { type: Date },
        open: { type: Number },
        high: { type: Number },
        low: { type: Number },
        close: { type: Number },
        volume: { type: Number }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
