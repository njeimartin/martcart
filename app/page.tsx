import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

const categories = [
  ["Electronics", "Smartphones, audio & computers"],
  ["Fashion", "Clothing, sneakers & accessories"],
  ["Home & Kitchen", "Modern products for your home"],
  ["Beauty", "Beauty & personal care"],
  ["Watches", "Watches & smartwatches"],
  ["Travel", "Bags & travel accessories"],
] as const;

export default async function HomePage() {
  const supabase = createPublicSupabaseClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, currency, main_image_url, stock_quantity")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const featuredProducts = (products ?? []).map((product) => ({
    ...product,
    categories: null,
  }));

  return (
    <main>
      <header className="topbar">
        <div className="container nav">
          <Link className="logo" href="/">MART<span>CART</span></Link>
          <nav>
            <Link href="/shop">Shop</Link>
            <Link href="#categories">Categories</Link>
            <Link href="#deals">Deals</Link>
          </nav>
          <div className="actions">
            <Link href="/auth" aria-label="Account">Account</Link>
            <Link href="/cart" aria-label="Shopping cart">Cart</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">WELCOME TO MARTCART</p>
          <h1>Shop smart.<br />Live better.</h1>
          <p className="hero-copy">Discover products you love at prices that make sense. Modern shopping, built for you.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/shop">Shop now</Link>
            <Link className="button secondary" href="#categories">Explore categories</Link>
          </div>
          <div className="trust-row"><span>✓ Secure shopping</span><span>✓ USD pricing</span><span>✓ Curated products</span></div>
        </div>
      </section>

      <section id="categories" className="section container">
        <div className="section-heading"><div><p className="eyebrow">SHOP BY CATEGORY</p><h2>Everything in one place</h2></div><Link href="/shop">View all →</Link></div>
        <div className="category-grid">
          {categories.map(([name, description]) => (
            <Link className="category-card" href="/shop" key={name}>
              <div className="category-icon">{name.charAt(0)}</div>
              <h3>{name}</h3><p>{description}</p><span>Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="shop" className="section featured">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">FEATURED</p><h2>Popular picks</h2></div><Link href="/shop">View shop →</Link></div>
          {featuredProducts.length ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="empty-products"><h3>Products are coming soon</h3><p>Our catalog is being updated. Check the shop for the latest products.</p></div>
          )}
        </div>
      </section>

      <section id="deals" className="promo"><div className="container promo-inner"><div><p className="eyebrow">MARTCART PROMISE</p><h2>Better shopping starts here.</h2></div><p>Simple discovery, secure checkout, and an experience designed for mobile and web.</p></div></section>

      <footer><div className="container footer-inner"><Link className="logo" href="/">MART<span>CART</span></Link><p>© 2026 MARTCART. Shop Smart. Live Better.</p></div></footer>
    </main>
  );
}
