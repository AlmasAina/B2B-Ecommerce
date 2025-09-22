// src/app/admin/products/add/page.js
'use client';

import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import ProductForm from '@/app/components/admin/ProductForm';

/**
 * Admin Add Product Page
 * 
 * This page provides a comprehensive product creation interface for admin users.
 * It includes all necessary fields for B2B eCommerce product management:
 * - Basic product information (title, slug, SKU, brand)
 * - Rich text description with Quill editor
 * - Media gallery management (images, videos, embeds)
 * - Pricing with B2B quantity discount tiers
 * - Inventory management
 * - Categories and tags
 * - SEO meta information
 * - Product specifications
 * 
 * The interface is designed to mimic WooCommerce admin for familiarity.
 */
export default function AddProductPage() {
    return (
        <>
            {/* Page Header with Breadcrumbs */}
            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #e0e0e0',
                    py: 2,
                    mb: 0
                }}
            >
                <Container maxWidth="xl">
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                        sx={{ mb: 2 }}
                    >
                        <Link
                            color="inherit"
                            href="/admin/dashboard"
                            sx={{
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Dashboard
                        </Link>
                        <Link
                            color="inherit"
                            href="/admin/products"
                            sx={{
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Products
                        </Link>
                        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                            Add New Product
                        </Typography>
                    </Breadcrumbs>

                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            color: '#1a1a1a',
                            mb: 1
                        }}
                    >
                        Add New Product
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ maxWidth: 600 }}
                    >
                        Create a new product for your B2B catalog. Fill in all required information
                        including pricing, inventory, and media to provide the best experience for your customers.
                    </Typography>
                </Container>
            </Box>

            {/* Main Content */}
            <Box sx={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 200px)' }}>
                <Container maxWidth="xl" sx={{ py: 0 }}>
                    <ProductForm isEdit={false} />
                </Container>
            </Box>
        </>
    );
}

/**
 * Page Configuration
 * 
 * This page is part of the admin area and requires authentication.
 * Consider adding auth middleware or guards in production.
 */

// Optional: Add metadata for better SEO and page identification
export const metadata = {
    title: 'Add New Product - Admin Dashboard',
    description: 'Create new products for your B2B eCommerce platform',
    robots: 'noindex,nofollow' // Admin pages should not be indexed
};