import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  const supabase = await createServerSupabaseClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, currency, main_image_url, stock_quantity"
    )
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

        <p>
          Browse our curated collection. All prices are displayed in USD.
        </p>
      </div>

      {error ? (
        <section className="container empty-products">
          <h2>Supabase error</h2>

          <p>{error.message}</p>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              overflowX: "auto",
              marginTop: "1rem",
              padding: "1rem",
            }}
          >
            {JSON.stringify(
              {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
              },
              null,
              2
            )}
          </pre>
        </section>
      ) : gridProducts.length === 0 ? (
        <section className="container empty-products">
          <h2>No products found</h2>

          <p>
            The Supabase connection succeeded, but no active products were
            returned.
          </p>
        </section>
      ) : (
        <ProductGrid products={gridProducts} />
      )}
    </main>
  );
}