"use client";

import { useEffect, useState } from "react";
import { CartItem, cartTotal, getCart, removeFromCart, saveCart } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(getCart()), []);
  const total = cartTotal(items);

  function update(id: string, quantity: number) {
    const next = items.map((item) => item.productId === id ? { ...item, quantity: Math.max(1, quantity) } : item);
    setItems(next); saveCart(next);
  }

  function remove(id: string) { removeFromCart(id); setItems(getCart()); }

  return <main className="cart-page"><div className="container"><p className="eyebrow">YOUR CART</p><h1>Shopping cart.</h1>{items.length === 0 ? <div className="empty-products"><h2>Your cart is empty.</h2><p>Add something from the shop and it will appear here.</p><a className="button dark" href="/shop">Start shopping</a></div> : <div className="cart-layout"><div>{items.map(item => <div className="cart-row" key={item.productId}><div className="cart-thumb">{item.imageUrl ? <img src={item.imageUrl} alt="" /> : item.name.charAt(0)}</div><div className="cart-info"><h2>{item.name}</h2><p>${item.price.toFixed(2)} {item.currency}</p><div><button onClick={() => update(item.productId, item.quantity - 1)}>-</button><span>{item.quantity}</span><button onClick={() => update(item.productId, item.quantity + 1)}>+</button><button onClick={() => remove(item.productId)}>Remove</button></div></div><strong>${(item.price * item.quantity).toFixed(2)}</strong></div>)}</div><aside className="cart-summary"><p>Subtotal</p><h2>${total.toFixed(2)} USD</h2><p>Shipping and payment will be calculated at checkout.</p><button className="button dark" disabled>Checkout — coming next</button></aside></div>}</div></main>;
}
