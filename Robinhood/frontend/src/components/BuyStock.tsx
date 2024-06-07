import React, { useState } from 'react';
import { buyStock } from '../api';
import { TextField, Button, Typography, Container } from '@mui/material';

const BuyStock: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleBuy = async () => {
    await buyStock(ticker, quantity);
    alert('Stock purchased successfully');
  };

  return (
    <Container>
      <Typography variant="h4">Buy Stock</Typography>
      <TextField
        label="Stock Ticker"
        variant="outlined"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />
      <TextField
        label="Quantity"
        type="number"
        variant="outlined"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <Button variant="contained" color="primary" onClick={handleBuy}>Buy</Button>
    </Container>
  );
};

export default BuyStock;
