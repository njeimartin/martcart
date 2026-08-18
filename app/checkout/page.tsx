"use client";

import Link from "next/link";
import { useState } from "react";
import { cartTotal, getCart } from "../../lib/cart";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData(event.currentTarget);
      const items = getCart();
      if (!items.length) throw new Error("Your cart is empty.");

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerEmail: String(form.get("email") || ""),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Unable to start payment.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start payment.");
      setLoading(false);
    }
  }

  const total = cartTotal();

  return (
    <main className="checkout-page">
      <div className="container checkout-wrap">
        <div>
          <p className="eyebrow">MARTCART CHECKOUT</p>
          <h1>Complete your order.</h1>
          <p className="checkout-note">Secure checkout in USD. Your payment is processed securely by Stripe.</p>
        </div>
        <form className="checkout-card" onSubmit={handleSubmit}>
          <h2>Shipping information</h2>
          <label>Full name<input name="name" required placeholder="Your full name" /></label>
          <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
          <label>Phone<input name="phone" required placeholder="Phone number" /></label>
          <label>Address<input name="address" required placeholder="Street address" /></label>
          <div className="two-col"><label>City<input name="city" required /></label><label>Country<input name="country" required defaultValue="Cameroon" /></label></div>
          <div className="checkout-total"><span>Order total</span><strong>${total.toFixed(2)} USD</strong></div>
          {error && <p role="alert">{error}</p>}
          <button className="button dark" type="submit" disabled={loading}>{loading ? "Redirecting to Stripe…" : "Pay securely with Stripe"}</button>
          <Link className="back-link" href="/cart">← Back to cart</Link>
        </form>
      </div>
    </main>
  );
}
