import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { viewPortfolio, buyStock, sellStock } from '../api';
import { useToast } from '@chakra-ui/react';

// Interfaces to define the structure of bought and sold stocks
interface BoughtStock {
  ticker: string;
  quantity: number;
  date_bought: string;
}

interface SoldStock {
  ticker: string;
  quantity: number;
  date_sold: string;
}

// Interface to define the structure of the portfolio
interface Portfolio {
  bought_stocks: BoughtStock[];
  sold_stocks: SoldStock[];
}

// Interface for the context properties
interface PortfolioContextProps {
  portfolio: Portfolio;
  fetchPortfolio: () => Promise<void>;
  buyStockAndUpdatePortfolio: (ticker: string, quantity: number) => Promise<void>;
  sellStockAndUpdatePortfolio: (ticker: string, quantity: number) => Promise<void>;
}

// Create a context for the portfolio with an undefined initial value
const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

// Provider component to manage the portfolio state and actions
export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio>({ bought_stocks: [], sold_stocks: [] });
  const toast = useToast();

  // Function to fetch the portfolio from the API
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
      await fetchPortfolio();
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

  // Function to sell stock and update the portfolio
  const sellStockAndUpdatePortfolio = async (ticker: string, quantity: number) => {
    try {
      await sellStock(ticker, quantity);
      await fetchPortfolio();
      toast({
        title: 'Portfolio updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error selling stock:', error);
    }
  };

  // useEffect hook to fetch the portfolio and set up WebSocket connection on component mount
  useEffect(() => {
    fetchPortfolio();

    const socket = new WebSocket('ws://localhost:5000');
    socket.onopen = () => console.log('WebSocket connection established');
    
    // Handle incoming messages from WebSocket
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

    // Cleanup function to close the WebSocket connection
    return () => {
      socket.close();
    };
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolio, fetchPortfolio, buyStockAndUpdatePortfolio, sellStockAndUpdatePortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Custom hook to use the PortfolioContext
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
