const mongoose = require('mongoose');
require('dotenv').config();
const Stock = require('./models/Stock');

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');
        const result = await Stock.deleteMany({});
        console.log(`Cleared ${result.deletedCount} stocks from database.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetDB();
