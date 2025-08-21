'use client';

import { Container, Typography, Button, Box, Grid } from '@mui/material';
import SEOHead from './SEOHead';
import CategorySection from './CategorySection';
import ProductCard from './ProductCard';
import Navbar from './Navbar';
import { useThemeConfig } from '../ThemeConfigProvider';

const Home = () => {
  // Read theme config for dynamic colors across the homepage.
  const { colorTheme, fontColor } = useThemeConfig();
  const featuredProducts = [
    {
      _id: "1",
      title: "Premium Surgical Scissors",
      category: "Surgical",
      description: "High-grade stainless steel surgical scissors for precise medical procedures. Autoclave safe and corrosion resistant.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      price: 89.99
    },
    {
      _id: "2", 
      title: "Nitrile Examination Gloves",
      category: "Gloves",
      description: "Powder-free, latex-free nitrile gloves for medical examinations. Box of 100 pieces.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop",
      price: 24.99
    },
    {
      _id: "3",
      title: "Professional Makeup Brush Set",
      category: "Makeup",
      description: "Complete set of professional-grade makeup brushes for beauty salons and makeup artists.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop",
      price: 129.99
    }
  ];

  return (
    <>
      <SEOHead
        title="MediSupply Pro - Premium Medical & Beauty Supplies | Surgical Instruments, Gloves, Makeup Tools"
        description="Leading supplier of surgical instruments, medical gloves, beauty tools, and leather products. Wholesale prices for healthcare professionals and beauty businesses."
        keywords="surgical instruments, medical gloves, beauty tools, makeup brushes, leather medical bags, wholesale medical equipment, healthcare supplies"
        canonicalUrl="https://your-domain.com"
      />

      <Navbar />

      {/* Hero Section - ModestMuse Style */}
      {/* Hero Section uses neutral bg but CTA buttons use theme color */}
      <Box sx={{ backgroundColor: '#f9fafb', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  color: '#333',
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Professional Medical & Beauty Supplies
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#666',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
              >
                Your trusted partner for high-quality surgical instruments, medical gloves, beauty tools, and premium leather products. Serving healthcare professionals and beauty businesses worldwide.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Primary CTA uses the configured theme color */}
                <Button
                  variant="contained"
                  size="large"
                  href="/shop"
                  sx={{
                    px: 4,
                    py: 1.5,
                    backgroundColor: colorTheme,
                    color: fontColor,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '25px',
                    textTransform: 'none',
                    '&:hover': { 
                      backgroundColor: colorTheme,
                      opacity: 0.9
                    }
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="/contact"
                  sx={{
                    px: 4,
                    py: 1.5,
                    // Secondary CTA uses themed outline
                    borderColor: colorTheme,
                    color: colorTheme,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '25px',
                    textTransform: 'none',
                    '&:hover': { 
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      borderColor: colorTheme
                    }
                  }}
                >
                  Get Quote
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 400,
                  backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '16px'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Category Section */}
      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                color: '#333', 
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Our Product Categories
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              Discover our comprehensive range of medical and beauty supplies
            </Typography>
          </Box>
          <CategorySection />
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ backgroundColor: '#f9fafb', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                color: '#333', 
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Featured Products
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              Handpicked premium products for your business needs
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} lg={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section - ModestMuse Style */}
      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                color: '#333', 
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Why Choose MyStore?
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: '#4ade80', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem'
                  }}
                >
                  🏆
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  Premium Quality
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  All products meet international quality standards and certifications for professional use
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: '#4ade80', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem'
                  }}
                >
                  🚚
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  Fast Delivery
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Quick and reliable shipping worldwide with tracking and insurance included
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: '#4ade80', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem'
                  }}
                >
                  💰
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  Wholesale Prices
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Competitive wholesale pricing with bulk discounts for larger orders
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home;