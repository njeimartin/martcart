import Link from 'next/link';

export default function TriggersShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="triggers-site">
      <div className="mission-bar"><span>WELCOME TO TRIGGERS NATION</span><span>FREE SHIPPING ON ORDERS OVER $100</span><span>USD</span></div>
      <header className="trigger-nav">
        <div className="trigger-container nav-inner">
          <Link className="trigger-logo" href="/"><span className="logo-mark">TN</span><span>TRIGGERS<br /><b>NATION</b></span></Link>
          <nav aria-label="Primary navigation">
            <Link href="/">HOME</Link><Link href="/shop">SHOP</Link><Link href="/about">ABOUT US</Link><Link href="/blog">BLOG</Link><Link href="/contact">CONTACT</Link>
          </nav>
          <div className="trigger-actions"><Link href="/shop">SEARCH</Link><Link href="/auth">ACCOUNT</Link><Link href="/cart">CART</Link></div>
        </div>
      </header>
      {children}
      <footer className="trigger-footer">
        <div className="trigger-container footer-grid">
          <div><Link className="trigger-logo" href="/"><span className="logo-mark">TN</span><span>TRIGGERS<br /><b>NATION</b></span></Link><p>Professional tactical gear and outdoor essentials for serious customers.</p></div>
          <div><b>EXPLORE</b><Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/about">About Us</Link><Link href="/blog">Blog</Link></div>
          <div><b>SUPPORT</b><Link href="/faq">FAQ</Link><Link href="/shipping">Shipping & Delivery</Link><Link href="/returns">Returns & Exchanges</Link><Link href="/contact">Contact</Link></div>
          <div><b>LEGAL</b><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms & Conditions</Link><span>Cameroon</span><span>Mon – Sat, 8AM – 6PM</span></div>
        </div>
        <div className="trigger-container copyright">© 2026 Triggers Nation. All Rights Reserved.</div>
      </footer>
    </main>
  );
}
