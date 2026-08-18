import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <div className="container checkout-wrap">
        <div>
          <p className="eyebrow">MARTCART CHECKOUT</p>
          <h1>Complete your order.</h1>
          <p className="checkout-note">Secure checkout in USD. Payment integration will be enabled after the order validation layer is connected.</p>
        </div>
        <form className="checkout-card">
          <h2>Shipping information</h2>
          <label>Full name<input name="name" required placeholder="Your full name" /></label>
          <label>Phone<input name="phone" required placeholder="Phone number" /></label>
          <label>Address<input name="address" required placeholder="Street address" /></label>
          <div className="two-col"><label>City<input name="city" required /></label><label>Country<input name="country" required defaultValue="Cameroon" /></label></div>
          <div className="checkout-total"><span>Order total</span><strong>$0.00 USD</strong></div>
          <button className="button dark" type="submit">Continue to payment</button>
          <Link className="back-link" href="/cart">← Back to cart</Link>
        </form>
      </div>
    </main>
  );
}
