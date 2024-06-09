import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { viewPortfolio, buyStock } from '../api';
import { useToast } from '@chakra-ui/react';

// Interface for a stock object
interface Stock {
  ticker: string;
  quantity: number;
}

// Interface for the Portfolio context properties
interface PortfolioContextProps {
  portfolio: Stock[];
  fetchPortfolio: () => Promise<void>;
  buyStockAndUpdatePortfolio: (ticker: string, quantity: number) => Promise<void>;
}

// Create a context for the Portfolio
const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold the portfolio data
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const toast = useToast();

  // Function to fetch the portfolio data from the server
  const fetchPortfolio = async () => {
    try {
      const response = await viewPortfolio();
      setPortfolio(response);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  // Function to buy stock and update the portfolio
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

  // useEffect to set up WebSocket connection and fetch initial portfolio data
  useEffect(() => {
    fetchPortfolio();

    // Create a WebSocket connection
    const socket = new WebSocket('ws://localhost:5000');
    socket.onopen = () => console.log('WebSocket connection established');
    
    // Handle incoming WebSocket messages
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

    // Clean up WebSocket connection on component unmount
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

// Custom hook to use the Portfolio context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
