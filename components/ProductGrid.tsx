'use client';

import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  main_image_url: string | null;
  stock_quantity: number;
  categories: { name: string } | { name: string }[] | null;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <div className="container empty-products"><h2>No products yet</h2><p>Add products in Supabase and they will appear here automatically.</p></div>;
  }

  return (
    <div className="container product-grid">
      {products.map((product) => {
        const category = Array.isArray(product.categories) ? product.categories[0]?.name : product.categories?.name;
        return (
          <article className="product-card" key={product.id}>
            <Link href={`/shop/${product.slug}`} className="product-card-link" aria-label={`View ${product.name}`}>
              <div className="product-image">
                {product.main_image_url ? <img src={product.main_image_url} alt={product.name} /> : <span>{category?.charAt(0) ?? 'M'}</span>}
              </div>
              <div className="product-meta"><span>{category ?? 'MARTCART'}</span><strong>{product.stock_quantity > 0 ? 'In stock' : 'Out of stock'}</strong></div>
              <h2>{product.name}</h2>
              <p>${Number(product.price).toFixed(2)} {product.currency}</p>
            </Link>
            <div className="product-grid-actions">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                slug={product.slug}
                price={Number(product.price)}
                currency={product.currency}
                imageUrl={product.main_image_url}
                stockQuantity={product.stock_quantity}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
