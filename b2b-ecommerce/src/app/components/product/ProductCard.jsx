// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Button,
//   CardActions,
//   Box,
// } from '@mui/material';
// import Link from 'next/link';

// export default function ProductCard({ product }) {
//   return (
//     <Card
//       sx={{
//         backgroundColor: 'white',
//         border: '1px solid #e0e0e0',
//         boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
//         borderRadius: 3,
//         overflow: 'hidden',
//         transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//         '&:hover': {
//           transform: 'translateY(-8px)',
//           boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
//         },
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <Box sx={{ position: 'relative' }}>
//         <CardMedia
//           component="img"
//           height="220"
//           image={product.image}
//           alt={product.name}
//           sx={{ 
//             objectFit: 'cover',
//             borderRadius: '12px 12px 0 0'
//           }}
//         />
//       </Box>
      
//       <CardContent sx={{ flexGrow: 1, p: 3 }}>
//         <Typography 
//           variant="h6" 
//           gutterBottom 
//           sx={{ 
//             color: '#2E7D32', 
//             fontWeight: 600,
//             fontSize: '1.1rem',
//             lineHeight: 1.3
//           }}
//         >
//           {product.name}
//         </Typography>
//         <Typography 
//           variant="body2" 
//           sx={{ 
//             color: '#666',
//             backgroundColor: '#f5f5f5',
//             px: 2,
//             py: 0.5,
//             borderRadius: 2,
//             display: 'inline-block',
//             fontSize: '0.9rem'
//           }}
//         >
//           {product.category}
//         </Typography>
//       </CardContent>
      
//       <CardActions sx={{ p: 3, pt: 0 }}>
//         <Link href={`/product/${product.slug}`} passHref style={{ width: '100%' }}>
//           <Button
//             fullWidth
//             variant="outlined"
//             sx={{
//               borderColor: '#2E7D32',
//               color: '#2E7D32',
//               py: 1,
//               fontWeight: 500,
//               borderRadius: 2,
//               '&:hover': {
//                 backgroundColor: '#2E7D32',
//                 borderColor: '#2E7D32',
//                 color: 'white',
//               },
//             }}
//           >
//             View Details
//           </Button>
//         </Link>
//       </CardActions>
//     </Card>
//   );
// }
import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';

export default function ProductCard({ product }) {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.title}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {product.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link href={`/product/${product._id}`} passHref>
            <Button variant="contained" color="primary" fullWidth>
              View Details
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}