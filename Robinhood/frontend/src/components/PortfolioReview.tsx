import React, { useState } from 'react';
import { getPortfolioReview } from '../api';
import { Box, Button, Text, useToast } from '@chakra-ui/react';

const PortfolioReview: React.FC = () => {
  // State to store the generated portfolio review
  const [review, setReview] = useState<string>('');
  // Hook to display toast notifications
  const toast = useToast();

  // Function to handle generating the portfolio review
  const handleGenerateReview = async () => {
    try {
      // Fetch the portfolio review from the backend
      const reviewText = await getPortfolioReview();
      // Set the review state with the fetched review text
      setReview(reviewText);
      // Display a success toast notification
      toast({
        title: 'Portfolio review generated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating portfolio review:', error);
      // Display an error toast notification
      toast({
        title: 'Error generating portfolio review.',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mt={4} p={4} bg="purple.800" borderRadius="md" boxShadow="md">
      <Button colorScheme="purple" onClick={handleGenerateReview} mb={4}>
        Generate Review
      </Button>
      {review && (
        <Text color="white" whiteSpace="pre-wrap">
          {review}
        </Text>
      )}
    </Box>
  );
};

export default PortfolioReview;
