// src/components/CategorySection.jsx
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

const categories = [
  { name: "Surgical", image: "/images/surgical.jpg" },
  { name: "Beauty", image: "/images/beauty.jpg" },
  { name: "Leather", image: "/images/leather.jpg" },
  { name: "Sportswear", image: "/images/sportswear.jpg" },
  { name: "Gloves", image: "/images/gloves.jpg" },
];

export default function CategorySection() {
  return (
    <div style={{ padding: '2rem 1rem' }}>
      <Typography variant="h5" gutterBottom>Product Categories</Typography>
      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.name}>
            <Link href={`/category/${cat.name.toLowerCase()}`} passHref>
              <Card>
                <CardActionArea>
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  <CardContent>
                    <Typography variant="h6">{cat.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
