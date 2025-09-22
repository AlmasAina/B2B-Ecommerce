// src/app/components/admin/ProductForm.jsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
    Box, Grid, Paper, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem,
    Switch, FormControlLabel, Chip, IconButton, Divider, Stack, Card, CardContent, CardHeader,
    InputAdornment, Alert, Accordion, AccordionSummary, AccordionDetails, Tooltip, Fab
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Publish as PublishIcon,
    ArrowBack as ArrowBackIcon,
    CloudUpload as UploadIcon,
    Visibility as VisibilityIcon,
    ExpandMore as ExpandMoreIcon,
    Info as InfoIcon,
    LocalOffer as DiscountIcon,
    FormatBold as BoldIcon,
    FormatItalic as ItalicIcon,
    FormatListBulleted as ListIcon,
    Link as LinkIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Helper functions
const isUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch {
        return false;
    }
};

const toSlug = (s) =>
    s.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

// Simple Rich Text Editor Component using MUI
const RichTextEditor = ({ value, onChange, placeholder, error, helperText }) => {
    const textAreaRef = React.useRef(null);

    const formatText = (prefix, suffix = '') => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);

        onChange(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.selectionStart = start + prefix.length;
            textarea.selectionEnd = end + prefix.length;
            textarea.focus();
        }, 0);
    };

    const insertList = () => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lines = value.substring(0, start).split('\n');
        const currentLine = lines[lines.length - 1];

        if (currentLine.trim() === '') {
            formatText('• ');
        } else {
            formatText('\n• ');
        }
    };

    return (
        <Box>
            {/* Simple Toolbar */}
            <Paper variant="outlined" sx={{ p: 1, mb: 1, display: 'flex', gap: 1 }}>
                <Tooltip title="Bold">
                    <IconButton
                        size="small"
                        onClick={() => formatText('**', '**')}
                    >
                        <BoldIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Italic">
                    <IconButton
                        size="small"
                        onClick={() => formatText('*', '*')}
                    >
                        <ItalicIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Bullet List">
                    <IconButton
                        size="small"
                        onClick={insertList}
                    >
                        <ListIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Link">
                    <IconButton
                        size="small"
                        onClick={() => formatText('[', '](url)')}
                    >
                        <LinkIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Typography variant="caption" sx={{ ml: 'auto', alignSelf: 'center', color: 'text.secondary' }}>
                    Use **bold**, *italic*, • for bullets
                </Typography>
            </Paper>

            <TextField
                inputRef={textAreaRef}
                multiline
                minRows={8}
                maxRows={15}
                fullWidth
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                error={error}
                helperText={helperText}
                variant="outlined"
                sx={{
                    '& .MuiInputBase-input': {
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        lineHeight: 1.5
                    }
                }}
            />
        </Box>
    );
};

// Dummy Data
const dummyData = {
    // Basic Info
    title: 'Professional Surgical Scissors Set - Premium Quality',
    slug: 'professional-surgical-scissors-set-premium-quality',
    sku: 'SSC-001-PRO',
    brand: 'MediCraft Industries',

    // Content
    description: `**Professional Grade Surgical Scissors Set**

These premium quality surgical scissors are crafted from *high-grade stainless steel* and designed for precision medical procedures.

**Key Features:**
• Superior cutting performance
• Ergonomic design for comfort
• Autoclave sterilizable
• Corrosion resistant coating

**Applications:**
• General surgery
• Dental procedures
• Veterinary use
• Medical training

**Specifications:**
Our scissors meet all international medical standards and are manufactured in ISO 13485 certified facilities.`,
    shortDescription: 'Premium surgical scissors set made from high-grade stainless steel, perfect for medical professionals requiring precision and reliability.',
    features: [
        'High-grade stainless steel construction',
        'Ergonomic handle design for comfort',
        'Precision-ground cutting edges',
        'Autoclave sterilizable up to 134°C',
        'Corrosion-resistant finish',
        'Available in multiple sizes'
    ],

    // Media
    media: [
        {
            url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600',
            alt: 'Professional surgical scissors set main view',
            type: 'image',
            isPrimary: true,
            sortOrder: 0,
            width: 800,
            height: 600
        },
        {
            url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600',
            alt: 'Close-up view of scissors precision tips',
            type: 'image',
            isPrimary: false,
            sortOrder: 1,
            width: 800,
            height: 600
        },
        {
            url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600',
            alt: 'Packaging and sterile environment',
            type: 'image',
            isPrimary: false,
            sortOrder: 2,
            width: 800,
            height: 600
        }
    ],
    videoUrls: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],

    // Pricing
    price: 125.00,
    salePrice: 99.99,
    currency: 'USD',

    // Inventory
    stock: 250,
    manageStock: true,
    inStock: true,
    lowStockThreshold: 25,

    // Categorization
    categories: ['surgical-instruments', 'medical-tools'],
    tags: ['surgical', 'scissors', 'stainless-steel', 'medical', 'professional', 'autoclave'],

    // Visibility
    visibility: 'visible',
    status: 'active',
    featured: true,

    // Specifications
    specifications: [
        { key: 'Material', value: 'High-grade stainless steel (316L)' },
        { key: 'Length', value: '5.5 inches (14 cm)' },
        { key: 'Weight', value: '45 grams' },
        { key: 'Sterilization', value: 'Autoclave compatible up to 134°C' },
        { key: 'Finish', value: 'Mirror polished with anti-slip texture' },
        { key: 'Certification', value: 'CE marked, FDA approved' },
        { key: 'Warranty', value: '2 years manufacturer warranty' }
    ],

    // B2B Quantity Discounts
    quantityDiscounts: [
        {
            minQty: 10,
            maxQty: 49,
            discountType: 'percent',
            discountValue: 5,
            note: 'Small wholesale discount'
        },
        {
            minQty: 50,
            maxQty: 99,
            discountType: 'percent',
            discountValue: 10,
            note: 'Medium bulk discount'
        },
        {
            minQty: 100,
            maxQty: 249,
            discountType: 'percent',
            discountValue: 15,
            note: 'Large bulk discount'
        },
        {
            minQty: 250,
            maxQty: '',
            discountType: 'percent',
            discountValue: 20,
            note: 'Enterprise volume discount'
        }
    ],
    previewQty: 50,

    // SEO
    metaTitle: 'Professional Surgical Scissors Set | Premium Medical Tools',
    metaDescription: 'High-quality surgical scissors made from premium stainless steel. Perfect for medical professionals. Autoclave sterilizable, ergonomic design.',
    metaKeywords: ['surgical scissors', 'medical instruments', 'stainless steel', 'professional tools']
};

// Initial data structures
const emptyMedia = { url: '', alt: '', type: 'image', isPrimary: false, sortOrder: 0, width: '', height: '' };
const emptySpec = { key: '', value: '' };
const emptyTier = { minQty: 10, maxQty: '', discountType: 'percent', discountValue: 5, note: '' };

export default function ProductForm({ product = null, isEdit = false }) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [useDummyData, setUseDummyData] = useState(false);

    // Form state - use dummy data if requested, otherwise use product data or empty
    const [formData, setFormData] = useState(() => {
        if (product) {
            // Edit mode with existing product
            return {
                title: product.title || '',
                slug: product.slug || '',
                sku: product.sku || '',
                brand: product.brand || '',
                description: product.description || '',
                shortDescription: product.shortDescription || '',
                features: product.features && product.features.length > 0 ? product.features : [''],
                media: product.media && product.media.length > 0 ? product.media : [emptyMedia],
                videoUrls: product.videoUrls && product.videoUrls.length > 0 ? product.videoUrls : [''],
                price: product.price || '',
                salePrice: product.salePrice || '',
                currency: product.currency || 'USD',
                stock: product.stock || 0,
                manageStock: product.manageStock ?? true,
                inStock: product.inStock ?? true,
                lowStockThreshold: product.lowStockThreshold || 5,
                categories: product.categories || [],
                tags: product.tags || [],
                tagInput: '',
                visibility: product.visibility || 'draft',
                status: product.status || 'active',
                featured: product.featured || false,
                specifications: product.specifications && product.specifications.length > 0 ? product.specifications : [emptySpec],
                quantityDiscounts: product.quantityDiscounts && product.quantityDiscounts.length > 0 ? product.quantityDiscounts : [emptyTier],
                previewQty: 1,
                metaTitle: product.metaTitle || '',
                metaDescription: product.metaDescription || '',
                metaKeywords: product.metaKeywords || []
            };
        } else {
            // New product mode - empty form
            return {
                title: '',
                slug: '',
                sku: '',
                brand: '',
                description: '',
                shortDescription: '',
                features: [''],
                media: [emptyMedia],
                videoUrls: [''],
                price: '',
                salePrice: '',
                currency: 'USD',
                stock: 0,
                manageStock: true,
                inStock: true,
                lowStockThreshold: 5,
                categories: [],
                tags: [],
                tagInput: '',
                visibility: 'draft',
                status: 'active',
                featured: false,
                specifications: [emptySpec],
                quantityDiscounts: [emptyTier],
                previewQty: 1,
                metaTitle: '',
                metaDescription: '',
                metaKeywords: []
            };
        }
    });

    // Load dummy data function
    const loadDummyData = () => {
        setFormData({ ...dummyData, tagInput: '', previewQty: dummyData.previewQty });
        setUseDummyData(true);
        setErrors({});
    };

    // Clear form function
    const clearForm = () => {
        setFormData({
            title: '', slug: '', sku: '', brand: '', description: '', shortDescription: '',
            features: [''], media: [emptyMedia], videoUrls: [''], price: '', salePrice: '',
            currency: 'USD', stock: 0, manageStock: true, inStock: true, lowStockThreshold: 5,
            categories: [], tags: [], tagInput: '', visibility: 'draft', status: 'active',
            featured: false, specifications: [emptySpec], quantityDiscounts: [emptyTier],
            previewQty: 1, metaTitle: '', metaDescription: '', metaKeywords: []
        });
        setUseDummyData(false);
        setErrors({});
    };

    // Validation rules
    const validators = {
        title: (val) => !val || val.trim().length < 3 ? 'Title must be at least 3 characters' : null,
        slug: (val) => !val ? 'Slug is required' : !/^[a-z0-9-]+$/.test(val) ? 'Invalid slug format' : null,
        description: (val) => !val || val.trim().length < 50 ? 'Description must be at least 50 characters' : null,
        price: (val) => !val || Number(val) <= 0 ? 'Price must be greater than 0' : null,
        salePrice: (val) => val && Number(val) >= Number(formData.price) ? 'Sale price must be less than regular price' : null,
        media: () => !formData.media.some(m => m.url && isUrl(m.url)) ? 'At least one valid media URL is required' : null
    };

    // Handle form field changes
    const handleFieldChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Auto-generate slug from title only if slug is empty
        if (field === 'title' && !formData.slug) {
            setFormData(prev => ({ ...prev, slug: toSlug(value) }));
        }

        // Clear related errors
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    }, [formData.slug, errors]);

    // Handle array field changes
    const handleArrayChange = useCallback((arrayName, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((item, i) =>
                i === index ? (field ? { ...item, [field]: value } : value) : item
            )
        }));
    }, []);

    // Add array item
    const addArrayItem = useCallback((arrayName, emptyItem) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], typeof emptyItem === 'object' ? { ...emptyItem } : emptyItem]
        }));
    }, []);

    // Remove array item
    const removeArrayItem = useCallback((arrayName, index) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    }, []);

    // Handle tag input
    const handleAddTag = useCallback(() => {
        const tag = formData.tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag],
                tagInput: ''
            }));
        }
    }, [formData.tagInput, formData.tags]);

    // Calculate preview price with quantity discounts
    const computedPreviewPrice = useMemo(() => {
        const base = formData.salePrice ? Number(formData.salePrice) : Number(formData.price || 0);
        if (!base) return { unitPrice: 0, totalPrice: 0, discountApplied: null };

        const qty = Number(formData.previewQty || 1);
        const validTiers = formData.quantityDiscounts.filter(d => d.minQty && d.discountValue);

        const applicableTier = validTiers
            .filter(t => qty >= Number(t.minQty) && (!t.maxQty || qty <= Number(t.maxQty)))
            .sort((a, b) => Number(b.minQty) - Number(a.minQty))[0];

        if (!applicableTier) {
            return {
                unitPrice: base,
                totalPrice: base * qty,
                discountApplied: null
            };
        }

        let discountedPrice = base;
        if (applicableTier.discountType === 'percent') {
            discountedPrice = base * (1 - applicableTier.discountValue / 100);
        } else {
            discountedPrice = base - applicableTier.discountValue;
        }

        discountedPrice = Math.max(0, Number(discountedPrice.toFixed(2)));

        return {
            unitPrice: discountedPrice,
            totalPrice: discountedPrice * qty,
            discountApplied: applicableTier
        };
    }, [formData.price, formData.salePrice, formData.previewQty, formData.quantityDiscounts]);

    // Form validation
    const validateForm = useCallback(() => {
        const newErrors = {};
        Object.keys(validators).forEach(field => {
            const error = validators[field](formData[field]);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle form submission
    const handleSubmit = async (isDraft = false) => {
        if (!validateForm()) {
            alert('Please fix validation errors before submitting.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                sku: formData.sku?.trim(),
                brand: formData.brand?.trim(),
                description: formData.description.trim(),
                shortDescription: formData.shortDescription?.trim(),
                features: formData.features.filter(Boolean).map(f => f.trim()),
                media: formData.media.filter(m => m.url).map(m => ({
                    ...m,
                    url: m.url.trim(),
                    alt: m.alt?.trim() || '',
                    width: m.width ? Number(m.width) : undefined,
                    height: m.height ? Number(m.height) : undefined
                })),
                videoUrls: formData.videoUrls.filter(Boolean).map(u => u.trim()),
                price: Number(formData.price),
                salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
                currency: formData.currency,
                stock: Number(formData.stock) || 0,
                manageStock: formData.manageStock,
                inStock: formData.inStock,
                lowStockThreshold: Number(formData.lowStockThreshold) || 5,
                categories: formData.categories,
                tags: formData.tags,
                visibility: isDraft ? 'draft' : 'visible',
                status: formData.status,
                featured: formData.featured,
                quantityDiscounts: formData.quantityDiscounts
                    .filter(d => d.minQty && d.discountValue)
                    .map(d => ({
                        minQty: Number(d.minQty),
                        maxQty: d.maxQty ? Number(d.maxQty) : undefined,
                        discountType: d.discountType,
                        discountValue: Number(d.discountValue),
                        note: d.note?.trim() || undefined
                    })),
                specifications: formData.specifications
                    .filter(s => s.key && s.value)
                    .map(s => ({ key: s.key.trim(), value: s.value.trim() })),
                metaTitle: formData.metaTitle?.trim(),
                metaDescription: formData.metaDescription?.trim(),
                metaKeywords: formData.metaKeywords
            };

            console.log('Product payload:', payload);

            // Here you would make API call
            // const response = await fetch('/api/products', { method: isEdit ? 'PUT' : 'POST', ... });

            alert(`Product ${isDraft ? 'saved as draft' : (isEdit ? 'updated' : 'published')} successfully!`);

            // Reset form or redirect
            // router.push('/admin/products');

        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
            {/* Header */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => router.back()} sx={{ color: '#666' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
                            {isEdit ? 'Edit Product' : 'Add New Product'}
                        </Typography>
                    </Box>

                    {/* Dummy Data Controls */}
                    {!isEdit && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                color="info"
                                onClick={loadDummyData}
                                disabled={useDummyData}
                                size="small"
                            >
                                Load Sample Data
                            </Button>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={clearForm}
                                size="small"
                            >
                                Clear Form
                            </Button>
                        </Box>
                    )}
                </Box>

                {useDummyData && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Sample data loaded! This includes dummy product information for testing purposes.
                    </Alert>
                )}
            </Paper>

            <Grid container spacing={3}>
                {/* Main Content */}
                <Grid item xs={12} lg={8}>
                    <Stack spacing={3}>
                        {/* Basic Information */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Product Information</Typography>

                            <Stack spacing={3}>
                                <TextField
                                    label="Product Title"
                                    placeholder="Enter product title"
                                    value={formData.title}
                                    onChange={(e) => handleFieldChange('title', e.target.value)}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    fullWidth
                                    required
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Product Slug"
                                            placeholder="product-slug"
                                            value={formData.slug}
                                            onChange={(e) => handleFieldChange('slug', e.target.value)}
                                            error={!!errors.slug}
                                            helperText={errors.slug || 'URL-friendly version of the title'}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            label="SKU"
                                            placeholder="PROD-001"
                                            value={formData.sku}
                                            onChange={(e) => handleFieldChange('sku', e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            label="Brand"
                                            placeholder="Brand Name"
                                            value={formData.brand}
                                            onChange={(e) => handleFieldChange('brand', e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Paper>

                        {/* Description */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Description</Typography>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(value) => handleFieldChange('description', value)}
                                placeholder="Write detailed product description..."
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </Paper>

                        {/* Media Gallery */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Product Media</Typography>
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => addArrayItem('media', emptyMedia)}
                                    variant="outlined"
                                    size="small"
                                >
                                    Add Media
                                </Button>
                            </Box>

                            <Stack spacing={2}>
                                {formData.media.map((media, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        label="Media URL"
                                                        placeholder="https://example.com/image.jpg"
                                                        value={media.url}
                                                        onChange={(e) => handleArrayChange('media', index, 'url', e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start"><UploadIcon /></InputAdornment>
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Type</InputLabel>
                                                        <Select
                                                            value={media.type}
                                                            label="Type"
                                                            onChange={(e) => handleArrayChange('media', index, 'type', e.target.value)}
                                                        >
                                                            <MenuItem value="image">Image</MenuItem>
                                                            <MenuItem value="video">Video</MenuItem>
                                                            <MenuItem value="embed">Embed</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField
                                                        label="Alt Text"
                                                        value={media.alt}
                                                        onChange={(e) => handleArrayChange('media', index, 'alt', e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <TextField
                                                        label="Width"
                                                        type="number"
                                                        value={media.width}
                                                        onChange={(e) => handleArrayChange('media', index, 'width', e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={1}>
                                                    <IconButton
                                                        onClick={() => removeArrayItem('media', index)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                            {errors.media && (
                                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                    {errors.media}
                                </Typography>
                            )}
                        </Paper>

                        {/* B2B Quantity Discounts */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DiscountIcon sx={{ color: '#1976d2' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>B2B Quantity Discounts</Typography>
                                    <Tooltip title="Set bulk pricing tiers for wholesale customers">
                                        <InfoIcon sx={{ color: '#666', fontSize: 20 }} />
                                    </Tooltip>
                                </Box>
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => addArrayItem('quantityDiscounts', emptyTier)}
                                    variant="outlined"
                                    size="small"
                                >
                                    Add Tier
                                </Button>
                            </Box>

                            <Stack spacing={2}>
                                {formData.quantityDiscounts.map((tier, index) => (
                                    <Card key={index} variant="outlined" sx={{ border: '2px solid #e3f2fd' }}>
                                        <CardContent>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} md={2}>
                                                    <TextField
                                                        label="Min Quantity"
                                                        type="number"
                                                        value={tier.minQty}
                                                        onChange={(e) => handleArrayChange('quantityDiscounts', index, 'minQty', e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <TextField
                                                        label="Max Quantity"
                                                        type="number"
                                                        value={tier.maxQty}
                                                        onChange={(e) => handleArrayChange('quantityDiscounts', index, 'maxQty', e.target.value)}
                                                        placeholder="No limit"
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Discount Type</InputLabel>
                                                        <Select
                                                            value={tier.discountType}
                                                            label="Discount Type"
                                                            onChange={(e) => handleArrayChange('quantityDiscounts', index, 'discountType', e.target.value)}
                                                        >
                                                            <MenuItem value="percent">Percentage %</MenuItem>
                                                            <MenuItem value="flat">Fixed Amount</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <TextField
                                                        label="Discount Value"
                                                        type="number"
                                                        value={tier.discountValue}
                                                        onChange={(e) => handleArrayChange('quantityDiscounts', index, 'discountValue', e.target.value)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    {tier.discountType === 'percent' ? '%' : formData.currency}
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        fullWidth
                                                        size="small"
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField
                                                        label="Note (Optional)"
                                                        value={tier.note}
                                                        onChange={(e) => handleArrayChange('quantityDiscounts', index, 'note', e.target.value)}
                                                        placeholder="e.g., Bulk discount"
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={1}>
                                                    <IconButton
                                                        onClick={() => removeArrayItem('quantityDiscounts', index)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>

                            {/* Quantity Discount Preview */}
                            <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                        Discount Preview
                                    </Typography>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                label="Preview Quantity"
                                                type="number"
                                                value={formData.previewQty}
                                                onChange={(e) => handleFieldChange('previewQty', e.target.value)}
                                                fullWidth
                                                size="small"
                                                inputProps={{ min: 1 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Base Price: <strong>{formData.salePrice || formData.price || 0} {formData.currency}</strong>
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Unit Price: <strong>{computedPreviewPrice.unitPrice} {formData.currency}</strong>
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Total: <strong>{computedPreviewPrice.totalPrice.toFixed(2)} {formData.currency}</strong>
                                                </Typography>
                                                {computedPreviewPrice.discountApplied && (
                                                    <Chip
                                                        label={`${computedPreviewPrice.discountApplied.discountValue}${computedPreviewPrice.discountApplied.discountType === 'percent' ? '%' : ` ${formData.currency}`} off`}
                                                        color="success"
                                                        size="small"
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Paper>

                        {/* Product Features */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Product Features</Typography>
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => addArrayItem('features', '')}
                                    variant="outlined"
                                    size="small"
                                >
                                    Add Feature
                                </Button>
                            </Box>

                            <Stack spacing={2}>
                                {formData.features.map((feature, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <TextField
                                            label={`Feature ${index + 1}`}
                                            value={feature}
                                            onChange={(e) => handleArrayChange('features', index, null, e.target.value)}
                                            fullWidth
                                            size="small"
                                            placeholder="e.g., Durable stainless steel construction"
                                        />
                                        <IconButton
                                            onClick={() => removeArrayItem('features', index)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>

                        {/* Product Specifications */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Product Specifications</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">Add detailed specifications</Typography>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() => addArrayItem('specifications', emptySpec)}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Add Spec
                                    </Button>
                                </Box>
                                <Stack spacing={2}>
                                    {formData.specifications.map((spec, index) => (
                                        <Grid container spacing={2} key={index} alignItems="center">
                                            <Grid item xs={5}>
                                                <TextField
                                                    label="Specification"
                                                    value={spec.key}
                                                    onChange={(e) => handleArrayChange('specifications', index, 'key', e.target.value)}
                                                    placeholder="e.g., Material"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Value"
                                                    value={spec.value}
                                                    onChange={(e) => handleArrayChange('specifications', index, 'value', e.target.value)}
                                                    placeholder="e.g., Stainless Steel"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <IconButton
                                                    onClick={() => removeArrayItem('specifications', index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>

                        {/* SEO Settings */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>SEO Settings</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Meta Title"
                                        value={formData.metaTitle}
                                        onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
                                        fullWidth
                                        size="small"
                                        helperText={`${formData.metaTitle.length}/60 characters - Recommended: 50-60 characters`}
                                        inputProps={{ maxLength: 60 }}
                                    />
                                    <TextField
                                        label="Meta Description"
                                        value={formData.metaDescription}
                                        onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        size="small"
                                        helperText={`${formData.metaDescription.length}/160 characters - Recommended: 150-160 characters`}
                                        inputProps={{ maxLength: 160 }}
                                    />
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </Grid>

                {/* Right Sidebar */}
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3} sx={{ position: 'sticky', top: 24 }}>
                        {/* Publish Box */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Publish</Typography>

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <VisibilityIcon sx={{ color: '#666', fontSize: 20 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Visibility: <strong>{formData.visibility}</strong>
                                    </Typography>
                                </Box>

                                <FormControl fullWidth size="small">
                                    <InputLabel>Visibility</InputLabel>
                                    <Select
                                        value={formData.visibility}
                                        label="Visibility"
                                        onChange={(e) => handleFieldChange('visibility', e.target.value)}
                                    >
                                        <MenuItem value="visible">Public</MenuItem>
                                        <MenuItem value="hidden">Hidden</MenuItem>
                                        <MenuItem value="draft">Draft</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.featured}
                                            onChange={(e) => handleFieldChange('featured', e.target.checked)}
                                        />
                                    }
                                    label="Featured Product"
                                />

                                <Divider />

                                <Stack spacing={1}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleSubmit(true)}
                                        disabled={saving}
                                        startIcon={<SaveIcon />}
                                        fullWidth
                                    >
                                        Save Draft
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSubmit(false)}
                                        disabled={saving}
                                        startIcon={<PublishIcon />}
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#2e7d32',
                                            '&:hover': { backgroundColor: '#1b5e20' }
                                        }}
                                    >
                                        {isEdit ? 'Update' : 'Publish'}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Paper>

                        {/* Pricing */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Pricing</Typography>

                            <Stack spacing={2}>
                                <TextField
                                    label="Regular Price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleFieldChange('price', e.target.value)}
                                    error={!!errors.price}
                                    helperText={errors.price}
                                    fullWidth
                                    size="small"
                                    required
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>
                                    }}
                                />

                                <TextField
                                    label="Sale Price"
                                    type="number"
                                    value={formData.salePrice}
                                    onChange={(e) => handleFieldChange('salePrice', e.target.value)}
                                    error={!!errors.salePrice}
                                    helperText={errors.salePrice}
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>
                                    }}
                                />

                                <FormControl fullWidth size="small">
                                    <InputLabel>Currency</InputLabel>
                                    <Select
                                        value={formData.currency}
                                        label="Currency"
                                        onChange={(e) => handleFieldChange('currency', e.target.value)}
                                    >
                                        <MenuItem value="USD">USD ($)</MenuItem>
                                        <MenuItem value="EUR">EUR (€)</MenuItem>
                                        <MenuItem value="GBP">GBP (£)</MenuItem>
                                        <MenuItem value="PKR">PKR (₨)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Paper>

                        {/* Inventory */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Inventory</Typography>

                            <Stack spacing={2}>
                                <TextField
                                    label="Stock Quantity"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => handleFieldChange('stock', e.target.value)}
                                    fullWidth
                                    size="small"
                                    inputProps={{ min: 0 }}
                                />

                                <TextField
                                    label="Low Stock Threshold"
                                    type="number"
                                    value={formData.lowStockThreshold}
                                    onChange={(e) => handleFieldChange('lowStockThreshold', e.target.value)}
                                    fullWidth
                                    size="small"
                                    inputProps={{ min: 0 }}
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.manageStock}
                                            onChange={(e) => handleFieldChange('manageStock', e.target.checked)}
                                        />
                                    }
                                    label="Track quantity"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.inStock}
                                            onChange={(e) => handleFieldChange('inStock', e.target.checked)}
                                        />
                                    }
                                    label="In stock"
                                />
                            </Stack>
                        </Paper>

                        {/* Categories & Tags */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Categories & Tags</Typography>

                            <Stack spacing={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Categories</InputLabel>
                                    <Select
                                        multiple
                                        value={formData.categories}
                                        label="Categories"
                                        onChange={(e) => handleFieldChange('categories', e.target.value)}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} size="small" />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        <MenuItem value="surgical-instruments">Surgical Instruments</MenuItem>
                                        <MenuItem value="medical-gloves">Medical Gloves</MenuItem>
                                        <MenuItem value="beauty-tools">Beauty Tools</MenuItem>
                                        <MenuItem value="leather-products">Leather Products</MenuItem>
                                        <MenuItem value="medical-tools">Medical Tools</MenuItem>
                                    </Select>
                                </FormControl>

                                <Box>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                        <TextField
                                            label="Add Tag"
                                            value={formData.tagInput}
                                            onChange={(e) => handleFieldChange('tagInput', e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddTag();
                                                }
                                            }}
                                            size="small"
                                            sx={{ flexGrow: 1 }}
                                        />
                                        <Button
                                            onClick={handleAddTag}
                                            variant="outlined"
                                            size="small"
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {formData.tags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                onDelete={() => removeArrayItem('tags', index)}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Short Description */}
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Short Description</Typography>
                            <TextField
                                label="Short Description"
                                value={formData.shortDescription}
                                onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                                size="small"
                                placeholder="Brief product summary for listings and previews..."
                                helperText="Used in product listings and search results"
                            />
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>

            {/* Floating Action Button for Mobile */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: { xs: 'block', lg: 'none' }
                }}
            >
                <Fab
                    color="primary"
                    onClick={() => handleSubmit(false)}
                    disabled={saving}
                    sx={{ backgroundColor: '#2e7d32' }}
                >
                    <PublishIcon />
                </Fab>
            </Box>
        </Box>
    );
}