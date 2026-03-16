# SMC Stock Scanner 🚀

A premium MERN stack application designed for professional traders to scan and analyze Indian Stock Market (NSE) symbols using **Smart Money Concepts (SMC)** and advanced technical indicators.

![SMC Scanner Dashboard](https://img.shields.io/badge/Status-Live-emerald?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square)

## ✨ Key Features

- **Automated Scanning**: Periodically fetches real-time data for 48+ major NSE stocks using the Yahoo Finance API.
- **Smart Money Concepts (SMC)**: 
    - **BOS (Break of Structure)** detection.
    - **Order Block** identification.
    - **Liquidity Sweep** analysis.
- **Technical Confirmation**: Uses EMA 9/21 crossovers and RSI (Relative Strength Index) to filter and confirm trade entries.
- **Smart Signals**: Generates actionable **BUY** and **SELL** recommendations based on converged technical and structural data.
- **Premium UI**: Modern Glassmorphism design with Framer Motion animations and responsive layouts.
- **Real-time Updates**: Backend scanner runs every 5 minutes to keep data fresh.

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for micro-animations
- **Lucide React** for modern iconography
- **Axios** for API communication

### Backend
- **Node.js** & **Express**
- **MongoDB Atlas** (Database)
- **Mongoose** (ODM)
- **Yahoo-finance2** (Data provider)
- **Nodemon** (Dev workflow)

## 📂 Project Structure

```text
SMC/
├── client/           # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   └── App.jsx      # Main application entry
├── server/           # Node.js + Express Backend
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   ├── services/     # Scanner and data logic
│   └── index.js      # Server entry point
└── README.md         # This file
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `server` directory and add your MongoDB URI:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
   The app will typically run on `http://localhost:5178`.

## ⚙️ How it Works

1. **Data Ingestion**: The backend `jobService` triggers every 5 minutes, fetching OHLC and volume data from Yahoo Finance.
2. **Analysis**: The `scannerService` calculates EMA, RSI, and detects SMC patterns (BOS/Liquidity).
3. **Storage**: Analyzed results are updated in MongoDB.
4. **Delivery**: The React frontend fetches current scan results through the `/api/stocks` REST endpoint and displays them in a dynamic dashboard.

---
*Created with passion for precision trading.*
