//dummy just for now
// src/components/ProductCard.jsx
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

export default function ProductCard({ product }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2">{product.category}</Typography>
        <Button variant="outlined" href={`/product/${product.slug}`}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
