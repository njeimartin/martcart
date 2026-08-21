import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

const categories = [
  ["Electronics", "Smartphones, audio & computers"],
  ["Fashion", "Clothing, sneakers & accessories"],
  ["Home & Kitchen", "Modern products for your home"],
  ["Beauty", "Beauty & personal care"],
  ["Watches", "Watches & smartwatches"],
  ["Travel", "Bags & travel accessories"],
];

async function getFeaturedProducts() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, price, currency, main_image_url, stock_quantity, categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('MARTCART featured products error:', error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error('MARTCART featured products configuration error:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      <header className="topbar">
        <div className="container nav">
          <a className="logo" href="#">MART<span>CART</span></a>
          <nav>
            <a href="#shop">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#deals">Deals</a>
          </nav>
          <div className="actions">
            <button aria-label="Search">⌕</button>
            <button aria-label="Account">Account</button>
            <button aria-label="Shopping cart">Cart (0)</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">WELCOME TO MARTCART</p>
          <h1>Shop smart.<br />Live better.</h1>
          <p className="hero-copy">Discover products you love at prices that make sense. Modern shopping, built for you.</p>
          <div className="hero-actions">
            <a className="button primary" href="#shop">Shop now</a>
            <a className="button secondary" href="#categories">Explore categories</a>
          </div>
          <div className="trust-row"><span>✓ Secure shopping</span><span>✓ USD pricing</span><span>✓ Curated products</span></div>
        </div>
      </section>

      <section id="categories" className="section container">
        <div className="section-heading"><div><p className="eyebrow">SHOP BY CATEGORY</p><h2>Everything in one place</h2></div><a href="#shop">View all →</a></div>
        <div className="category-grid">
          {categories.map(([name, description]) => <a className="category-card" href="#shop" key={name}><div className="category-icon">{name.charAt(0)}</div><h3>{name}</h3><p>{description}</p><span>Explore →</span></a>)}
        </div>
      </section>

      <section id="shop" className="section featured">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">FEATURED</p><h2>Popular picks</h2></div><a href="/shop">View shop →</a></div>
          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="empty-products">
              <h3>Products are coming next</h3>
              <p>Add active products in Supabase and they will appear here automatically.</p>
              <a className="button secondary" href="/shop">Browse the shop</a>
            </div>
          )}
        </div>
      </section>

      <section id="deals" className="promo"><div className="container promo-inner"><div><p className="eyebrow">MARTCART PROMISE</p><h2>Better shopping starts here.</h2></div><p>Simple discovery, secure checkout, and an experience designed for mobile and web.</p></div></section>

      <footer><div className="container footer-inner"><a className="logo" href="#">MART<span>CART</span></a><p>© 2026 MARTCART. Shop Smart. Live Better.</p></div></footer>
    </main>
  );
}
