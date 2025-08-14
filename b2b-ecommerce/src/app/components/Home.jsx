// src/components/Home.jsx
'use client';

import { Container, Typography, Button, Box, Grid } from '@mui/material';
import SEOHead from './SEOHead';
import CategorySection from './CategorySection';
import ProductCard from './ProductCard';

const Home = () => {
  const products = [
    {
      name: "Surgical Scissors",
      category: "Surgical",
      image: "https://via.placeholder.com/300x200?text=Surgical+Scissors",
      slug: "surgical-scissors"
    },
    {
      name: "Leather Wallet",
      category: "Leather",
      image: "https://via.placeholder.com/300x200?text=Leather+Wallet",
      slug: "leather-wallet"
    }
  ];

  return (
    <>
      <SEOHead
        title="Top B2B Supplier for Surgical & Beauty Products | YourBrand"
        description="High-quality surgical instruments, beauty tools, leather goods, sportswear, and gloves — trusted B2B supplier."
        keywords="surgical, beauty, leather, B2B supplier, wholesale"
      />

      <Container maxWidth="lg">
        <Box textAlign="center" my={6}>
          <Typography variant="h3" gutterBottom>
            Premium Surgical & Beauty Products
          </Typography>
          <Typography variant="subtitle1">
            Leading B2B Supplier of Surgical, Beauty, Leather & Sportswear Goods
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/category/all"
            sx={{ mt: 3 }}
          >
            Browse Products
          </Button>
        </Box>

        <CategorySection />

        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Featured Products
          </Typography>
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.slug}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;
