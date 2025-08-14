'use client';

import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Container,
} from '@mui/material';
import Link from 'next/link';

const categories = [
  { name: 'Surgical', image: '/images/surgical.jpg' },
  { name: 'Beauty', image: '/images/beauty.jpg' },
  { name: 'Leather', image: '/images/leather.jpg' },
  { name: 'Sportswear', image: '/images/sportswear.jpg' },
  { name: 'Gloves', image: '/images/gloves.jpg' },
];

export default function CategorySection() {
  return (
    <Box
      sx={{
        py: 6,
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ 
            mb: 5, 
            color: '#2E7D32', 
            fontWeight: 'bold', 
            textAlign: 'center' 
          }}
        >
          Shop by Category
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={cat.name}>
              <Link href={`/category/${cat.name.toLowerCase()}`} passHref>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '2px solid #f0f0f0',
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(46, 125, 50, 0.15)',
                      borderColor: '#2E7D32',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <CardActionArea>
                    <Box
                      component="img"
                      src={cat.image}
                      alt={cat.name}
                      sx={{
                        width: '100%',
                        height: 160,
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                    <CardContent 
                      sx={{ 
                        textAlign: 'center', 
                        py: 2.5,
                        backgroundColor: 'white'
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ 
                          fontWeight: 600, 
                          color: '#2E7D32',
                          fontSize: '1rem'
                        }}
                      >
                        {cat.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}