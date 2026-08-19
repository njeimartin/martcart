import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: profile } = await supabase.from('profiles').select('full_name, email, role').eq('id', user.id).maybeSingle();
  const { data: orders } = await supabase.from('orders').select('id, status, total, currency, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);

  return <main className="account-page"><div className="container account-card"><div className="account-header"><div><p className="eyebrow">MY ACCOUNT</p><h1>Welcome{profile?.full_name ? `, ${profile.full_name}` : ' back'}.</h1><p>{profile?.email ?? user.email}</p></div><a className="button dark" href="/shop">Continue shopping</a></div><section className="account-panel"><div className="panel-heading"><h2>Recent orders</h2></div>{orders?.length ? <div className="account-orders">{orders.map((order) => <div className="account-order" key={order.id}><div><strong>Order #{String(order.id).slice(0, 8)}</strong><small>{new Date(order.created_at).toLocaleDateString()}</small></div><span>{order.status}</span><strong>${Number(order.total ?? 0).toFixed(2)} {order.currency ?? 'USD'}</strong></div>)}</div> : <div className="empty-products"><h3>No orders yet</h3><p>Your completed orders will appear here.</p><a className="button dark" href="/shop">Start shopping</a></div>}</section><div className="account-links"><a href="/wishlist">❤️ Wishlist</a><a href="/cart">🛒 View cart</a></div></div></main>;
}
