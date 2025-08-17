'use client';

import { Container, Typography, Button, Box, Grid } from '@mui/material';
import SEOHead from './SEOHead';
import CategorySection from './CategorySection';
import ProductCard from './ProductCard';
import Navbar from './Navbar';

const Home = () => {
  const products = [
    {
      name: "Surgical Scissors",
      category: "Surgical",
      image: "https://via.placeholder.com/400x250?text=Surgical+Scissors",
      slug: "surgical-scissors"
    },
    {
      name: "Leather Wallet",
      category: "Leather",
      image: "https://via.placeholder.com/400x250?text=Leather+Wallet",
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

      <Navbar />

      {/* Hero Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h3" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              Premium Surgical & Beauty Products
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', mb: 4, fontSize: '1.2rem' }}>
              Leading B2B Supplier of Surgical, Beauty, Leather & Sportswear Goods
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/category/all"
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                backgroundColor: '#388e3c',
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: '#2e7d32' }
              }}
            >
              Browse Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Category Section */}
      <Box sx={{ py: 6 }}>
        <CategorySection />
      </Box>

      {/* Featured Products Section
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              color: '#2e7d32', 
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4
            }}
          >
            Featured Products
          </Typography>
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.slug}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box> */}
    {/* </> </Container> */}
    </>
  );
};

export default Home;