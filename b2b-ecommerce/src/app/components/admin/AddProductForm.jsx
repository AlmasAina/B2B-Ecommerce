import React, { useState } from 'react';
import {
    Box, Grid, TextField, Button, Tabs, Tab, Typography, Chip,
    Switch, FormControlLabel, Divider, Paper, IconButton,
    Alert, FormControl, InputLabel, Select, MenuItem,
    Accordion, AccordionSummary, AccordionDetails, Tooltip,
    Card, CardContent
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon
} from '@mui/icons-material';

export default function AddProductForm() {
    const [tab, setTab] = useState(0);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Basic fields
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // Content
    const [highlights, setHighlights] = useState(['']);
    const [descriptionHtml, setDescriptionHtml] = useState('');
    const [inTheBox, setInTheBox] = useState(['']);

    // Media
    const [media, setMedia] = useState([{ url: '', alt: '', type: 'image', isPrimary: false, sortOrder: 0 }]);
    const [videoUrls, setVideoUrls] = useState(['']);

    // Pricing & Inventory
    const [price, setPrice] = useState({ mrp: '', sale: '', currency: 'USD' });
    const [inventory, setInventory] = useState({ track: true, qty: 0, lowStockThreshold: 5 });

    // Specs
    const [specs, setSpecs] = useState([{ key: '', value: '' }]);

    // Shipping
    const [shipping, setShipping] = useState({
        weight: '',
        dimensions: { l: '', w: '', h: '' },
        originCountry: '',
        leadTimeDays: '',
        freeShipping: false
    });

    // Quantity discounts (B2B)
    const [quantityDiscounts, setQuantityDiscounts] = useState([
        { minQty: 10, maxQty: 49, discountType: 'percent', discountValue: 5, note: '' }
    ]);

    // Contact only & SEO
    const [contactOnly, setContactOnly] = useState(true);
    const [seo, setSeo] = useState({
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        ogImage: ''
    });

    // Validation rules
    const validateField = (field, value) => {
        switch (field) {
            case 'title':
                if (!value || value.trim().length < 3) return 'Title must be at least 3 characters long';
                if (value.length > 200) return 'Title must be less than 200 characters';
                break;
            case 'slug':
                if (!value) return 'Slug is required';
                if (!/^[a-z0-9-]+$/.test(value)) return 'Slug can only contain lowercase letters, numbers, and hyphens';
                if (value.length > 100) return 'Slug must be less than 100 characters';
                break;
            case 'brand':
                if (!value) return 'Brand is required';
                if (value.length < 2) return 'Brand must be at least 2 characters long';
                break;
            case 'category':
                if (!value) return 'Category is required';
                break;
            case 'price.mrp':
                if (!value || isNaN(value) || parseFloat(value) <= 0) return 'MRP must be a valid positive number';
                break;
            case 'price.sale':
                if (value && (isNaN(value) || parseFloat(value) <= 0)) return 'Sale price must be a valid positive number';
                if (value && price.mrp && parseFloat(value) > parseFloat(price.mrp)) return 'Sale price cannot be higher than MRP';
                break;
            case 'inventory.qty':
                if (inventory.track && (isNaN(value) || parseInt(value) < 0)) return 'Quantity must be a valid non-negative number';
                break;
            case 'descriptionHtml':
                if (!value || value.trim().length < 50) return 'Description must be at least 50 characters long';
                break;
            case 'media':
                if (!media.some(m => m.url && m.url.trim())) return 'At least one media item is required';
                break;
            default:
                return null;
        }
        return null;
    };

    const validateAllFields = () => {
        const newErrors = {};

        // Validate basic fields
        newErrors.title = validateField('title', title);
        newErrors.slug = validateField('slug', slug);
        newErrors.brand = validateField('brand', brand);
        newErrors.category = validateField('category', category);
        newErrors['price.mrp'] = validateField('price.mrp', price.mrp);
        newErrors['price.sale'] = validateField('price.sale', price.sale);
        newErrors['inventory.qty'] = validateField('inventory.qty', inventory.qty);
        newErrors.descriptionHtml = validateField('descriptionHtml', descriptionHtml);
        newErrors.media = validateField('media', media);

        // Validate highlights
        if (!highlights.some(h => h && h.trim())) {
            newErrors.highlights = 'At least one highlight is required';
        }

        // Validate media URLs
        media.forEach((m, index) => {
            if (m.url && !isValidUrl(m.url)) {
                newErrors[`media.${index}.url`] = 'Please enter a valid URL';
            }
        });

        // Validate video URLs
        videoUrls.forEach((url, index) => {
            if (url && !isValidUrl(url)) {
                newErrors[`videoUrl.${index}`] = 'Please enter a valid URL';
            }
        });

        // Validate specs
        const validSpecs = specs.filter(s => s.key && s.value);
        if (validSpecs.length === 0) {
            newErrors.specs = 'At least one specification is required';
        }

        // Remove null/undefined errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) delete newErrors[key];
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleFieldChange = (field, value) => {
        setTouched({ ...touched, [field]: true });
        const error = validateField(field, value);
        setErrors({ ...errors, [field]: error });
    };

    const addItem = (setter, template) => setter(prev => [...prev, { ...template }]);
    const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (value) => {
        setTitle(value);
        if (!slug || slug === generateSlug(title)) {
            setSlug(generateSlug(value));
        }
        handleFieldChange('title', value);
    };

    const getTabStatus = (tabIndex) => {
        const tabErrors = {
            0: ['title', 'slug', 'brand', 'category'],
            1: ['highlights', 'descriptionHtml'],
            2: ['media'],
            3: ['price.mrp', 'price.sale', 'inventory.qty'],
            4: ['specs'],
            5: [],
            6: []
        };

        const tabFields = tabErrors[tabIndex] || [];
        const hasErrors = tabFields.some(field => errors[field]);
        const allTouched = tabFields.every(field => touched[field]);

        if (hasErrors) return 'error';
        if (allTouched && !hasErrors) return 'success';
        return 'default';
    };

    const TabLabel = ({ label, index }) => {
        const status = getTabStatus(index);
        return (
            <Box display="flex" alignItems="center" gap={0.5}>
                {label}
                {status === 'error' && <ErrorIcon fontSize="small" color="error" />}
                {status === 'success' && <CheckCircleIcon fontSize="small" color="success" />}
            </Box>
        );
    };

    const handleSubmit = async () => {
        // Mark all fields as touched
        const allFields = ['title', 'slug', 'brand', 'category', 'price.mrp', 'price.sale', 'inventory.qty', 'descriptionHtml', 'media', 'highlights', 'specs'];
        const newTouched = {};
        allFields.forEach(field => newTouched[field] = true);
        setTouched(newTouched);

        if (!validateAllFields()) {
            alert('Please fix all validation errors before submitting');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                title: title.trim(),
                slug: slug.trim(),
                brand: brand.trim(),
                category,
                tags,
                highlights: highlights.filter(Boolean).map(h => h.trim()),
                descriptionHtml: descriptionHtml.trim(),
                inTheBox: inTheBox.filter(Boolean).map(item => item.trim()),
                media: media.filter(m => m.url).map(m => ({
                    ...m,
                    url: m.url.trim(),
                    alt: m.alt?.trim() || ''
                })),
                videoUrls: videoUrls.filter(Boolean).map(url => url.trim()),
                price: {
                    mrp: Number(price.mrp) || undefined,
                    sale: Number(price.sale) || undefined,
                    currency: price.currency || 'USD'
                },
                inventory: {
                    track: Boolean(inventory.track),
                    qty: Number(inventory.qty) || 0,
                    lowStockThreshold: Number(inventory.lowStockThreshold) || 5
                },
                specs: specs.filter(s => s.key && s.value).map(s => ({
                    key: s.key.trim(),
                    value: s.value.trim()
                })),
                shipping: {
                    weight: Number(shipping.weight) || undefined,
                    dimensions: {
                        l: Number(shipping.dimensions.l) || undefined,
                        w: Number(shipping.dimensions.w) || undefined,
                        h: Number(shipping.dimensions.h) || undefined
                    },
                    originCountry: shipping.originCountry?.trim() || undefined,
                    leadTimeDays: Number(shipping.leadTimeDays) || undefined,
                    freeShipping: shipping.freeShipping
                },
                quantityDiscounts: quantityDiscounts.filter(d => d.minQty && d.discountValue),
                contactOnly,
                seo: {
                    metaTitle: seo.metaTitle?.trim() || undefined,
                    metaDescription: seo.metaDescription?.trim() || undefined,
                    canonicalUrl: seo.canonicalUrl?.trim() || undefined,
                    ogImage: seo.ogImage?.trim() || undefined
                },
                status: { isPublished: false, isFeatured: false },
                searchCount: 0, // Initialize search count
                rating: { average: 0, count: 0 } // Initialize rating
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save product');
            }

            const json = await res.json();
            alert('Product created successfully!');

            // Reset form
            setTitle(''); setSlug(''); setBrand(''); setCategory(''); setTags([]); setTagInput('');
            setHighlights(['']); setDescriptionHtml(''); setInTheBox(['']);
            setMedia([{ url: '', alt: '', type: 'image', isPrimary: false, sortOrder: 0 }]);
            setVideoUrls(['']); setSpecs([{ key: '', value: '' }]);
            setErrors({}); setTouched({});

        } catch (e) {
            alert(e.message || 'Error creating product');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Add New Product</Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} variant="scrollable" scrollButtons="auto">
                <Tab label={<TabLabel label="Basic Info" index={0} />} />
                <Tab label={<TabLabel label="Content" index={1} />} />
                <Tab label={<TabLabel label="Media" index={2} />} />
                <Tab label={<TabLabel label="Pricing & Inventory" index={3} />} />
                <Tab label={<TabLabel label="Specifications" index={4} />} />
                <Tab label={<TabLabel label="B2B & Shipping" index={5} />} />
                <Tab label={<TabLabel label="SEO & Publish" index={6} />} />
            </Tabs>

            {/* Basic Info Tab */}
            {tab === 0 && (
                <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Product Title *"
                                fullWidth
                                value={title}
                                onChange={e => handleTitleChange(e.target.value)}
                                error={touched.title && !!errors.title}
                                helperText={touched.title && errors.title}
                                placeholder="Enter product title (min 3 characters)"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="URL Slug *"
                                fullWidth
                                value={slug}
                                onChange={e => {
                                    setSlug(e.target.value);
                                    handleFieldChange('slug', e.target.value);
                                }}
                                error={touched.slug && !!errors.slug}
                                helperText={touched.slug && errors.slug}
                                placeholder="product-url-slug"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Brand *"
                                fullWidth
                                value={brand}
                                onChange={e => {
                                    setBrand(e.target.value);
                                    handleFieldChange('brand', e.target.value);
                                }}
                                error={touched.brand && !!errors.brand}
                                helperText={touched.brand && errors.brand}
                                placeholder="Brand name"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={touched.category && !!errors.category}>
                                <InputLabel>Category *</InputLabel>
                                <Select
                                    value={category}
                                    onChange={e => {
                                        setCategory(e.target.value);
                                        handleFieldChange('category', e.target.value);
                                    }}
                                    label="Category *"
                                >
                                    <MenuItem value="electronics">Electronics</MenuItem>
                                    <MenuItem value="clothing">Clothing</MenuItem>
                                    <MenuItem value="home">Home & Garden</MenuItem>
                                    <MenuItem value="sports">Sports</MenuItem>
                                    <MenuItem value="books">Books</MenuItem>
                                </Select>
                                {touched.category && errors.category && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                        {errors.category}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <Box display="flex" gap={1} mb={1}>
                                    <TextField
                                        label="Add Tag"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyPress={e => {
                                            if (e.key === 'Enter' && tagInput.trim()) {
                                                setTags([...tags, tagInput.trim()]);
                                                setTagInput('');
                                            }
                                        }}
                                        placeholder="Enter tag and press Enter"
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            if (tagInput.trim()) {
                                                setTags([...tags, tagInput.trim()]);
                                                setTagInput('');
                                            }
                                        }}
                                    >
                                        Add
                                    </Button>
                                </Box>
                                <Box display="flex" gap={1} flexWrap="wrap">
                                    {tags.map((t, i) => (
                                        <Chip
                                            key={i}
                                            label={t}
                                            onDelete={() => setTags(tags.filter((_, idx) => idx !== i))}
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Content Tab */}
            {tab === 1 && (
                <Box>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Product Highlights *</Typography>
                            {highlights.map((h, idx) => (
                                <Box key={idx} display="flex" gap={1} mb={1}>
                                    <TextField
                                        fullWidth
                                        value={h}
                                        onChange={e => {
                                            const newHighlights = highlights.map((v, i) => i === idx ? e.target.value : v);
                                            setHighlights(newHighlights);
                                        }}
                                        placeholder={`Highlight ${idx + 1}`}
                                        error={touched.highlights && !!errors.highlights && !highlights.some(h => h.trim())}
                                    />
                                    <IconButton
                                        onClick={() => removeItem(setHighlights, idx)}
                                        disabled={highlights.length === 1}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={() => addItem(setHighlights, '')}>
                                Add Highlight
                            </Button>
                            {touched.highlights && errors.highlights && (
                                <Alert severity="error" sx={{ mt: 1 }}>{errors.highlights}</Alert>
                            )}
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <TextField
                                label="Product Description *"
                                fullWidth
                                multiline
                                minRows={6}
                                value={descriptionHtml}
                                onChange={e => {
                                    setDescriptionHtml(e.target.value);
                                    handleFieldChange('descriptionHtml', e.target.value);
                                }}
                                error={touched.descriptionHtml && !!errors.descriptionHtml}
                                helperText={touched.descriptionHtml && errors.descriptionHtml}
                                placeholder="Enter detailed product description (min 50 characters)"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>In The Box</Typography>
                            {inTheBox.map((item, idx) => (
                                <Box key={idx} display="flex" gap={1} mb={1}>
                                    <TextField
                                        fullWidth
                                        value={item}
                                        onChange={e => setInTheBox(inTheBox.map((v, i) => i === idx ? e.target.value : v))}
                                        placeholder={`Item ${idx + 1}`}
                                    />
                                    <IconButton onClick={() => removeItem(setInTheBox, idx)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={() => addItem(setInTheBox, '')}>
                                Add Item
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* Media Tab */}
            {tab === 2 && (
                <Box>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Product Images *</Typography>
                            {media.map((m, idx) => (
                                <Grid key={idx} container spacing={2} alignItems="center" sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Image URL *"
                                            value={m.url}
                                            onChange={e => setMedia(media.map((v, i) => i === idx ? { ...v, url: e.target.value } : v))}
                                            error={!!errors[`media.${idx}.url`]}
                                            helperText={errors[`media.${idx}.url`]}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Alt Text"
                                            value={m.alt}
                                            onChange={e => setMedia(media.map((v, i) => i === idx ? { ...v, alt: e.target.value } : v))}
                                            placeholder="Image description"
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <FormControl fullWidth>
                                            <InputLabel>Type</InputLabel>
                                            <Select
                                                value={m.type}
                                                onChange={e => setMedia(media.map((v, i) => i === idx ? { ...v, type: e.target.value } : v))}
                                                label="Type"
                                            >
                                                <MenuItem value="image">Image</MenuItem>
                                                <MenuItem value="video">Video</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            fullWidth
                                            label="Sort Order"
                                            type="number"
                                            value={m.sortOrder}
                                            onChange={e => setMedia(media.map((v, i) => i === idx ? { ...v, sortOrder: Number(e.target.value) } : v))}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <IconButton onClick={() => removeItem(setMedia, idx)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={() => addItem(setMedia, { url: '', alt: '', type: 'image', isPrimary: false, sortOrder: 0 })}>
                                Add Media
                            </Button>
                            {touched.media && errors.media && (
                                <Alert severity="error" sx={{ mt: 2 }}>{errors.media}</Alert>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Video URLs</Typography>
                            {videoUrls.map((v, idx) => (
                                <Box key={idx} display="flex" gap={1} mb={1}>
                                    <TextField
                                        fullWidth
                                        value={v}
                                        onChange={e => setVideoUrls(videoUrls.map((val, i) => i === idx ? e.target.value : val))}
                                        placeholder="https://youtube.com/watch?v=..."
                                        error={!!errors[`videoUrl.${idx}`]}
                                        helperText={errors[`videoUrl.${idx}`]}
                                    />
                                    <IconButton onClick={() => removeItem(setVideoUrls, idx)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={() => addItem(setVideoUrls, '')}>
                                Add Video URL
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* Continue with other tabs... */}
            {tab === 3 && (
                <Box>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Pricing *</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="MRP *"
                                        fullWidth
                                        type="number"
                                        value={price.mrp}
                                        onChange={e => {
                                            setPrice({ ...price, mrp: e.target.value });
                                            handleFieldChange('price.mrp', e.target.value);
                                        }}
                                        error={touched['price.mrp'] && !!errors['price.mrp']}
                                        helperText={touched['price.mrp'] && errors['price.mrp']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Sale Price"
                                        fullWidth
                                        type="number"
                                        value={price.sale}
                                        onChange={e => {
                                            setPrice({ ...price, sale: e.target.value });
                                            handleFieldChange('price.sale', e.target.value);
                                        }}
                                        error={touched['price.sale'] && !!errors['price.sale']}
                                        helperText={touched['price.sale'] && errors['price.sale']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Currency</InputLabel>
                                        <Select
                                            value={price.currency}
                                            onChange={e => setPrice({ ...price, currency: e.target.value })}
                                            label="Currency"
                                        >
                                            <MenuItem value="USD">USD</MenuItem>
                                            <MenuItem value="PKR">PKR</MenuItem>
                                            <MenuItem value="EUR">EUR</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Inventory</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Quantity"
                                        fullWidth
                                        type="number"
                                        value={inventory.qty}
                                        onChange={e => {
                                            setInventory({ ...inventory, qty: e.target.value });
                                            handleFieldChange('inventory.qty', e.target.value);
                                        }}
                                        error={touched['inventory.qty'] && !!errors['inventory.qty']}
                                        helperText={touched['inventory.qty'] && errors['inventory.qty']}
                                        disabled={!inventory.track}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Low Stock Threshold"
                                        fullWidth
                                        type="number"
                                        value={inventory.lowStockThreshold}
                                        onChange={e => setInventory({ ...inventory, lowStockThreshold: e.target.value })}
                                        disabled={!inventory.track}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={inventory.track}
                                                onChange={e => setInventory({ ...inventory, track: e.target.checked })}
                                            />
                                        }
                                        label="Track Inventory"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* Specifications Tab */}
            {tab === 4 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Product Specifications *</Typography>
                        {specs.map((s, idx) => (
                            <Grid key={idx} container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        label="Specification Name"
                                        fullWidth
                                        value={s.key}
                                        onChange={e => setSpecs(specs.map((v, i) => i === idx ? { ...v, key: e.target.value } : v))}
                                        placeholder="e.g., Weight, Dimensions, Color"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Value"
                                        fullWidth
                                        value={s.value}
                                        onChange={e => setSpecs(specs.map((v, i) => i === idx ? { ...v, value: e.target.value } : v))}
                                        placeholder="e.g., 1.5 kg, 30x20x10 cm, Black"
                                    />
                                </Grid>
                                <Grid item xs={12} md={1}>
                                    <IconButton onClick={() => removeItem(setSpecs, idx)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => addItem(setSpecs, { key: '', value: '' })}>
                            Add Specification
                        </Button>
                        {touched.specs && errors.specs && (
                            <Alert severity="error" sx={{ mt: 2 }}>{errors.specs}</Alert>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* B2B & Shipping Tab */}
            {tab === 5 && (
                <Box>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>B2B Quantity Discounts</Typography>
                            {quantityDiscounts.map((d, idx) => (
                                <Grid key={idx} container spacing={2} alignItems="center" sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            label="Min Qty"
                                            type="number"
                                            fullWidth
                                            value={d.minQty}
                                            onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, minQty: Number(e.target.value) } : v))}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            label="Max Qty"
                                            type="number"
                                            fullWidth
                                            value={d.maxQty || ''}
                                            onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, maxQty: Number(e.target.value) || undefined } : v))}
                                            placeholder="Optional"
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <FormControl fullWidth>
                                            <InputLabel>Discount Type</InputLabel>
                                            <Select
                                                value={d.discountType}
                                                onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, discountType: e.target.value } : v))}
                                                label="Discount Type"
                                            >
                                                <MenuItem value="percent">Percentage</MenuItem>
                                                <MenuItem value="amount">Fixed Amount</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            label="Discount Value"
                                            type="number"
                                            fullWidth
                                            value={d.discountValue}
                                            onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, discountValue: Number(e.target.value) } : v))}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            label="Note"
                                            fullWidth
                                            value={d.note || ''}
                                            onChange={e => setQuantityDiscounts(quantityDiscounts.map((v, i) => i === idx ? { ...v, note: e.target.value } : v))}
                                            placeholder="Optional note"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <IconButton onClick={() => removeItem(setQuantityDiscounts, idx)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={() => addItem(setQuantityDiscounts, { minQty: 10, discountType: 'percent', discountValue: 5 })}>
                                Add Discount Tier
                            </Button>

                            <Box sx={{ mt: 2 }}>
                                <FormControlLabel
                                    control={<Switch checked={contactOnly} onChange={e => setContactOnly(e.target.checked)} />}
                                    label="Contact Only (Hide Add to Cart Button)"
                                />
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Shipping Information</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        label="Weight (kg)"
                                        fullWidth
                                        type="number"
                                        value={shipping.weight}
                                        onChange={e => setShipping({ ...shipping, weight: e.target.value })}
                                        step="0.1"
                                    />
                                </Grid>
                                <Grid item xs={4} md={2}>
                                    <TextField
                                        label="Length (cm)"
                                        fullWidth
                                        type="number"
                                        value={shipping.dimensions.l}
                                        onChange={e => setShipping({ ...shipping, dimensions: { ...shipping.dimensions, l: e.target.value } })}
                                    />
                                </Grid>
                                <Grid item xs={4} md={2}>
                                    <TextField
                                        label="Width (cm)"
                                        fullWidth
                                        type="number"
                                        value={shipping.dimensions.w}
                                        onChange={e => setShipping({ ...shipping, dimensions: { ...shipping.dimensions, w: e.target.value } })}
                                    />
                                </Grid>
                                <Grid item xs={4} md={2}>
                                    <TextField
                                        label="Height (cm)"
                                        fullWidth
                                        type="number"
                                        value={shipping.dimensions.h}
                                        onChange={e => setShipping({ ...shipping, dimensions: { ...shipping.dimensions, h: e.target.value } })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        label="Origin Country"
                                        fullWidth
                                        value={shipping.originCountry}
                                        onChange={e => setShipping({ ...shipping, originCountry: e.target.value })}
                                        placeholder="e.g., Pakistan"
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <TextField
                                        label="Lead Time (Days)"
                                        fullWidth
                                        type="number"
                                        value={shipping.leadTimeDays}
                                        onChange={e => setShipping({ ...shipping, leadTimeDays: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={shipping.freeShipping}
                                                onChange={e => setShipping({ ...shipping, freeShipping: e.target.checked })}
                                            />
                                        }
                                        label="Free Shipping"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* SEO & Publish Tab */}
            {tab === 6 && (
                <Box>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>SEO Settings</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Meta Title"
                                        fullWidth
                                        value={seo.metaTitle}
                                        onChange={e => setSeo({ ...seo, metaTitle: e.target.value })}
                                        placeholder="Leave empty to use product title"
                                        helperText={`${seo.metaTitle?.length || 0}/60 characters`}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Meta Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={seo.metaDescription}
                                        onChange={e => setSeo({ ...seo, metaDescription: e.target.value })}
                                        placeholder="Brief description for search engines"
                                        helperText={`${seo.metaDescription?.length || 0}/160 characters`}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Canonical URL"
                                        fullWidth
                                        value={seo.canonicalUrl}
                                        onChange={e => setSeo({ ...seo, canonicalUrl: e.target.value })}
                                        placeholder="https://yoursite.com/products/product-slug"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="OG Image URL"
                                        fullWidth
                                        value={seo.ogImage}
                                        onChange={e => setSeo({ ...seo, ogImage: e.target.value })}
                                        placeholder="Image for social media sharing"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Publish Settings</Typography>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Product will be created as draft. You can publish it later from the product management page.
                            </Alert>

                            {Object.keys(errors).length > 0 && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Please fix the following errors:</Typography>
                                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                        {Object.entries(errors).map(([field, error]) => (
                                            <li key={field}><strong>{field}:</strong> {error}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            )}

                            <Box display="flex" gap={2} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                                            // Reset form or navigate away
                                            window.location.reload();
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={saving || Object.keys(errors).length > 0}
                                    sx={{ minWidth: 150 }}
                                >
                                    {saving ? 'Creating Product...' : 'Create Product'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Paper>
    );
}