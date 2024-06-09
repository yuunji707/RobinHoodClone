import React, { createContext, useState, useContext, ReactNode } from 'react';
import { viewPortfolio, buyStock } from '../api';

interface Stock {
  ticker: string;
  quantity: number;
}

interface PortfolioContextProps {
  portfolio: Stock[];
  fetchPortfolio: () => Promise<void>;
  buyStockAndUpdatePortfolio: (ticker: string, quantity: number) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);

  const fetchPortfolio = async () => {
    try {
      const response = await viewPortfolio();
      setPortfolio(response);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const buyStockAndUpdatePortfolio = async (ticker: string, quantity: number) => {
    try {
      await buyStock(ticker, quantity);
      await fetchPortfolio(); // Fetch the updated portfolio
    } catch (error) {
      console.error('Error buying stock:', error);
    }
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, fetchPortfolio, buyStockAndUpdatePortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
