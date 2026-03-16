const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

// Get all stocks with signals
router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.find().sort({ 'signals.action': 1, symbol: 1 });
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific stock data
router.get('/:symbol', async (req, res) => {
    try {
        const stock = await Stock.findOne({ symbol: req.params.symbol });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
