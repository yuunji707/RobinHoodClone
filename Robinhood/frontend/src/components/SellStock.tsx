import React, { useState } from 'react';
import { usePortfolio  } from '../context/PortfolioContext';

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

const SellStock: React.FC = () => {
  // Context hook to access portfolio-related functions
  const { sellStockAndUpdatePortfolio } = usePortfolio();

  // State variables for managing ticker symbol, quantity, and submission status
  const [ticker, setTicker] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Chakra UI toast for showing feedback messages
  const toast = useToast();

  // Function to handle stock sale
  const handleSellStock = async () => {
    setSubmitted(true); // Mark form as submitted
    if (ticker && quantity > 0) {
      try {
        await sellStockAndUpdatePortfolio(ticker, quantity);
        toast({
          title: "Stock Sold",
          description: `${quantity} shares of ${ticker} sold successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Reset form fields and submission status
        setTicker('');
        setQuantity(0);
        setSubmitted(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error selling stock. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      // Show error toast if input is invalid
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
      <Heading as="h2" size="lg">Sell Stock</Heading>
      <Input
        placeholder="Ticker"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        isInvalid={submitted && !ticker} // Show red outline if input is invalid after submission
      />
      <NumberInput
        value={quantity}
        min={1}
        onChange={(valueString) => setQuantity(parseInt(valueString))}
        isInvalid={submitted && quantity <= 0} // Show red outline if input is invalid after submission
      >
        <NumberInputField placeholder="Quantity" />
      </NumberInput>
      <Button colorScheme="brand" onClick={handleSellStock}>Sell</Button>
    </VStack>
  );
};

export default SellStock;
