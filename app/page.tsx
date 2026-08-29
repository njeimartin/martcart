import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

export const dynamic='force-dynamic';

const categories=[['Tactical Gear','Backpacks, vests, pouches & more'],['Military Equipment','Combat gear, protective accessories & field equipment'],['Outdoor Essentials','Camping, hiking, survival & adventure']];
const instagramImages=[
  'https://res.cloudinary.com/gaxaqabv/image/upload/v1787974691/triggers-nation/tactical-backpack.jpg',
  'https://res.cloudinary.com/gaxaqabv/image/upload/v1787974698/triggers-nation/combat-shirt.png',
  'https://res.cloudinary.com/gaxaqabv/image/upload/v1787974705/triggers-nation/field-scene.jpg',
  'https://res.cloudinary.com/gaxaqabv/image/upload/v1787974711/triggers-nation/tactical-kit.png',
  'https://res.cloudinary.com/gaxaqabv/image/upload/v1787974718/triggers-nation/outdoor-scene.jpg',
  'https://res.cloudinary.com/gaxaqabv/image/upload/v1787974723/triggers-nation/forest-survival.jpg'
];

async function getProducts(){
  try{
    const s=await createServerSupabaseClient();
    const {data}=await s.from('products').select('id,name,slug,price,currency,main_image_url,stock_quantity,categories(name)').eq('is_active',true).order('created_at',{ascending:false}).limit(12);
    return data??[];
  }catch{return[]}
}

export default async function HomePage(){
  const p=await getProducts();
  const featured=p.slice(0,4),best=p.slice(4,10),newArrivals=p.slice(6,12);
  return <main className="triggers-site">
    <div className="mission-bar"><span>WELCOME TO TRIGGERS NATION</span><span>FREE SHIPPING ON ORDERS OVER $150</span><span>USD</span></div>
    <header className="trigger-nav"><div className="trigger-container nav-inner"><Link className="trigger-logo" href="/"><span className="logo-mark">TN</span><span>TRIGGERS<br/><b>NATION</b></span></Link><nav><Link href="/">HOME</Link><Link href="/shop">SHOP</Link><Link href="/about">ABOUT US</Link><Link href="/blog">BLOG</Link><Link href="/contact">CONTACT</Link></nav><div className="trigger-actions"><Link href="/shop">SEARCH</Link><Link href="/auth">ACCOUNT</Link><Link href="/cart">CART</Link></div></div></header>
    <section className="trigger-hero" style={{backgroundImage:"linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.48) 48%, rgba(0,0,0,.18) 100%), url('https://res.cloudinary.com/gaxaqabv/image/upload/v1787974705/triggers-nation/field-scene.jpg')",backgroundSize:'cover',backgroundPosition:'center'}}><div className="trigger-container hero-overlay"><p className="trigger-kicker">GEAR UP. TRAIN HARD. STAY READY.</p><h1>BUILT FOR<br/><em>PERFORMANCE.</em></h1><p className="hero-tagline">READY FOR ANYTHING.</p><div className="trigger-buttons"><Link className="trigger-btn gold" href="/shop">SHOP NOW →</Link><a className="trigger-btn outline" href="#categories">EXPLORE COLLECTION</a></div></div></section>
    <section id="categories" className="trigger-container trigger-categories">{categories.map(([name,description],i)=><Link className={`mission-card mission-${i+1}`} href="/shop" key={name}><span>0{i+1}</span><div><h2>{name}</h2><p>{description}</p><b>EXPLORE →</b></div></Link>)}</section>
    <section className="trust-strip"><div className="trigger-container trust-grid"><div>🚚 <b>FAST WORLDWIDE SHIPPING</b><small>Secure delivery to your door.</small></div><div>✦ <b>PREMIUM QUALITY</b><small>Built to last. Ready for action.</small></div><div>♙ <b>SECURE PAYMENTS</b><small>Protected and safe checkout.</small></div><div>★ <b>TRUSTED BY THOUSANDS</b><small>The gear of serious customers.</small></div></div></section>
    <section className="trigger-section trigger-container"><div className="trigger-heading"><div><span>FEATURED PRODUCTS</span><h2>MISSION READY</h2></div><Link href="/shop">VIEW ALL PRODUCTS →</Link></div>{featured.length?<ProductGrid products={featured}/>:<div className="trigger-empty">Your tactical catalog is being prepared.</div>}</section>
    <section className="dark-section"><div className="trigger-container trigger-section"><div className="trigger-heading"><div><span>BEST SELLERS</span><h2>FIELD FAVORITES</h2></div><Link href="/shop">VIEW ALL →</Link></div>{best.length?<ProductGrid products={best}/>:null}</div></section>
    <section className="mission-promo"><div className="trigger-container promo-content"><div><span>READY FOR YOUR NEXT MISSION?</span><h2>GEAR UP & GET OUT THERE.</h2><p>Get 15% OFF your first order when you subscribe.</p></div><Link className="trigger-btn gold" href="/contact">JOIN NOW →</Link><strong>15%<small>OFF<br/>FIRST ORDER</small></strong></div></section>
    <section className="trigger-section trigger-container"><div className="trigger-heading"><div><span>NEW ARRIVALS</span><h2>JUST LANDED</h2></div><Link href="/shop">VIEW ALL →</Link></div>{newArrivals.length?<ProductGrid products={newArrivals}/>:null}</section>
    <section className="dark-section"><div className="trigger-container trigger-section"><div className="trigger-heading"><div><span>WHAT OUR CUSTOMERS SAY</span><h2>FIELD REPORTS</h2></div><Link href="/blog">VIEW ALL ARTICLES →</Link></div><div className="review-grid"><article>★★★★★<p>“Excellent quality, fast shipping, and durable gear.”</p><b>— Verified customer</b></article><article>★★★★★<p>“The tactical backpack exceeded my expectations. Spacious and comfortable.”</p><b>— Verified customer</b></article><article>★★★★★<p>“Professional equipment at affordable prices. Will buy again.”</p><b>— Verified customer</b></article></div></div></section>
    <section className="trigger-section trigger-container"><div className="trigger-heading"><div><span>FROM THE FIELD</span><h2>TACTICAL BLOG</h2></div><Link href="/blog">VIEW ALL ARTICLES →</Link></div><div className="blog-grid"><article className="blog-post"><span>GUIDE</span><h3>Choosing the Perfect Tactical Backpack</h3><Link href="/blog">READ MORE →</Link></article><article className="blog-post"><span>SURVIVAL</span><h3>Top 10 Survival Essentials</h3><Link href="/blog">READ MORE →</Link></article><article className="blog-post"><span>FIELD NOTES</span><h3>Military Gear Buying Guide</h3><Link href="/blog">READ MORE →</Link></article></div></section>
    <section className="instagram-section dark-section"><div className="trigger-container trigger-section"><div className="trigger-heading"><div><span>@TRIGGERSNATION</span><h2>FOLLOW THE MISSION</h2></div><Link href="/contact">FOLLOW US →</Link></div><div className="instagram-grid">{instagramImages.map((src,i)=><a href="/blog" aria-label={`Triggers Nation Instagram post ${i+1}`} key={src}><img src={src} alt="Triggers Nation tactical gear and outdoor scene" loading="lazy"/></a>)}</div></div></section>
    <section className="subscribe-strip"><div className="trigger-container subscribe-inner"><div><span>STAY MISSION READY</span><p>Subscribe for exclusive discounts, new arrivals and tactical tips.</p></div><Link className="trigger-btn gold" href="/contact">SUBSCRIBE →</Link></div></section>
    <footer className="trigger-footer"><div className="trigger-container footer-grid"><div><Link className="trigger-logo" href="/"><span className="logo-mark">TN</span><span>TRIGGERS<br/><b>NATION</b></span></Link><p>Professional tactical gear and outdoor essentials for serious customers.</p></div><div><b>QUICK LINKS</b><Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/about">About Us</Link><Link href="/blog">Blog</Link></div><div><b>CUSTOMER SERVICE</b><Link href="/shipping">Shipping & Delivery</Link><Link href="/returns">Returns & Exchanges</Link><Link href="/faq">FAQs</Link><Link href="/privacy">Privacy Policy</Link></div><div><b>CONTACT US</b><Link href="/contact">Contact Support</Link><span>Cameroon</span><span>Mon – Sat, 8AM – 6PM</span><span>Visa · MasterCard · PayPal</span></div></div><div className="trigger-container copyright">© 2026 Triggers Nation. All Rights Reserved.</div></footer>
  </main>
}
