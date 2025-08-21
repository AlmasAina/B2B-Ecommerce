'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Simple context to share website configuration (name, logo, colors)
// across the entire frontend. This fetches from the backend once and
// provides the values to all components that need them.

const ThemeConfigContext = createContext({
  websiteName: 'B2B-eCommerce',
  websiteLogo: '/next.svg',
  colorTheme: '#1976d2',
  fontColor: 'white',
  loading: true,
});

export const useThemeConfig = () => useContext(ThemeConfigContext);

export default function ThemeConfigProvider({ children }) {
  const [config, setConfig] = useState({
    websiteName: 'B2B-eCommerce',
    websiteLogo: '/next.svg',
    colorTheme: '#1976d2',
    fontColor: 'white',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch theme configuration from the backend API.
    // This ensures that changes saved in the Admin panel are
    // reflected on the public-facing site without code changes.
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/website-config', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch website configuration');
        }
        const data = await res.json();
        setConfig({
          websiteName: data.websiteName || 'B2B-eCommerce',
          websiteLogo: data.websiteLogo || '/next.svg',
          colorTheme: data.colorTheme || '#1976d2',
          fontColor: data.fontColor || 'white',
        });
      } catch (err) {
        // If fetching fails, we keep defaults to avoid breaking the UI
        // and log the error for debugging.
        console.error('ThemeConfigProvider: Error fetching config', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Memoize the value to avoid unnecessary re-renders of consumers
  const value = useMemo(
    () => ({ ...config, loading }),
    [config, loading]
  );

  // Optionally, we could set CSS variables here so plain CSS can use them.
  // This keeps React and non-React styles in sync.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--brand-color', config.colorTheme);
      document.documentElement.style.setProperty('--brand-font-color', config.fontColor);
    }
  }, [config.colorTheme, config.fontColor]);

  return (
    <ThemeConfigContext.Provider value={value}>
      {children}
    </ThemeConfigContext.Provider>
  );
}

