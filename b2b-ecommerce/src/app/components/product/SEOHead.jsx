// src/components/SEOHead.jsx
import React from 'react';
import Head from 'next/head';


const SEOHead = ({
  title = "B2B eCommerce Platform",
  description = "Professional B2B eCommerce solution for industrial businesses",
  keywords = "B2B, eCommerce, industrial, business, wholesale, manufacturing",
  ogTitle,
  ogDescription,
  ogImage = "/images/og-default.jpg",
  canonicalUrl,
  noindex = false
}) => {
  const fullTitle = title.includes('B2B eCommerce') ? title : `${title} | B2B eCommerce Platform`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Head>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Robots Control */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="B2B eCommerce Platform" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicon & App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color */}
      <meta name="theme-color" content="#1976d2" />
      <meta name="msapplication-TileColor" content="#1976d2" />
    </Head>
  );
};

export default SEOHead;
