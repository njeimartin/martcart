import ProductGrid from "@/components/ProductGrid";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  const supabase = createPublicSupabaseClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, slug, price, currency, main_image_url, stock_quantity")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const gridProducts = (products ?? []).map((product) => ({
    ...product,
    categories: null,
  }));

  return (
    <main className="shop-page">
      <div className="container shop-header">
        <p className="eyebrow">MARTCART SHOP</p>
        <h1>Discover your next favorite.</h1>
        <p>Browse our curated collection. All prices are displayed in USD.</p>
      </div>

      {error ? (
        <section className="container empty-products">
          <h2>We couldn't load the catalog.</h2>
          <p>Please refresh the page or try again shortly.</p>
        </section>
      ) : gridProducts.length === 0 ? (
        <section className="container empty-products">
          <h2>No products found</h2>
          <p>Our catalog is being updated. Please check back soon.</p>
        </section>
      ) : (
        <ProductGrid products={gridProducts} />
      )}
    </main>
  );
}
