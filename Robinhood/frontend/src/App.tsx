import React from 'react';
import { ChakraProvider, extendTheme, Box, Text, Container } from '@chakra-ui/react';
import QueryStock from './components/QueryStock';
import BuyStock from './components/BuyStock';
import ViewPortfolio from './components/ViewPortfolio';
import PortfolioReview from './components/PortfolioReview';
import { PortfolioProvider } from './context/PortfolioContext';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      100: '#f5e1ff',
      200: '#e4c7ff',
      300: '#d3adff',
      400: '#c192ff',
      500: '#b079ff',
      600: '#9d5fff',
      700: '#8b46ff',
      800: '#792eff',
      900: '#6515ff',
    },
  },
});

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <PortfolioProvider>
        <Container maxW="container.lg" p={4}>
          <AppBar />
          <QueryStock />
          <BuyStock />
          <ViewPortfolio />
          <PortfolioReview />
        </Container>
      </PortfolioProvider>
    </ChakraProvider>
  );
};

const AppBar: React.FC = () => (
  <Box bg="brand.900" p={4} mb={6}>
    <Text fontSize="xl" fontWeight="bold">Simple Robinhood Clone</Text>
  </Box>
);

export default App;
