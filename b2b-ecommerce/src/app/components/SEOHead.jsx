// src/components/SEOHead.jsx
import Head from 'next/head';

const SEOHead = ({ title, description, keywords }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charSet="utf-8" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default SEOHead;
