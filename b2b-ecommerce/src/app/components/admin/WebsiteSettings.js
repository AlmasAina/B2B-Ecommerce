// components/admin/WebsiteSettings.js
import React, { useState, useEffect } from 'react';

//import logo from '../../../../public/uploads/logos/logos.png'
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    IconButton,
    Paper,
    Chip
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Palette as PaletteIcon,
    Image as ImageIcon
} from '@mui/icons-material';

const WebsiteSettings = () => {
    const [settings, setSettings] = useState({
        websiteName: 'B2B-eCommerce',
        websiteLogo: '/next.svg',
        colorTheme: '#1976d2',
        fontColor: '#ffffff'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('/next.svg'); // Default preview

    // 100+ Color options with names and hex values
    const colorOptions = [
        // Primary Blues
        { name: 'Royal Blue', value: '#1976d2', category: 'Blue' },
        { name: 'Navy Blue', value: '#0d47a1', category: 'Blue' },
        { name: 'Sky Blue', value: '#03a9f4', category: 'Blue' },
        { name: 'Light Blue', value: '#81d4fa', category: 'Blue' },
        { name: 'Dark Blue', value: '#0277bd', category: 'Blue' },
        { name: 'Azure', value: '#2196f3', category: 'Blue' },
        { name: 'Cerulean', value: '#29b6f6', category: 'Blue' },
        { name: 'Steel Blue', value: '#1565c0', category: 'Blue' },

        // Greens
        { name: 'Forest Green', value: '#2e7d32', category: 'Green' },
        { name: 'Emerald', value: '#00c853', category: 'Green' },
        { name: 'Mint Green', value: '#4caf50', category: 'Green' },
        { name: 'Lime Green', value: '#8bc34a', category: 'Green' },
        { name: 'Sea Green', value: '#26a69a', category: 'Green' },
        { name: 'Jade', value: '#009688', category: 'Green' },
        { name: 'Teal', value: '#0097a7', category: 'Green' },
        { name: 'Olive', value: '#689f38', category: 'Green' },

        // Purples
        { name: 'Royal Purple', value: '#7b1fa2', category: 'Purple' },
        { name: 'Violet', value: '#9c27b0', category: 'Purple' },
        { name: 'Lavender', value: '#ba68c8', category: 'Purple' },
        { name: 'Indigo', value: '#303f9f', category: 'Purple' },
        { name: 'Deep Purple', value: '#512da8', category: 'Purple' },
        { name: 'Amethyst', value: '#8e24aa', category: 'Purple' },
        { name: 'Plum', value: '#ab47bc', category: 'Purple' },
        { name: 'Magenta', value: '#c2185b', category: 'Purple' },

        // Reds
        { name: 'Crimson', value: '#d32f2f', category: 'Red' },
        { name: 'Cherry Red', value: '#c62828', category: 'Red' },
        { name: 'Rose', value: '#e91e63', category: 'Red' },
        { name: 'Coral', value: '#ff5722', category: 'Red' },
        { name: 'Scarlet', value: '#f44336', category: 'Red' },
        { name: 'Burgundy', value: '#b71c1c', category: 'Red' },
        { name: 'Maroon', value: '#880e4f', category: 'Red' },
        { name: 'Ruby', value: '#e53935', category: 'Red' },

        // Oranges
        { name: 'Orange', value: '#f57c00', category: 'Orange' },
        { name: 'Tangerine', value: '#ff9800', category: 'Orange' },
        { name: 'Amber', value: '#ffc107', category: 'Orange' },
        { name: 'Peach', value: '#ffab91', category: 'Orange' },
        { name: 'Apricot', value: '#ffcc02', category: 'Orange' },
        { name: 'Burnt Orange', value: '#ef6c00', category: 'Orange' },
        { name: 'Copper', value: '#ff8f00', category: 'Orange' },
        { name: 'Sunset', value: '#ff6f00', category: 'Orange' },

        // Yellows
        { name: 'Golden Yellow', value: '#ffeb3b', category: 'Yellow' },
        { name: 'Lemon', value: '#fff176', category: 'Yellow' },
        { name: 'Sunshine', value: '#fdd835', category: 'Yellow' },
        { name: 'Mustard', value: '#f9a825', category: 'Yellow' },
        { name: 'Canary', value: '#ffee58', category: 'Yellow' },
        { name: 'Gold', value: '#ffc107', category: 'Yellow' },
        { name: 'Honey', value: '#ffb300', category: 'Yellow' },
        { name: 'Banana', value: '#fff59d', category: 'Yellow' },

        // Pinks
        { name: 'Hot Pink', value: '#e91e63', category: 'Pink' },
        { name: 'Rose Pink', value: '#f06292', category: 'Pink' },
        { name: 'Blush', value: '#ffcdd2', category: 'Pink' },
        { name: 'Fuchsia', value: '#ad1457', category: 'Pink' },
        { name: 'Salmon', value: '#ff8a80', category: 'Pink' },
        { name: 'Flamingo', value: '#ff4081', category: 'Pink' },
        { name: 'Bubblegum', value: '#f48fb1', category: 'Pink' },
        { name: 'Cherry Blossom', value: '#f8bbd9', category: 'Pink' },

        // Browns
        { name: 'Chocolate', value: '#5d4037', category: 'Brown' },
        { name: 'Coffee', value: '#6d4c41', category: 'Brown' },
        { name: 'Cocoa', value: '#8d6e63', category: 'Brown' },
        { name: 'Mocha', value: '#795548', category: 'Brown' },
        { name: 'Tan', value: '#a1887f', category: 'Brown' },
        { name: 'Sienna', value: '#bf360c', category: 'Brown' },
        { name: 'Rust', value: '#d84315', category: 'Brown' },
        { name: 'Mahogany', value: '#4e342e', category: 'Brown' },

        // Grays
        { name: 'Charcoal', value: '#424242', category: 'Gray' },
        { name: 'Slate Gray', value: '#607d8b', category: 'Gray' },
        { name: 'Steel Gray', value: '#78909c', category: 'Gray' },
        { name: 'Silver', value: '#9e9e9e', category: 'Gray' },
        { name: 'Ash Gray', value: '#757575', category: 'Gray' },
        { name: 'Storm Gray', value: '#546e7a', category: 'Gray' },
        { name: 'Pewter', value: '#90a4ae', category: 'Gray' },
        { name: 'Graphite', value: '#37474f', category: 'Gray' },

        // Unique Colors
        { name: 'Turquoise', value: '#1de9b6', category: 'Unique' },
        { name: 'Aqua', value: '#18ffff', category: 'Unique' },
        { name: 'Cyan', value: '#00bcd4', category: 'Unique' },
        { name: 'Electric Blue', value: '#2979ff', category: 'Unique' },
        { name: 'Neon Green', value: '#76ff03', category: 'Unique' },
        { name: 'Lime', value: '#cddc39', category: 'Unique' },
        { name: 'Electric Purple', value: '#651fff', category: 'Unique' },
        { name: 'Hot Magenta', value: '#ff1744', category: 'Unique' },

        // Pastels
        { name: 'Pastel Blue', value: '#bbdefb', category: 'Pastel' },
        { name: 'Pastel Green', value: '#c8e6c9', category: 'Pastel' },
        { name: 'Pastel Purple', value: '#e1bee7', category: 'Pastel' },
        { name: 'Pastel Pink', value: '#f8bbd9', category: 'Pastel' },
        { name: 'Pastel Yellow', value: '#fff9c4', category: 'Pastel' },
        { name: 'Pastel Orange', value: '#ffccbc', category: 'Pastel' },
        { name: 'Mint Cream', value: '#e0f2f1', category: 'Pastel' },
        { name: 'Lavender Mist', value: '#f3e5f5', category: 'Pastel' },

        // Dark Variants
        { name: 'Dark Slate', value: '#263238', category: 'Dark' },
        { name: 'Midnight Blue', value: '#1a237e', category: 'Dark' },
        { name: 'Dark Forest', value: '#1b5e20', category: 'Dark' },
        { name: 'Dark Purple', value: '#4a148c', category: 'Dark' },
        { name: 'Dark Red', value: '#b71c1c', category: 'Dark' },
        { name: 'Dark Orange', value: '#e65100', category: 'Dark' },
        { name: 'Dark Teal', value: '#004d40', category: 'Dark' },
        { name: 'Obsidian', value: '#212121', category: 'Dark' },

        // Light Variants
        { name: 'Light Blue', value: '#e3f2fd', category: 'Light' },
        { name: 'Light Green', value: '#e8f5e8', category: 'Light' },
        { name: 'Light Purple', value: '#f3e5f5', category: 'Light' },
        { name: 'Light Pink', value: '#fce4ec', category: 'Light' },
        { name: 'Light Orange', value: '#fff3e0', category: 'Light' },
        { name: 'Light Yellow', value: '#fffde7', category: 'Light' },
        { name: 'Light Gray', value: '#f5f5f5', category: 'Light' },
        { name: 'Cream', value: '#fffbf0', category: 'Light' }
    ];

    // Fetch current settings
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/website-config');
            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }

            const config = await response.json();

            const nextSettings = {
                websiteName: config.websiteName || 'B2B-eCommerce',
                websiteLogo: config.websiteLogo || '/next.svg',
                colorTheme: config.colorTheme || '#1976d2',
                fontColor: config.fontColor || '#ffffff'
            };

            setSettings(nextSettings);
            setLogoPreview(nextSettings.websiteLogo);
        } catch (error) {
            console.error('Error fetching settings:', error);
            showAlert('error', 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showAlert('error', 'Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showAlert('error', 'File size must be less than 5MB');
                return;
            }

            setLogoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadLogo = async () => {
        if (!logoFile) return settings.websiteLogo;

        const formData = new FormData();
        formData.append('logo', logoFile);

        try {
            const response = await fetch('/api/admin/upload-logo', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                return data.logoUrl;
            } else {
                throw new Error('Failed to upload logo');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            throw error;
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            let logoUrl = settings.websiteLogo;

            // Upload new logo if selected
            if (logoFile) {
                logoUrl = await uploadLogo();
            }

            const updatedSettings = {
                websiteName: settings.websiteName,
                websiteLogo: logoUrl,
                colorTheme: settings.colorTheme,
                fontColor: settings.fontColor
            };

            const response = await fetch('/api/website-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSettings),
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            const savedConfig = await response.json();
            const nextSettings = {
                websiteName: savedConfig.websiteName || updatedSettings.websiteName,
                websiteLogo: savedConfig.websiteLogo || updatedSettings.websiteLogo,
                colorTheme: savedConfig.colorTheme || updatedSettings.colorTheme,
                fontColor: savedConfig.fontColor || updatedSettings.fontColor
            };

            setSettings(nextSettings);
            setLogoFile(null);
            showAlert('success', 'Website settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            showAlert('error', error.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings({
            websiteName: 'B2B-eCommerce',
            websiteLogo: '/next.svg',
            colorTheme: '#1976d2',
            fontColor: '#ffffff'
        });
        setLogoPreview('/next.svg');
        setLogoFile(null);
        showAlert('info', 'Settings reset to default values');
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => {
            setAlert({ show: false, type: '', message: '' });
        }, 5000);
    };

    const groupedColors = colorOptions.reduce((acc, color) => {
        if (!acc[color.category]) {
            acc[color.category] = [];
        }
        acc[color.category].push(color);
        return acc;
    }, {});

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            {alert.show && (
                <Alert
                    severity={alert.type}
                    sx={{ mb: 2 }}
                    onClose={() => setAlert({ show: false, type: '', message: '' })}
                >
                    {alert.message}
                </Alert>
            )}

            <Card>
                <CardHeader
                    title={
                        <Box display="flex" alignItems="center" gap={1}>
                            <PaletteIcon />
                            <Typography variant="h5" component="h2">
                                Website Settings
                            </Typography>
                        </Box>
                    }
                    subheader="Configure your website name, logo, and color & font theme"
                />
                <CardContent>
                    <Grid container spacing={4}>
                        {/* 1) Website Name - stays on top */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Website Name"
                                value={settings.websiteName}
                                onChange={(e) => handleInputChange('websiteName', e.target.value)}
                                placeholder="Enter your website name"
                                required
                                helperText="Shown in navbar and throughout the site"
                                variant="outlined"
                            />
                        </Grid>

                        {/* 2) Logo Upload - immediately after name */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ImageIcon />
                                Website Logo
                            </Typography>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 3,
                                    border: '2px dashed #ccc',
                                    textAlign: 'center',
                                    backgroundColor: '#fafafa',
                                    borderRadius: 2
                                }}
                            >
                                <Box mb={2}>
                                    <Avatar
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mx: 'auto',
                                            border: '3px solid #ddd',
                                            boxShadow: 2
                                        }}
                                    />
                                </Box>

                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="logo-upload"
                                    type="file"
                                    onChange={handleLogoUpload}
                                />
                                <label htmlFor="logo-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ mb: 1 }}
                                        size="large"
                                    >
                                        Choose Logo
                                    </Button>
                                </label>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Upload an image file (PNG, JPG, GIF, WebP) - Max 5MB
                                </Typography>
                                {logoFile && (
                                    <Chip
                                        label={`Selected: ${logoFile.name}`}
                                        color="success"
                                        sx={{ mt: 1 }}
                                        size="small"
                                    />
                                )}
                            </Paper>
                        </Grid>

                        {/* 3) Color Theme Preview - side by side with logo */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Current Theme Preview
                            </Typography>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    backgroundColor: settings.colorTheme,
                                    color: settings.fontColor,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    minHeight: 150,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography variant="h5" gutterBottom>
                                    {settings.websiteName}
                                </Typography>
                                <Typography variant="body1">
                                    This is how your theme will look
                                </Typography>
                                <Chip
                                    label={settings.colorTheme.toUpperCase()}
                                    sx={{
                                        mt: 1,
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: settings.fontColor
                                    }}
                                />
                            </Paper>
                        </Grid>

                        {/* 4) Color Selection */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Choose Primary Color Theme
                            </Typography>
                            <Box sx={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                                {Object.entries(groupedColors).map(([category, colors]) => (
                                    <Box key={category} mb={3}>
                                        <Typography variant="subtitle1" fontWeight="bold" mb={1} color="primary">
                                            {category} Colors
                                        </Typography>
                                        <Grid container spacing={1}>
                                            {colors.map((color) => (
                                                <Grid item key={color.name}>
                                                    <Box
                                                        onClick={() => handleInputChange('colorTheme', color.value)}
                                                        sx={{
                                                            width: 50,
                                                            height: 50,
                                                            backgroundColor: color.value,
                                                            border: settings.colorTheme === color.value ? '3px solid #000' : '2px solid #fff',
                                                            borderRadius: 1,
                                                            cursor: 'pointer',
                                                            boxShadow: settings.colorTheme === color.value ? '0 0 0 2px #fff, 0 0 0 4px #000' : '0 2px 4px rgba(0,0,0,0.1)',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                transform: 'scale(1.1)',
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                                            }
                                                        }}
                                                        title={`${color.name} (${color.value})`}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Selected: {colorOptions.find(c => c.value === settings.colorTheme)?.name || 'Custom'} ({settings.colorTheme})
                            </Typography>
                        </Grid>

                        {/* 5) Font Color Selection */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Choose Font Color (30 options)
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {[
                                    '#FFFFFF', '#000000', '#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888',
                                    '#999999', '#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE', '#F5F5F5', '#E0E0E0', '#212121', '#424242',
                                    '#B71C1C', '#880E4F', '#4A148C', '#1A237E', '#0D47A1', '#004D40', '#1B5E20', '#E65100', '#BF360C', '#3E2723'
                                ].map((color) => (
                                    <Box
                                        key={color}
                                        onClick={() => handleInputChange('fontColor', color)}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: color,
                                            border: settings.fontColor === color ? '3px solid #000' : '2px solid #fff',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            boxShadow: settings.fontColor === color ? '0 0 0 2px #fff, 0 0 0 4px #000' : '0 2px 4px rgba(0,0,0,0.1)',
                                        }}
                                        title={color}
                                    />
                                ))}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Selected Font Color: {settings.fontColor}
                            </Typography>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                                <Button
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={handleReset}
                                    disabled={saving}
                                    size="large"
                                >
                                    Reset to Default
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                    onClick={handleSave}
                                    disabled={saving || !settings.websiteName.trim()}
                                    size="large"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default WebsiteSettings;