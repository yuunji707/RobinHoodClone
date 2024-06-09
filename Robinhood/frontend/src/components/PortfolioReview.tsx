import React, { useState } from 'react';
import { getPortfolioReview } from '../api';
import { Box, Button, Text, useToast } from '@chakra-ui/react';

const PortfolioReview: React.FC = () => {
  const [review, setReview] = useState<string>('');
  const toast = useToast();

  const handleGenerateReview = async () => {
    try {
      const reviewText = await getPortfolioReview();
      setReview(reviewText); // Set the review state directly from the response
      toast({
        title: 'Portfolio review generated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating portfolio review:', error);
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
