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
//         backgroundColor: '#ffffff',
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
//                 color: '#ffffff',
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
import { useThemeConfig } from '../ThemeConfigProvider';

export default function ProductCard({ product }) {
  const { colorTheme, fontColor } = useThemeConfig();
  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #eaeaea',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      backgroundColor: '#ffffff',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.12)'
      }
    }}>
      <CardMedia
        component="img"
        height="240"
        image={product.image}
        alt={product.title}
        sx={{
          objectFit: 'cover',
          borderRadius: '12px',
          margin: '16px 16px 0 16px'
        }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            color: '#333',
            fontWeight: 'bold',
            mb: 1
          }}
        >
          {product.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            mb: 3,
            lineHeight: 1.6,
            color: '#666'
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#111827',
                fontWeight: 700
              }}
            >
              ${product.price}
            </Typography>
            <Box
              sx={{
                backgroundColor: colorTheme,
                color: fontColor,
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {product.category}
            </Box>
          </Box>

          <Link href={`/product/${product._id}`} passHref>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: colorTheme,
                color: fontColor,
                py: 1.2,
                borderRadius: '25px',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: colorTheme,
                  opacity: 0.9
                }
              }}
            >
              View Details
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}