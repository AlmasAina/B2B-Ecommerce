// 'use client';

// import {
//   Grid,
//   Card,
//   CardActionArea,
//   CardContent,
//   Typography,
//   Box,
//   Container,
// } from '@mui/material';
// import Link from 'next/link';

// const categories = [
//   { name: 'Surgical', image: '/images/surgical.jpg' },
//   { name: 'Beauty', image: '/images/beauty.jpg' },
//   { name: 'Leather', image: '/images/leather.jpg' },
//   { name: 'Sportswear', image: '/images/sportswear.jpg' },
//   { name: 'Gloves', image: '/images/gloves.jpg' },
// ];

// export default function CategorySection() {
//   return (
//     <Box sx={{ py: 6, backgroundColor: '#ffffff' }}>
//       <Container maxWidth="lg">
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{
//             mb: 5,
//             color: '#2E7D32',
//             fontWeight: 'bold',
//             textAlign: 'center',
//           }}
//         >
//           Shop by Category
//         </Typography>

//         <Grid container spacing={4} justifyContent="center">
//           {categories.map((cat) => (
//             <Grid item xs={6} sm={4} md={2.4} key={cat.name}>
//               <Link href={`/category/${cat.name.toLowerCase()}`} passHref>
//                 <Card
//                   elevation={3}
//                   sx={{
//                     borderRadius: 2,
//                     overflow: 'hidden',
//                     transition: 'all 0.3s ease',
//                     backgroundColor: '#ffffff',
//                     aspectRatio: '1 / 1.2', // Makes cards nearly square
//                     display: 'flex',
//                     flexDirection: 'column',
//                     '&:hover': {
//                       transform: 'translateY(-5px)',
//                       boxShadow: '0 12px 25px rgba(46, 125, 50, 0.15)',
//                       borderColor: '#2E7D32',
//                     },
//                   }}
//                 >
//                   <CardActionArea sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//                     <Box
//                       component="img"
//                       src={cat.image}
//                       alt={cat.name}
//                       sx={{
//                         width: '100%',
//                         height: '70%',
//                         objectFit: 'cover',
//                       }}
//                     />
//                     <CardContent
//                       sx={{
//                         textAlign: 'center',
//                         height: '30%',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         backgroundColor: '#ffffff',
//                       }}
//                     >
//                       <Typography
//                         variant="subtitle1"
//                         sx={{
//                           fontWeight: 600,
//                           color: '#2E7D32',
//                           fontSize: '1rem',
//                         }}
//                       >
//                         {cat.name}
//                       </Typography>
//                     </CardContent>
//                   </CardActionArea>
//                 </Card>
//               </Link>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// }


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
    <Box sx={{ py: 8, backgroundColor: '#f1f8e9' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: '#2E7D32', fontWeight: 700 }}
        >
          Shop by Category
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={cat.name}>
              <Link href={`/category/${cat.name.toLowerCase()}`} passHref>
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardActionArea sx={{ height: '100%' }}>
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
      </Container>
    </Box>
  );
}
