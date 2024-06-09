import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const ViewPortfolio: React.FC = () => {
  const { portfolio, fetchPortfolio } = usePortfolio();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div>
      <h1>Portfolio</h1>
      {portfolio.length === 0 ? (
        <p>No stocks in portfolio</p>
      ) : (
        <ul>
          {portfolio.map((stock, index) => (
            <li key={index}>
              Ticker: {stock.ticker}, Quantity: {stock.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewPortfolio;

