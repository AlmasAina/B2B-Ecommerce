'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Chip, FormControl, Select, MenuItem, InputLabel, CircularProgress } from '@mui/material';
import SEOHead from './SEOHead';
import ProductCard from './ProductCard';
import Navbar from './Navbar';

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          setAllProducts(data.products);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('Error fetching products');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sample fallback data in case API fails
  const sampleProducts = [
    // Surgical Instruments
    {
      _id: "1",
      title: "Premium Surgical Scissors",
      category: "Surgical Instruments",
      slug: "surgical-instruments",
      description: "High-grade stainless steel surgical scissors for precise medical procedures. Autoclave safe and corrosion resistant.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      price: 89.99,
      inStock: true
    },
    {
      _id: "2",
      title: "Medical Forceps Set",
      category: "Surgical Instruments", 
      slug: "surgical-instruments",
      description: "Professional forceps set with different sizes for various medical procedures.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      price: 124.99,
      inStock: true
    },
    {
      _id: "3",
      title: "Surgical Scalpel Set",
      category: "Surgical Instruments",
      slug: "surgical-instruments", 
      description: "Complete scalpel set with disposable blades for medical procedures.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      price: 67.99,
      inStock: true
    },
    
    // Medical Gloves
    {
      _id: "4",
      title: "Nitrile Examination Gloves",
      category: "Medical Gloves",
      slug: "medical-gloves",
      description: "Powder-free, latex-free nitrile gloves for medical examinations. Box of 100 pieces.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop",
      price: 24.99,
      inStock: true
    },
    {
      _id: "5",
      title: "Surgical Gloves Sterile",
      category: "Medical Gloves",
      slug: "medical-gloves",
      description: "Sterile surgical gloves for operating procedures. Latex-free and powder-free.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop",
      price: 45.99,
      inStock: true
    },
    {
      _id: "6",
      title: "Vinyl Examination Gloves",
      category: "Medical Gloves",
      slug: "medical-gloves",
      description: "Cost-effective vinyl gloves for general examination purposes.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop",
      price: 18.99,
      inStock: false
    },

    // Makeup & Beauty Tools  
    {
      _id: "7",
      title: "Professional Makeup Brush Set",
      category: "Makeup & Beauty Tools",
      slug: "beauty-tools",
      description: "Complete set of professional-grade makeup brushes for beauty salons and makeup artists.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop",
      price: 129.99,
      inStock: true
    },
    {
      _id: "8", 
      title: "Beauty Blender Set",
      category: "Makeup & Beauty Tools",
      slug: "beauty-tools",
      description: "High-quality beauty blenders for flawless makeup application.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop",
      price: 34.99,
      inStock: true
    },
    {
      _id: "9",
      title: "Professional Hair Styling Tools",
      category: "Makeup & Beauty Tools", 
      slug: "beauty-tools",
      description: "Complete hair styling kit with brushes, clips, and accessories.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop",
      price: 89.99,
      inStock: true
    },

    // Leather Products
    {
      _id: "10",
      title: "Premium Leather Doctor Bag",
      category: "Leather Medical Bags",
      slug: "leather-products", 
      description: "Handcrafted leather medical bag with multiple compartments for medical instruments.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      price: 299.99,
      inStock: true
    },
    {
      _id: "11",
      title: "Medical Instrument Case",
      category: "Leather Medical Bags",
      slug: "leather-products",
      description: "Durable leather case for storing and transporting medical instruments safely.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      price: 189.99,
      inStock: true
    },
    {
      _id: "12",
      title: "Professional Medical Portfolio",
      category: "Leather Medical Bags",
      slug: "leather-products",
      description: "Elegant leather portfolio for medical professionals with document storage.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", 
      price: 149.99,
      inStock: false
    }
  ];

  

  const categories = [
    { name: "All Products", slug: "all" },
    { name: "Surgical Instruments", slug: "surgical-instruments" },
    { name: "Medical Gloves", slug: "medical-gloves" }, 
    { name: "Makeup & Beauty Tools", slug: "beauty-tools" },
    { name: "Leather Medical Bags", slug: "leather-products" }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Use API data or fallback to sample data
  const productsToShow = allProducts.length > 0 ? allProducts : sampleProducts;

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "all" 
    ? productsToShow 
    : productsToShow.filter(product => 
        product.slug === selectedCategory || 
        product.category?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/\s+/g, '-') === selectedCategory
      );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high': 
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <>
      <SEOHead
        title="Shop - Medical & Beauty Supplies | MyStore"
        description="Browse our complete collection of surgical instruments, medical gloves, beauty tools, and leather products. Professional quality at wholesale prices."
        keywords="shop medical supplies, surgical instruments online, medical gloves store, beauty tools shopping"
        canonicalUrl="https://your-domain.com/shop"
      />

      <Navbar />

      {/* Shop Header */}
      <Box sx={{ backgroundColor: '#f9fafb', py: 6 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              color: '#333',
              fontWeight: 'bold',
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '2.5rem', md: '3rem' }
            }}
          >
            Shop Our Products
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Discover our comprehensive range of professional medical and beauty supplies
          </Typography>
        </Container>
      </Box>

      {/* Filters and Products */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: '#4ade80' }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ color: '#ef4444', mb: 2 }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{
                  backgroundColor: '#4ade80',
                  '&:hover': { backgroundColor: '#22c55e' }
                }}
              >
                Try Again
              </Button>
            </Box>
          ) : (
            <>
              {/* Category Filters */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
                  Product Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {categories.map((category) => (
                    <Chip
                      key={category.slug}
                      label={category.name}
                      onClick={() => setSelectedCategory(category.slug)}
                      sx={{
                        backgroundColor: selectedCategory === category.slug ? '#4ade80' : '#f3f4f6',
                        color: selectedCategory === category.slug ? '#fff' : '#333',
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        '&:hover': {
                          backgroundColor: selectedCategory === category.slug ? '#22c55e' : '#e5e7eb'
                        }
                      }}
                    />
                  ))}
                </Box>

                {/* Sort Options */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Showing {sortedProducts.length} products
                    {selectedCategory !== "all" && ` in ${categories.find(c => c.slug === selectedCategory)?.name}`}
                  </Typography>
                  
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ backgroundColor: '#fff' }}
                    >
                      <MenuItem value="name">Name (A-Z)</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Products Grid */}
              {sortedProducts.length > 0 ? (
                <Grid container spacing={4}>
                  {sortedProducts.map((product) => (
                    <Grid item xs={12} sm={6} lg={4} key={product._id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                    No products found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
                    Try selecting a different category or check back later.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedCategory("all")}
                    sx={{
                      backgroundColor: '#4ade80',
                      '&:hover': { backgroundColor: '#22c55e' }
                    }}
                  >
                    View All Products
                  </Button>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ backgroundColor: '#f9fafb', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                color: '#333', 
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Need Custom Orders?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                mb: 4,
                maxWidth: '500px',
                margin: '0 auto 2rem'
              }}
            >
              We offer bulk orders and custom solutions for your business needs
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/contact"
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: '#333',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '25px',
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: '#555'
                }
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Shop;