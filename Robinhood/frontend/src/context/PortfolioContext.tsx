import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { viewPortfolio, buyStock } from '../api';
import { useToast } from '@chakra-ui/react';

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
  const toast = useToast();

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
      toast({
        title: 'Portfolio updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error buying stock:', error);
    }
  };

  useEffect(() => {
    fetchPortfolio();

    const socket = new WebSocket('ws://localhost:5000');
    socket.onopen = () => console.log('WebSocket connection established');
    
    socket.onmessage = (event) => {
      const updatedPortfolio = JSON.parse(event.data);
      setPortfolio(updatedPortfolio);
      toast({
        title: 'Portfolio updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    };

    socket.onerror = (error) => console.error('WebSocket error:', error);
    
    socket.onclose = () => console.log('WebSocket connection closed');

    return () => {
      socket.close();
    };
  }, []);

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

