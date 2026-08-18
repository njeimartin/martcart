import { createClient } from '@/lib/supabase/client';
import ProductGrid from '@/components/ProductGrid';

export default async function ShopPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, price, currency, main_image_url, stock_quantity, categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <main className="shop-page">
      <div className="container shop-header">
        <p className="eyebrow">MARTCART SHOP</p>
        <h1>Discover your next favorite.</h1>
        <p>Browse our curated collection. All prices are displayed in USD.</p>
      </div>
      {error ? (
        <div className="container empty-products"><h2>Products are temporarily unavailable.</h2><p>Please check the Supabase connection and try again.</p></div>
      ) : (
        <ProductGrid products={products ?? []} />
      )}
    </main>
  );
}
