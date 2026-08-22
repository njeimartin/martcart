'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addToCart } from '@/lib/cart';

type Props = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  stockQuantity: number;
};

export default function AddToCartButton({ productId, name, slug, price, currency, imageUrl, stockQuantity }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const max = Math.max(1, stockQuantity);

  function add() {
    addToCart({ productId, name, slug, price, currency, imageUrl }, quantity);
    setAdded(true);

    const returnTo = searchParams.get('returnTo');
    if (returnTo === '/cart') {
      window.setTimeout(() => router.push('/cart'), 250);
      return;
    }

    window.setTimeout(() => setAdded(false), 1800);
  }

  if (stockQuantity <= 0) return <button className="button dark" disabled>Out of stock</button>;

  return (
    <div className="cart-actions">
      <div className="quantity-control" aria-label="Quantity">
        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity(Math.min(max, quantity + 1))}>+</button>
      </div>
      <button type="button" className="button dark" onClick={add}>{added ? '✓ Added to cart' : 'Add to cart'}</button>
    </div>
  );
}
