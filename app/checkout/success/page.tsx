import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="checkout-page">
      <div className="container checkout-wrap">
        <div className="checkout-card">
          <p className="eyebrow">PAYMENT SUCCESSFUL</p>
          <h1>Thank you for your order.</h1>
          <p className="checkout-note">Your payment was completed securely through Stripe. We&apos;ll process your order shortly.</p>
          <Link className="button dark" href="/shop">Continue shopping</Link>
        </div>
      </div>
    </main>
  );
}
