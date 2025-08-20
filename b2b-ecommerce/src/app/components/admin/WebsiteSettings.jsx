// b2b-ecommerce/src/app/components/admin/WebsiteSettings.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton
} from '@mui/material';
import { PhotoCamera, Palette, Web } from '@mui/icons-material';

const WebsiteSettings = () => {
    const [websiteName, setWebsiteName] = useState('');
    const [websiteLogo, setWebsiteLogo] = useState('');
    const [colorTheme, setColorTheme] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // In a real application, you would fetch existing settings here on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/website-config'); // Assuming an API endpoint
                if (response.ok) {
                    const data = await response.json();
                    setWebsiteName(data.websiteName || '');
                    setWebsiteLogo(data.websiteLogo || '');
                    setColorTheme(data.colorTheme || '');
                } else if (response.status === 404) {
                    // No existing config, do nothing
                } else {
                    throw new Error('Failed to fetch website settings');
                }
            } catch (error) {
                console.error('Error fetching website settings:', error);
                setSnackbar({ open: true, message: 'Failed to load settings.', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/website-config', {
                method: 'POST', // or 'PUT' if updating an existing record
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ websiteName, websiteLogo, colorTheme }),
            });

            if (response.ok) {
                setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save settings.');
            }
        } catch (error) {
            console.error('Error saving website settings:', error);
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Website Settings
            </Typography>
            <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Website Name"
                        variant="outlined"
                        margin="normal"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Web />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Website Logo URL"
                        variant="outlined"
                        margin="normal"
                        value={websiteLogo}
                        onChange={(e) => setWebsiteLogo(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhotoCamera />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Color Theme"
                        variant="outlined"
                        margin="normal"
                        value={colorTheme}
                        onChange={(e) => setColorTheme(e.target.value)}
                        helperText="e.g., #RRGGBB, 'light', 'dark'"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Palette />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </Button>
                </form>
            </Paper>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default WebsiteSettings;