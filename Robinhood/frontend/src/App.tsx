import React from 'react';
import QueryStock from './components/QueryStock';
import BuyStock from './components/BuyStock';
import ViewPortfolio from './components/ViewPortfolio';
import PortfolioReview from './components/PortfolioReview';
import { PortfolioProvider } from './context/PortfolioContext';

import { Container, AppBar, Toolbar, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <PortfolioProvider>
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Simple Robinhood Clone</Typography>
        </Toolbar>
      </AppBar>
      <QueryStock />
      <BuyStock />
      <ViewPortfolio />
      <PortfolioReview />
    </Container>
    </PortfolioProvider>
  );
};

export default App;

