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
import { useThemeConfig } from '../ThemeConfigProvider';

const Navbar = () => {
  // Access website config from the provider. This reflects Admin changes.
  const { websiteName, websiteLogo, colorTheme, fontColor } = useThemeConfig();

  return (
    <AppBar
      position="static"
      sx={{
        // Use theme color for the top bar background
        backgroundColor: colorTheme,
        color: fontColor,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Show logo if provided, else show a colored circle with initial */}
          {websiteLogo ? (
            <Box
              component="img"
              src={websiteLogo}
              alt={websiteName}
              sx={{ width: 40, height: 40, objectFit: 'contain', borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }}
            />
          ) : (
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: fontColor,
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              {websiteName?.charAt(0)?.toUpperCase() || 'W'}
            </Box>
          )}
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: fontColor }}>
            {websiteName}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Use fontColor for links and a subtle hover matching the bar */}
          <Button
            sx={{
              color: fontColor,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
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
              color: fontColor,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
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
              color: fontColor,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
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
              color: fontColor,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
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
              color: fontColor,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
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