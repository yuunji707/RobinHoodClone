import axios from 'axios';

// Create an axios instance with the base URL of the backend API
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Define an interface for the stock data
export interface StockData {
  symbol: string;
  currentPrice: number | null;
  marketCap: number | null;
  error?: string;
}

// Function to query stock data from the backend
export const queryStock = async (ticker: string): Promise<StockData> => {
  try {
    const response = await api.get(`/query?ticker=${ticker}`);
    console.log('API Response:', response.data); // Log the response data for debugging
    // Ensure the response structure matches the StockData interface
    return {
      symbol: response.data.symbol,
      currentPrice: response.data.currentPrice,
      marketCap: response.data.marketCap,
      error: response.data.error,
    };
  } catch (error) {
    console.error('Error querying stock data:', error);
    throw new Error('Error querying stock data');
  }
};

// Function to buy stock and update the backend
export const buyStock = async (ticker: string, quantity: number) => {
  try {
    const response = await api.post('/buy', { ticker, quantity });
    return response.data;
  } catch (error) {
    console.error('Error buying stock:', error);
    throw new Error('Error buying stock');
  }
};

// Function to sell stock and update the backend
export const sellStock = async (ticker: string, quantity: number) => {
  try {
    const response = await api.post('/sell', { ticker, quantity });
    return response.data;
  } catch (error) {
    console.error('Error selling stock:', error);
    throw new Error('Error selling stock');
  }
};


// Function to view the portfolio from the backend
export const viewPortfolio = async () => {
  try {
    const response = await api.get('/portfolio');
    return response.data; // The response now contains both bought_stocks and sold_stocks
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};


// Function to get a review of the portfolio from the backend
export const getPortfolioReview = async () => {
  try {
    // Fetch the portfolio data using the viewPortfolio function
    const portfolioData = await viewPortfolio();
    // Post the portfolio data to the backend to get the review
    const response = await api.post('/portfolio/review', { portfolio_data: portfolioData });
    return response.data;
  } catch (error) {
    console.error('Error getting portfolio review:', error);
    throw new Error('Error getting portfolio review');
  }
};
