// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

// const Navbar = () => {
//   return (
//     <AppBar 
//       position="static" 
//       sx={{ 
//         backgroundColor: '#2e7d32', // Dark green
//         color: '#fff' 
//       }}
//     >
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant="h6" component="div">
//           B2B Store
//         </Typography>

//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button sx={{ color: '#fff' }} component={Link} href="/">Home</Button>
//           <Button sx={{ color: '#fff' }} component={Link} href="/products">Products</Button>
//           <Button sx={{ color: '#fff' }} component={Link} href="/about">About Us</Button>
//           <Button sx={{ color: '#fff' }} component={Link} href="/contact">Contact</Button>
//           <Button sx={{ color: '#fff' }} component={Link} href="/blog">Blog</Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;


// Navbar.js
'use client';

import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#fff',
        color: '#333',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              backgroundColor: '#4ade80', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            M
          </Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
            MyStore
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button 
            sx={{ 
              color: '#333', 
              '&:hover': { backgroundColor: 'rgba(74, 222, 128, 0.1)' },
              textTransform: 'none',
              fontWeight: 500
            }} 
            component={Link} 
            href="/"
          >
            Home
          </Button>
          <Button 
            sx={{ 
              color: '#333', 
              '&:hover': { backgroundColor: 'rgba(74, 222, 128, 0.1)' },
              textTransform: 'none',
              fontWeight: 500
            }} 
            component={Link} 
            href="/shop"
          >
            Shop
          </Button>
          <Button 
            sx={{ 
              color: '#333', 
              '&:hover': { backgroundColor: 'rgba(74, 222, 128, 0.1)' },
              textTransform: 'none',
              fontWeight: 500
            }} 
            component={Link} 
            href="/about"
          >
            About Us
          </Button>
          <Button 
            sx={{ 
              color: '#333', 
              '&:hover': { backgroundColor: 'rgba(74, 222, 128, 0.1)' },
              textTransform: 'none',
              fontWeight: 500
            }} 
            component={Link} 
            href="/blog"
          >
            Blog
          </Button>
          <Button 
            sx={{ 
              color: '#333', 
              '&:hover': { backgroundColor: 'rgba(74, 222, 128, 0.1)' },
              textTransform: 'none',
              fontWeight: 500
            }} 
            component={Link} 
            href="/contact"
          >
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;