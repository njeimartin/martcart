import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <main className="orders-page"><div className="container orders-wrap"><p className="eyebrow">YOUR ORDERS</p><h1>Order history</h1><div className="empty-products"><h2>Sign in to view your orders</h2><p>Your completed MARTCART purchases are saved to your account.</p><Link className="button dark" href="/auth">Sign in</Link></div></div></main>;
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total, currency, payment_status, created_at, order_items(product_name, quantity, line_total)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="orders-page">
      <div className="container orders-wrap">
        <p className="eyebrow">YOUR ORDERS</p>
        <h1>Order history</h1>
        {!orders?.length ? (
          <div className="empty-products"><h2>No orders yet</h2><p>Your completed MARTCART purchases will appear here.</p><Link className="button dark" href="/shop">Start shopping</Link></div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-heading"><div><strong>Order #{order.id.slice(0, 8).toUpperCase()}</strong><small>{new Date(order.created_at).toLocaleDateString()}</small></div><span>{order.status}</span></div>
                <div className="order-items">{order.order_items?.map((item: any, index: number) => <div className="order-item" key={`${order.id}-${index}`}><span>{item.product_name} × {item.quantity}</span><strong>${Number(item.line_total).toFixed(2)}</strong></div>)}</div>
                <div className="order-total"><span>Payment: {order.payment_status}</span><strong>${Number(order.total).toFixed(2)} {order.currency}</strong></div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
