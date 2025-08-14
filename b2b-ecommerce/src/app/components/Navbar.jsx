'use client';

import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#2e7d32', // Dark green
        color: '#fff' 
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          B2B Store
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button sx={{ color: '#fff' }} component={Link} href="/">Home</Button>
          <Button sx={{ color: '#fff' }} component={Link} href="/products">Products</Button>
          <Button sx={{ color: '#fff' }} component={Link} href="/about">About Us</Button>
          <Button sx={{ color: '#fff' }} component={Link} href="/contact">Contact</Button>
          <Button sx={{ color: '#fff' }} component={Link} href="/blog">Blog</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
