import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export interface StockData {
  logo_url: string;
  preMarketPrice: number | null;
  regularMarketPrice: number | null;
  error?: string;
}

// Function to query stock data
export const queryStock = async (ticker: string): Promise<StockData> => {
  try {
    const response = await api.get(`/query?ticker=${ticker}`);
    return response.data;
  } catch (error) {
    console.error('Error querying stock data:', error);
    throw new Error('Error querying stock data');
  }
};

// Function to buy stock
export const buyStock = async (ticker: string, quantity: number) => {
  try {
    const response = await api.post('/buy', { ticker, quantity });
    return response.data;
  } catch (error) {
    console.error('Error buying stock:', error);
    throw new Error('Error buying stock');
  }
};

// Function to view portfolio
export const viewPortfolio = async () => {
  try {
    const response = await api.get('/portfolio');
    return response.data; // Assuming the response contains the portfolio data
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

// Function to get portfolio review
export const getPortfolioReview = async () => {
  try {
    const portfolioData = await viewPortfolio(); // Fetch portfolio data using viewPortfolio function
    const response = await api.post('/portfolio/review', { portfolio_data: portfolioData });
    return response.data;
  } catch (error) {
    console.error('Error getting portfolio review:', error);
    throw new Error('Error getting portfolio review');
  }
};
