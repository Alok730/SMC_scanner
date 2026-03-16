import React, { useState } from 'react';
import Dashboard from './layouts/Dashboard';
import StockScanner from './components/StockScanner';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Dashboard onSearchChange={setSearchQuery}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Market Overview</h2>
        <p className="text-slate-400">NSE 100 Smart Money Concepts & Trend Analysis</p>
      </div>
      <StockScanner searchQuery={searchQuery} />
    </Dashboard>
  );
}

export default App;
