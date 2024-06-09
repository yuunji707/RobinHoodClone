import React, { useState } from 'react';
import { queryStock, StockData } from '../api';
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react';

const QueryStock: React.FC = () => {
  // State to store the stock ticker input
  const [ticker, setTicker] = useState<string>('');
  // State to store the fetched stock information
  const [stockInfo, setStockInfo] = useState<StockData | null>(null);
  // Hook to display toast notifications
  const toast = useToast();

  // Function to handle querying the stock information
  const handleQuery = async () => {
    try {
      // Fetch the stock information from the backend
      const response = await queryStock(ticker);
      // Set the stock information state with the fetched data
      setStockInfo(response);
    } catch (error) {
      console.error('Error querying stock data:', error);
      // Display an error toast notification
      toast({
        title: "Error",
        description: "Error fetching stock data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      // Set the stock information state with an error message
      setStockInfo({
        symbol: '',
        currentPrice: null,
        marketCap: null,
        error: 'Error fetching stock data',
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading as="h2" size="lg">Stock Data</Heading>
      <Input
        placeholder="Enter stock ticker"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />
      <Button colorScheme="brand" onClick={handleQuery}>Query Stock</Button>
      {stockInfo && (
        <Box bg="gray.800" p={4} borderRadius="md" boxShadow="md">
          <Heading as="h3" size="md">{ticker.toUpperCase()}</Heading>
          {stockInfo.error ? (
            <Text color="red.500">{stockInfo.error}</Text>
          ) : (
            <>
              <Text>Cost per Share: {stockInfo.currentPrice ?? 'N/A'}</Text>
              <Text>Market Cap: {stockInfo.marketCap ?? 'N/A'}</Text>
            </>
          )}
        </Box>
      )}
    </VStack>
  );
};

export default QueryStock;
