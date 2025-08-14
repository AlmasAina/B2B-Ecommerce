// src/components/ProductCard.jsx
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
} from '@mui/material';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Card
      sx={{
        backgroundColor: 'white',
        border: '1px solid #A5D6A7', // Light green border
        boxShadow: '0 2px 8px rgba(0, 128, 0, 0.1)', // Subtle green shadow
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          {product.category}
        </Typography>
      </CardContent>
      <CardActions sx={{ paddingLeft: 2, paddingBottom: 2 }}>
        <Link href={`/product/${product.slug}`} passHref>
          <Button
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#2E7D32',
              color: '#2E7D32',
              '&:hover': {
                backgroundColor: '#E8F5E9',
                borderColor: '#1B5E20',
                color: '#1B5E20',
              },
            }}
          >
            View Details
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
