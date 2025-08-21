'use client';

import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material/styles';
import { useThemeConfig } from './ThemeConfigProvider.jsx';

export default function MuiThemeProvider({ children }) {
    const { colorTheme, fontColor } = useThemeConfig();

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: 'light',
                primary: {
                    main: colorTheme || '#1976d2',
                    contrastText: fontColor || '#ffffff',
                },
            },
            shape: {
                borderRadius: 12,
            },
            components: {
                MuiAppBar: {
                    styleOverrides: {
                        colorPrimary: {
                            backgroundColor: colorTheme || '#1976d2',
                            color: fontColor || '#ffffff',
                        },
                    },
                },
            },
        });
    }, [colorTheme, fontColor]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

