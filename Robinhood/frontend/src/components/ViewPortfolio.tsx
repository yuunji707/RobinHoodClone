import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Box, Heading, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';

// Component to view the portfolio
const ViewPortfolio: React.FC = () => {
  // Use the portfolio context to get the portfolio data and fetchPortfolio function
  const { portfolio, fetchPortfolio } = usePortfolio();
  // Set background and text color based on the color mode (light or dark)
  const bg = useColorModeValue('gray.700', 'gray.100'); 
  const color = useColorModeValue('white', 'black'); 

  // useEffect hook to fetch the portfolio when the component mounts
  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    // Box component for styling
    <Box bg={bg} p={4} borderRadius="md" color={color}>
      <Heading as="h2" size="lg" mb={4}>Portfolio</Heading>
      <Heading as="h3" size="md" mb={2}>Bought Stocks</Heading>
      {/* Check if there are any bought stocks in the portfolio */}
      {portfolio.bought_stocks.length === 0 ? (
        <Text>No bought stocks in portfolio</Text>
      ) : (
        // List of bought stocks
        <List spacing={3}>
          {portfolio.bought_stocks.map((stock, index) => (
            <ListItem key={index}>
              <Text>Ticker: {stock.ticker}, Quantity: {stock.quantity}, Date Bought: {stock.date_bought}</Text>
            </ListItem>
          ))}
        </List>
      )}
      <Heading as="h3" size="md" mb={2} mt={4}>Sold Stocks</Heading>
      {/* Check if there are any sold stocks in the portfolio */}
      {portfolio.sold_stocks.length === 0 ? (
        <Text>No sold stocks in portfolio</Text>
      ) : (
        // List of sold stocks
        <List spacing={3}>
          {portfolio.sold_stocks.map((stock, index) => (
            <ListItem key={index}>
              <Text>Ticker: {stock.ticker}, Quantity: {stock.quantity}, Date Sold: {stock.date_sold}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ViewPortfolio;
