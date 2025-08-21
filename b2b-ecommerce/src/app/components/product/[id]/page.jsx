// /app/product/[id]/page.js (Server-side version)
import { notFound } from 'next/navigation';

// Dummy data - replace this with your database call later
const getDummyProduct = (id) => {
  const dummyProducts = [
    {
      _id: '123',
      title: 'Surgical Scissors',
      description: 'Sharp and durable scissors for precise surgical procedures.',
      price: 25,
      image: 'https://via.placeholder.com/400x250?text=Surgical+Scissors',
      category: 'Surgical',
      slug: 'surgical-scissors'
    },
    {
      _id: '124',
      title: 'Beauty Kit',
      description: 'Professional beauty kit with all essential tools.',
      price: 45,
      image: 'https://via.placeholder.com/400x250?text=Beauty+Kit',
      category: 'Beauty',
      slug: 'beauty-kit'
    }
  ];

  return dummyProducts.find(p => p._id === id);
};

export default async function ProductDetail({ params }) {
  const product = getDummyProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img
            src={product.image}
            alt={product.title}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
            {product.title}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
            {product.description}
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32' }}>
              ${product.price}
            </span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Category:</strong> {product.category}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Product ID:</strong> {product._id}
          </div>
          <button
            style={{
              backgroundColor: 'var(--brand-color)',
              color: 'var(--brand-font-color)',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// Generate static params for build optimization
export async function generateStaticParams() {
  return [
    { id: '123' },
    { id: '124' }
  ];
}