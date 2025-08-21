'use client';

export default function Error({ error, reset }) {
  const message = typeof error?.message === 'string' ? error.message : 'An unexpected error occurred.';
  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong</h2>
      <p>{message}</p>
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
    </div>
  );
}

