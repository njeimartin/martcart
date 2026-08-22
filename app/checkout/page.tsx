"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartTotal, getCart, type CartItem } from "@/lib/cart";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(() => cartTotal(items), [items]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const address = String(form.get("address") || "").trim();
    const city = String(form.get("city") || "").trim();
    const country = String(form.get("country") || "").trim();

    if (!items.length) { setError("Your cart is empty. Add a product before checkout."); return; }
    if (!name || !email || !phone || !address || !city || !country) { setError("Please complete all shipping information before continuing."); return; }
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customerEmail: email, shipping: { name, phone, address, city, country } }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout details were saved, but payment is not configured yet. We will connect the payment method last.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue checkout.");
      setLoading(false);
    }
  }

  if (!items.length) return (
    <main className="checkout-page"><div className="container checkout-wrap">
      <p className="eyebrow">MARTCART CHECKOUT</p><h1>Your cart is empty.</h1>
      <p className="checkout-note">Add a product to your cart before continuing to checkout.</p>
      <Link className="button dark" href="/shop">Continue shopping</Link>
    </div></main>
  );

  return (
    <main className="checkout-page"><div className="container checkout-wrap">
      <div className="checkout-heading"><p className="eyebrow">MARTCART CHECKOUT</p><h1>Complete your order.</h1>
        <p className="checkout-note">Review your order and enter your shipping information. Payment configuration will be connected at the final stage.</p>
        <Link className="back-link" href="/shop">← Back to shop / Add more products</Link>
      </div>
      <div className="checkout-layout">
        <form className="checkout-card" onSubmit={handleSubmit} noValidate>
          <h2>Shipping information</h2>
          <label>Full name<input name="name" required autoComplete="name" placeholder="Your full name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
          <label>Phone<input name="phone" type="tel" required autoComplete="tel" placeholder="Phone number" /></label>
          <label>Address<input name="address" required autoComplete="street-address" placeholder="Street address" /></label>
          <div className="two-col"><label>City<input name="city" required autoComplete="address-level2" placeholder="City" /></label><label>Country<input name="country" required autoComplete="country-name" defaultValue="Cameroon" /></label></div>
          {error && <p className="checkout-error" role="alert">{error}</p>}
          <button className="button dark checkout-button" type="submit" disabled={loading}>{loading ? "Processing…" : "Continue to payment"}</button>
          <Link className="back-link" href="/cart">← Back to cart</Link>
        </form>
        <aside className="checkout-summary"><div className="checkout-summary-header"><h2>Order summary</h2><span>{items.length} {items.length === 1 ? "item" : "items"}</span></div>
          <div className="checkout-items">{items.map((item) => <div className="checkout-item" key={item.productId}><div className="checkout-item-thumb">{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span>{item.name.charAt(0)}</span>}</div><div><strong>{item.name}</strong><small>Qty {item.quantity}</small></div><strong>${(item.price * item.quantity).toFixed(2)}</strong></div>)}</div>
          <div className="checkout-total"><span>Total</span><strong>${total.toFixed(2)} USD</strong></div>
          <p className="checkout-secure">✓ USD pricing<br />✓ Secure checkout<br />✓ Your order information is validated before payment</p>
        </aside>
      </div>
    </div></main>
  );
}
