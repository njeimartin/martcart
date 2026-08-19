import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: wishlist } = await supabase.from('wishlists').select('id').eq('user_id', user.id).maybeSingle();
  let products: any[] = [];
  if (wishlist) {
    const { data } = await supabase.from('wishlist_items').select('id, product_id, products(id, name, slug, price, currency, main_image_url, stock_quantity)').eq('wishlist_id', wishlist.id).order('created_at', { ascending: false });
    products = (data ?? []).map((item: any) => ({ itemId: item.id, ...item.products })).filter((item: any) => item.id);
  }

  return <main className="shop-page"><div className="container shop-header"><p className="eyebrow">MY MARTCART</p><h1>Wishlist.</h1><p>Save products you want to come back to.</p></div><div className="container product-grid">{products.length ? products.map((product) => <a className="product-card" href={`/shop/${product.slug}`} key={product.itemId}><div className="product-image">{product.main_image_url ? <img src={product.main_image_url} alt={product.name} /> : <span>W</span>}</div><div className="product-meta"><span>USD</span><strong>{product.stock_quantity > 0 ? 'In stock' : 'Out of stock'}</strong></div><h2>{product.name}</h2><p>${Number(product.price).toFixed(2)}</p></a>) : <div className="empty-products"><h3>Your wishlist is empty</h3><p>Save products from their product pages and they'll appear here.</p><a className="button dark" href="/shop">Browse products</a></div>}</div></main>;
}
