import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  main_image_url: string | null;
  stock_quantity: number;
  categories: { name: string } | { name: string }[] | null;
};

export default async function ShopPage() {
  let products: ShopProduct[] = [];
  let errorMessage = '';

  try {
    const supabase = await createServerSupabaseClient();
    const result = await supabase
      .from('products')
      .select('id, name, slug, price, currency, main_image_url, stock_quantity, categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (result.error) {
      console.error('MARTCART shop products error:', result.error.message);
      errorMessage = 'Products are temporarily unavailable.';
    } else {
      products = (result.data ?? []) as ShopProduct[];
    }
  } catch (error) {
    console.error('MARTCART shop configuration error:', error);
    errorMessage = 'Products are temporarily unavailable.';
  }

  return (
    <main className="shop-page">
      <div className="container shop-header">
        <p className="eyebrow">MARTCART SHOP</p>
        <h1>Discover your next favorite.</h1>
        <p>Browse our curated collection. All prices are displayed in USD.</p>
      </div>
      {errorMessage ? (
        <div className="container empty-products"><h2>{errorMessage}</h2><p>Please try again shortly.</p></div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
