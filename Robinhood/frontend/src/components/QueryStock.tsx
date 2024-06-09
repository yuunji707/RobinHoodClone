import React, { useState } from 'react';
import { queryStock, StockData } from '../api';
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Image,
  Text,
  useToast
} from '@chakra-ui/react';

const QueryStock: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [stockInfo, setStockInfo] = useState<StockData | null>(null);
  const toast = useToast();

  const handleQuery = async () => {
    try {
      const response = await queryStock(ticker);
      setStockInfo(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error fetching stock data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
              <Image src={stockInfo.symbol} alt={`${ticker} logo`} boxSize="50px" />
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