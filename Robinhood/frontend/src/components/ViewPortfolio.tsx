import React, { useEffect, useState } from 'react';
import { viewPortfolio } from '../api';

interface Stock {
  ticker: string;
  quantity: number;
}

const ViewPortfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await viewPortfolio();
        setPortfolio(response);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setError('Error fetching portfolio');
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div>
      <h1>Portfolio</h1>
      {error ? (
        <p>{error}</p>
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

