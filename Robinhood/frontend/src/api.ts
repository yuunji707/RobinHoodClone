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

// Function to display stock data
function displayStockData(data: StockData): void {
  const stockDataDiv = document.getElementById('stockData') as HTMLElement;
  if (data.error) {
    stockDataDiv.innerText = `Error: ${data.error}`;
  } else {
    stockDataDiv.innerHTML = `
      <p>Logo URL: <img src="${data.logo_url}" alt="Logo" /></p>
      <p>Pre-market Price: ${data.preMarketPrice !== null ? data.preMarketPrice : 'N/A'}</p>
      <p>Regular Market Price: ${data.regularMarketPrice !== null ? data.regularMarketPrice : 'N/A'}</p>
    `;
  }
}

// Function to handle button click event
async function getStockData(): Promise<void> {
  const ticker = (document.getElementById('tickerInput') as HTMLInputElement).value;
  try {
    const data = await queryStock(ticker);
    displayStockData(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    (document.getElementById('stockData') as HTMLElement).innerText = 'Error fetching stock data';
  }
}

export const getPortfolioReview = async () => {
  try {
    const portfolioData = await viewPortfolio(); // Fetch portfolio data using viewPortfolio function
    const response = await api.post('/portfolio/review', { portfolio_data: portfolioData });
    return response.data;
  } catch (error) {
    console.error('Error getting portfolio review:', error);
    throw new Error('Error getting portfolio review');
  }
}



// Event listener for the button
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('button') as HTMLButtonElement;
  button.addEventListener('click', getStockData);
});



