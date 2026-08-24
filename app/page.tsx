import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

const categories = [
  ['Tactical Gear', 'Backpacks, vests, pouches & more'],
  ['Military Equipment', 'Combat gear, protection & accessories'],
  ['Outdoor Essentials', 'Camping, hiking, survival & adventure'],
];

async function getProducts() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, price, currency, main_image_url, stock_quantity, categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(12);
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 6);
  const bestSellers = products.slice(3, 9);
  const newArrivals = products.slice(6, 12);

  return (
    <main className="triggers-site">
      <div className="mission-bar"><span>WELCOME TO TRIGGERS NATION</span><span>FREE SHIPPING ON ORDERS OVER $100</span><span>USD ▾</span></div>
      <header className="trigger-nav">
        <div className="trigger-container nav-inner">
          <a className="trigger-logo" href="/">◉ <span>TRIGGERS<br /><b>NATION</b></span></a>
          <nav>
            <a href="/">HOME</a><a href="/shop">SHOP</a><a href="#categories">ABOUT US</a><a href="#blog">BLOG</a><a href="#contact">CONTACT</a>
          </nav>
          <div className="trigger-actions"><a href="/shop">Search</a><a href="/auth">♙</a><a href="/cart">🛒</a></div>
        </div>
      </header>

      <section className="trigger-hero">
        <div className="trigger-container hero-overlay">
          <p className="trigger-kicker">GEAR UP. TRAIN HARD. STAY READY.</p>
          <h1>BUILT FOR<br /><em>PERFORMANCE.</em></h1>
          <p className="hero-tagline">READY FOR ANYTHING.</p>
          <div className="trigger-buttons"><a className="trigger-btn gold" href="/shop">SHOP NOW →</a><a className="trigger-btn outline" href="#categories">EXPLORE COLLECTION</a></div>
        </div>
      </section>

      <section id="categories" className="trigger-container trigger-categories">
        {categories.map(([name, description], index) => <a className={`mission-card mission-${index + 1}`} href="/shop" key={name}><span>0{index + 1}</span><div><h2>{name}</h2><p>{description}</p><b>EXPLORE →</b></div></a>)}
      </section>

      <section className="trust-strip"><div className="trigger-container trust-grid"><div>🚚 <b>FAST WORLDWIDE SHIPPING</b><small>Secure delivery to your door.</small></div><div>✦ <b>PREMIUM QUALITY</b><small>Built to last. Ready for action.</small></div><div>♙ <b>SECURE PAYMENTS</b><small>Protected and safe checkout.</small></div><div>★ <b>TRUSTED BY THOUSANDS</b><small>The gear of serious customers.</small></div></div></section>

      <section className="trigger-section trigger-container">
        <div className="trigger-heading"><div><span>FEATURED PRODUCTS</span><h2>MISSION READY</h2></div><a href="/shop">VIEW ALL PRODUCTS →</a></div>
        {featured.length ? <ProductGrid products={featured} /> : <div className="trigger-empty">Your tactical catalog is being prepared.</div>}
      </section>

      <section className="dark-section">
        <div className="trigger-container trigger-section">
          <div className="trigger-heading"><div><span>BEST SELLERS</span><h2>FIELD FAVORITES</h2></div><a href="/shop">VIEW ALL →</a></div>
          {bestSellers.length ? <ProductGrid products={bestSellers} /> : <div className="trigger-empty">Products will appear here when the catalog is connected.</div>}
        </div>
      </section>

      <section className="mission-promo"><div className="trigger-container promo-content"><div><span>READY FOR YOUR NEXT MISSION?</span><h2>GEAR UP & GET OUT THERE.</h2><p>Get 15% OFF your first order when you subscribe.</p></div><a className="trigger-btn gold" href="#subscribe">JOIN NOW →</a><strong>15%<small>OFF<br />FIRST ORDER</small></strong></div></section>

      <section className="trigger-section trigger-container"><div className="trigger-heading"><div><span>NEW ARRIVALS</span><h2>JUST LANDED</h2></div><a href="/shop">VIEW ALL →</a></div>{newArrivals.length ? <ProductGrid products={newArrivals} /> : null}</section>

      <section className="testimonials dark-section"><div className="trigger-container trigger-section"><div className="trigger-heading"><div><span>WHAT OUR CUSTOMERS SAY</span><h2>FIELD REPORTS</h2></div></div><div className="review-grid"><article>★★★★★<p>“Excellent quality. Fast shipping and durable gear. Highly recommended.”</p><b>— Verified customer</b></article><article>★★★★★<p>“The tactical backpack exceeded my expectations. Very spacious and comfortable.”</p><b>— Verified customer</b></article><article>★★★★★<p>“Professional equipment at affordable prices. Will buy again.”</p><b>— Verified customer</b></article></div></div></section>

      <section id="blog" className="trigger-section trigger-container"><div className="trigger-heading"><div><span>FROM THE FIELD</span><h2>TACTICAL BLOG</h2></div><a href="#blog">VIEW ALL ARTICLES →</a></div><div className="blog-grid"><article><span>GUIDE</span><h3>Choosing the Perfect Tactical Backpack</h3><a href="#blog">READ MORE →</a></article><article><span>SURVIVAL</span><h3>Top 10 Outdoor Essentials</h3><a href="#blog">READ MORE →</a></article><article><span>FIELD NOTES</span><h3>Military Gear Buying Guide</h3><a href="#blog">READ MORE →</a></article></div></section>

      <section id="subscribe" className="subscribe-strip"><div className="trigger-container subscribe-inner"><div><span>STAY MISSION READY</span><p>Subscribe for exclusive discounts, new product launches and tactical tips.</p></div><form><input aria-label="Email address" type="email" placeholder="Enter your email address" /><button className="trigger-btn gold" type="button">SUBSCRIBE</button></form></div></section>

      <footer id="contact" className="trigger-footer"><div className="trigger-container footer-grid"><div><a className="trigger-logo" href="/">◉ <span>TRIGGERS<br /><b>NATION</b></span></a><p>Professional tactical gear and outdoor essentials for serious customers.</p></div><div><b>QUICK LINKS</b><a href="/">Home</a><a href="/shop">Shop</a><a href="#categories">About Us</a><a href="#blog">Blog</a></div><div><b>CUSTOMER SERVICE</b><a href="#contact">Shipping & Delivery</a><a href="#contact">Returns & Exchanges</a><a href="#contact">FAQs</a><a href="#contact">Privacy Policy</a></div><div><b>CONTACT US</b><span>Cameroon</span><span>+237 XXX XXX XXX</span><span>Mon – Sat, 8AM – 6PM</span></div></div><div className="trigger-container copyright">© 2026 Triggers Nation. All Rights Reserved.</div></footer>
    </main>
  );
}
