import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const BuyStock: React.FC = () => {
  const { buyStockAndUpdatePortfolio } = usePortfolio();
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState<number>(0);

  const handleBuyStock = async () => {
    if (ticker && quantity > 0) {
      await buyStockAndUpdatePortfolio(ticker, quantity);
      setTicker('');
      setQuantity(0);
    }
  };

  return (
    <div>
      <h1>Buy Stock</h1>
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Ticker"
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        placeholder="Quantity"
      />
      <button onClick={handleBuyStock}>Buy</button>
    </div>
  );
};

export default BuyStock;
