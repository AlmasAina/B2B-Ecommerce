'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import ProductCard from '@/app/components/product/ProductCard';

export default function ProductListing() {
  const [products, setProducts] = useState([]);

  // Dummy data with proper IDs
  useEffect(() => {
    setProducts([
      {
        _id: '123', // This will match your URL /product/123
        title: 'Surgical Scissors',
        description: 'Sharp and durable scissors.',
        price: 25,
        image: 'https://via.placeholder.com/400x250?text=Surgical+Scissors',
        category: 'Surgical',
        slug: 'surgical-scissors'
      },
      {
        _id: '124', // You can access this via /product/124
        title: 'Beauty Kit',
        description: 'Professional beauty kit.',
        price: 45,
        image: 'https://via.placeholder.com/400x250?text=Beauty+Kit',
        category: 'Beauty',
        slug: 'beauty-kit'
      }
    ]);
  }, []);

  return (
    <Box sx={{ py: 6, backgroundColor: '#f9f9f9' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold', color: '#2E7D32' }}>
          All Products
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}