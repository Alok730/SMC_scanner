require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', require('./routes/stockRoutes'));

app.get('/', (req, res) => {
    res.send('SMC Stock App API is running...');
});

// Scanner Job
const { runScanner } = require('./services/jobService');
runScanner(); // Initial run
setInterval(runScanner, 5 * 60 * 1000); // Every 5 minutes

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
