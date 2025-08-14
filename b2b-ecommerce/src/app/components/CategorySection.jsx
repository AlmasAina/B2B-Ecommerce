// src/components/CategorySection.jsx
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
    <Box sx={{ padding: '4rem 2rem', backgroundColor: '#F1F8E9' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 4, color: '#2E7D32', fontWeight: 600 }}
      >
        Shop by Category
      </Typography>

      <Grid container spacing={4}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.name}>
            <Link href={`/category/${cat.name.toLowerCase()}`} passHref>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardActionArea sx={{ height: '100%' }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '65%',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h6"
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
