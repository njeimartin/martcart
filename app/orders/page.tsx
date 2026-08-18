import Link from 'next/link';

export default function OrdersPage() {
  return (
    <main className="orders-page">
      <div className="container orders-wrap">
        <p className="eyebrow">YOUR ORDERS</p>
        <h1>Order history</h1>
        <div className="empty-products"><h2>No orders yet</h2><p>Your completed MARTCART purchases will appear here.</p><Link className="button dark" href="/shop">Start shopping</Link></div>
      </div>
    </main>
  );
}
