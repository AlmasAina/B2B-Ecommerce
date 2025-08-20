import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Alert,
    Snackbar,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    IconButton,
    Paper,
    Divider
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Palette as PaletteIcon,
    Web as WebIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ColorPreviewBox = styled(Box)(({ theme, color }) => ({
    width: 40,
    height: 40,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: color,
    border: `2px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));

const WebsiteSettings = () => {
    const [formData, setFormData] = useState({
        websiteName: '',
        websiteLogo: '',
        colorTheme: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Predefined color themes
    const colorThemes = [
        { name: 'Blue Professional', value: '#1976d2', description: 'Classic professional blue' },
        { name: 'Green Nature', value: '#388e3c', description: 'Fresh and natural' },
        { name: 'Purple Innovation', value: '#7b1fa2', description: 'Creative and modern' },
        { name: 'Orange Energy', value: '#f57c00', description: 'Vibrant and energetic' },
        { name: 'Teal Modern', value: '#00796b', description: 'Contemporary and calm' },
        { name: 'Red Dynamic', value: '#d32f2f', description: 'Bold and powerful' },
        { name: 'Indigo Tech', value: '#303f9f', description: 'Tech-focused and trustworthy' },
        { name: 'Brown Earthy', value: '#5d4037', description: 'Warm and grounded' }
    ];

    // Load current settings on component mount
    useEffect(() => {
        loadWebsiteConfig();
    }, []);

    const loadWebsiteConfig = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/website-config');
            if (response.ok) {
                const config = await response.json();
                setFormData({
                    websiteName: config.websiteName || '',
                    websiteLogo: config.websiteLogo || '',
                    colorTheme: config.colorTheme || ''
                });
                setLogoPreview(config.websiteLogo || '');
            } else if (response.status === 404) {
                // No config exists yet, keep defaults
                console.log('No website config found, using defaults');
            }
        } catch (error) {
            console.error('Error loading website config:', error);
            showNotification('Error loading website settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please select a valid image file', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('File size should be less than 5MB', 'error');
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
        if (!logoFile) return null;

        const formDataUpload = new FormData();
        formDataUpload.append('logo', logoFile);

        try {
            const response = await fetch('/api/upload-logo', {
                method: 'POST',
                body: formDataUpload,
            });

            if (response.ok) {
                const { logoUrl } = await response.json();
                return logoUrl;
            } else {
                throw new Error('Logo upload failed');
            }
        } catch (error) {
            console.error('Logo upload error:', error);
            throw error;
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let logoUrl = formData.websiteLogo;

            // Upload new logo if selected
            if (logoFile) {
                logoUrl = await uploadLogo();
            }

            const configData = {
                ...formData,
                websiteLogo: logoUrl
            };

            const response = await fetch('/api/website-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configData),
            });

            if (response.ok) {
                const updatedConfig = await response.json();
                setFormData(updatedConfig);
                setLogoFile(null);
                showNotification('Website settings saved successfully!', 'success');
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Error saving settings. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const showNotification = (message, severity) => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            Loading website settings...
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={3}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                    <WebIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h5" component="h2" fontWeight="600">
                        Website Settings
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Website Name Section */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <WebIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="h6" fontWeight="500">
                                    Website Identity
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                label="Website Name"
                                value={formData.websiteName}
                                onChange={(e) => handleInputChange('websiteName', e.target.value)}
                                placeholder="Enter your website name"
                                helperText="This will appear in the browser title and header"
                                sx={{ mb: 2 }}
                            />
                        </Paper>
                    </Grid>

                    {/* Logo Section */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="h6" fontWeight="500">
                                    Website Logo
                                </Typography>
                            </Box>
                            
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Avatar
                                    src={logoPreview}
                                    sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        border: '2px dashed',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <ImageIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                                <Box>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<UploadIcon />}
                                        sx={{ mb: 1 }}
                                    >
                                        Upload Logo
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                        />
                                    </Button>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        Recommended: 200x200px, PNG or JPG, max 5MB
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Color Theme Section */}
                    <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" mb={3}>
                                <PaletteIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="h6" fontWeight="500">
                                    Color Theme
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                {colorThemes.map((theme) => (
                                    <Grid item xs={6} sm={4} md={3} key={theme.value}>
                                        <Paper
                                            elevation={formData.colorTheme === theme.value ? 3 : 1}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                border: formData.colorTheme === theme.value ? 
                                                    `2px solid ${theme.value}` : '2px solid transparent',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    elevation: 2,
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                            onClick={() => handleInputChange('colorTheme', theme.value)}
                                        >
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <ColorPreviewBox color={theme.value} />
                                                <Box ml={1.5}>
                                                    <Typography variant="subtitle2" fontWeight="500">
                                                        {theme.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {theme.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Custom Color Input */}
                            <Box mt={3}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="subtitle2" gutterBottom>
                                    Or enter a custom color:
                                </Typography>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <TextField
                                        label="Custom Color (Hex)"
                                        value={formData.colorTheme}
                                        onChange={(e) => handleInputChange('colorTheme', e.target.value)}
                                        placeholder="#1976d2"
                                        sx={{ width: 200 }}
                                    />
                                    <ColorPreviewBox 
                                        color={formData.colorTheme || '#e0e0e0'} 
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={loadWebsiteConfig}
                                disabled={saving}
                            >
                                Reset
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                onClick={handleSave}
                                disabled={saving || !formData.websiteName || !formData.colorTheme}
                                size="large"
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Preview Section */}
                {(formData.websiteName || formData.colorTheme) && (
                    <Box mt={4}>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="h6" gutterBottom>
                            Preview
                        </Typography>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 3, 
                                backgroundColor: formData.colorTheme || '#1976d2',
                                color: 'white',
                                borderRadius: 2
                            }}
                        >
                            <Box display="flex" alignItems="center">
                                {logoPreview && (
                                    <Avatar 
                                        src={logoPreview} 
                                        sx={{ mr: 2, width: 40, height: 40 }}
                                    />
                                )}
                                <Typography variant="h5" fontWeight="600">
                                    {formData.websiteName || 'Your Website Name'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </CardContent>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default WebsiteSettings;