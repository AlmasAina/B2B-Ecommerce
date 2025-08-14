'use client';

import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
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
        px: 4,
        py: 6,
        backgroundColor: '#f1f8e9', // light green
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 5, color: '#2E7D32', fontWeight: 'bold', textAlign: 'center' }}
      >
        Shop by Category
      </Typography>

      <Grid container spacing={4}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.name}>
            <Link href={`/category/${cat.name.toLowerCase()}`} passHref>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                  },
                  backgroundColor: '#ffffff',
                }}
              >
                <CardActionArea>
                  <Box
                    component="img"
                    src={cat.image}
                    alt={cat.name}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: '#2E7D32' }}
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
    </Box>
  );
}
