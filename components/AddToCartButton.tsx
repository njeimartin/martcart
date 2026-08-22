'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const max = Math.max(1, stockQuantity);

  function add() {
    if (adding) return;
    setAdding(true);
    addToCart({ productId, name, slug, price, currency, imageUrl }, quantity);
    router.push('/checkout');
  }

  if (stockQuantity <= 0) return <button className="button dark" disabled>Out of stock</button>;

  return (
    <div className="cart-actions">
      <div className="quantity-control" aria-label="Quantity">
        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity(Math.min(max, quantity + 1))}>+</button>
      </div>
      <button type="button" className="button dark" onClick={add} disabled={adding}>
        {adding ? 'Opening checkout…' : 'Add to cart'}
      </button>
    </div>
  );
}
