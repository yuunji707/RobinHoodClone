import React, { useState } from 'react';
import { queryStock, StockData } from '../api';


const QueryStock: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [stockInfo, setStockInfo] = useState<StockData | null>(null);

  const handleQuery = async () => {
    try {
      const response = await queryStock(ticker);
      setStockInfo(response);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setStockInfo({
        logo_url: '',
        preMarketPrice: null,
        regularMarketPrice: null,
        error: 'Error fetching stock data',
      });
    }
  };

  return (
    <div>
      <h1>Stock Data</h1>
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter stock ticker"
      />
      <button onClick={handleQuery}>Query Stock</button>
      {stockInfo && (
        <div>
          <h2>{ticker.toUpperCase()}</h2>
          {stockInfo.error ? (
            <p>{stockInfo.error}</p>
          ) : (
            <>
              <img src={stockInfo.logo_url} alt={`${ticker} logo`} />
              <p>Pre-Market Price: {stockInfo.preMarketPrice ?? 'N/A'}</p>
              <p>Regular Market Price: {stockInfo.regularMarketPrice ?? 'N/A'}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryStock;

