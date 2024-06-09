import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Box,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  VStack,
  Heading,
  useToast
} from '@chakra-ui/react';

const BuyStock: React.FC = () => {
  const { buyStockAndUpdatePortfolio } = usePortfolio();
  const [ticker, setTicker] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const toast = useToast();

  const handleBuyStock = async () => {
    if (ticker && quantity > 0) {
      await buyStockAndUpdatePortfolio(ticker, quantity);
      toast({
        title: "Stock Purchased",
        description: `${quantity} shares of ${ticker} purchased successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTicker('');
      setQuantity(0);
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid ticker and quantity.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading as="h2" size="lg">Buy Stock</Heading>
      <Input
        placeholder="Ticker"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />
      <NumberInput
        value={quantity}
        min={1}
        onChange={(valueString) => setQuantity(parseInt(valueString))}
      >
        <NumberInputField placeholder="Quantity" />
      </NumberInput>
      <Button colorScheme="brand" onClick={handleBuyStock}>Buy</Button>
    </VStack>
  );
};

export default BuyStock;
