import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Box, Heading, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';

const ViewPortfolio: React.FC = () => {
  // Destructure portfolio and fetchPortfolio from the context
  const { portfolio, fetchPortfolio } = usePortfolio();
  
  // Set background and text colors for light and dark modes
  const bg = useColorModeValue('gray.700', 'gray.100'); 
  const color = useColorModeValue('white', 'black'); 

  // Fetch portfolio data when the component mounts
  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <Box bg={bg} p={4} borderRadius="md" color={color}>
      <Heading as="h2" size="lg" mb={4}>Portfolio</Heading>
      {portfolio.length === 0 ? (
        // Display a message if the portfolio is empty
        <Text>No stocks in portfolio</Text>
      ) : (
        // Display a list of stocks in the portfolio
        <List spacing={3}>
          {portfolio.map((stock, index) => (
            <ListItem key={index}>
              <Text>Ticker: {stock.ticker}, Quantity: {stock.quantity}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ViewPortfolio;
