import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Box, Heading, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';

const ViewPortfolio: React.FC = () => {
  const { portfolio, fetchPortfolio } = usePortfolio();
  const bg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <Box bg={bg} p={4} borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>Portfolio</Heading>
      {portfolio.length === 0 ? (
        <Text>No stocks in portfolio</Text>
      ) : (
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
