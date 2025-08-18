'use client';

import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

const CategorySection = () => {
  const categories = [
    {
      title: "Surgical Instruments",
      description: "Premium surgical tools, scalpels, forceps, and medical instruments for healthcare professionals. High-grade stainless steel construction.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      slug: "surgical-instruments",
      features: ["Premium Quality", "Sterilized"],
      bgColor: "#f0f9ff"
    },
    {
      title: "Medical Gloves",
      description: "Latex-free nitrile gloves, surgical gloves, and examination gloves. Powder-free options available for sensitive skin.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop",
      slug: "medical-gloves", 
      features: ["Latex-Free", "Powder-Free"],
      bgColor: "#fdf4ff"
    },
    {
      title: "Makeup & Beauty Tools",
      description: "Professional makeup brushes, beauty tools, and cosmetic accessories. Perfect for salons and beauty professionals.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop",
      slug: "beauty-tools",
      features: ["Professional Grade", "Salon Quality"],
      bgColor: "#fff7ed"
    },
    {
      title: "Leather Medical Bags",
      description: "Durable leather medical bags, doctor bags, and professional cases. Handcrafted with premium leather materials.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      slug: "leather-products",
      features: ["Handcrafted", "Premium Leather"],
      bgColor: "#f0fdf4"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                overflow: 'hidden',
                border: 'none',
                boxShadow: 'none',
                backgroundColor: category.bgColor,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Box
                sx={{
                  height: 240,
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                  margin: '16px 16px 0 16px'
                }}
              />
              
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    color: '#333', 
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  {category.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666', 
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  {category.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  {category.features.map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        backgroundColor: '#4ade80',
                        color: '#fff',
                        px: 2,
                        py: 0.5,
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      {feature}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategorySection;