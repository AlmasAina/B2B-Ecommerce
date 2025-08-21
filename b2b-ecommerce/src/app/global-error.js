'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ padding: 24 }}>
        <h2>Something went wrong!</h2>
        <p>{error?.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => reset?.()}
          style={{
            marginTop: 12,
            backgroundColor: 'var(--brand-color)',
            color: 'var(--brand-font-color)',
            padding: '8px 16px',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

