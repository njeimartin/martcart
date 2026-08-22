'use client';

import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

type Product = {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  price: number;
  currency: string;
  main_image_url: string | null;
  stock_quantity: number;
  categories: { name: string } | { name: string }[] | null;
};

const categoryProducts: Record<string, string[]> = {
  Electronics: ['USB-C Fast Charger', 'Wireless Bluetooth Speaker', 'Portable Power Station', 'Smart LED Display', 'Wireless Charging Station', 'Digital Alarm Clock'],
  'Home & Kitchen': ['Electric Kitchen Blender', 'Digital Kitchen Scale', 'Stainless Steel Cookware Set', 'Non-Stick Frying Pan', 'Electric Food Chopper', 'Automatic Coffee Maker'],
  Fashion: ['Classic Casual T-Shirt', 'Premium Cotton Shirt', 'Slim Fit Casual Trousers', 'Classic Denim Jacket', 'Modern Casual Hoodie', 'Everyday Polo Shirt'],
  'Men’s Fashion': ["Men's Casual Polo Shirt", "Men's Slim Fit Jeans", "Men's Casual Sneakers", "Men's Leather Belt", "Men's Formal Shirt", "Men's Casual Jacket"],
  "Men's Fashion": ["Men's Casual Polo Shirt", "Men's Slim Fit Jeans", "Men's Casual Sneakers", "Men's Leather Belt", "Men's Formal Shirt", "Men's Casual Jacket"],
  'Women’s Fashion': ["Women's Casual Dress", "Women's High Waist Jeans", "Women's Casual Blouse", "Women's Summer Dress", "Women's Fashion Handbag", "Women's Casual Sneakers"],
  "Women's Fashion": ["Women's Casual Dress", "Women's High Waist Jeans", "Women's Casual Blouse", "Women's Summer Dress", "Women's Fashion Handbag", "Women's Casual Sneakers"],
  Gaming: ['Wireless Gaming Controller', 'RGB Gaming Keyboard', 'Gaming Mouse', 'Gaming Headset', 'Large Gaming Mouse Pad', 'USB Gaming Microphone'],
  Automotive: ['Universal Car Phone Holder', 'Portable Tire Inflator', 'Digital Car Tire Gauge', 'Car Cleaning Kit', 'LED Interior Car Lights', 'Car Vacuum Cleaner'],
  'Sports & Fitness': ['Adjustable Dumbbell Set', 'Resistance Training Bands', 'Portable Exercise Mat', 'Digital Fitness Tracker', 'Home Workout Kit', 'Adjustable Jump Rope'],
  Skincare: ['Hydrating Facial Moisturizer', 'Daily Facial Cleanser', 'Vitamin C Face Serum', 'Gentle Facial Toner', 'Daily Sunscreen Lotion', 'Deep Cleansing Face Mask'],
  Shoes: ['Classic Casual Sneakers', 'Running Sports Shoes', 'Lightweight Walking Shoes', 'Classic Leather Shoes', 'Outdoor Hiking Shoes', 'Everyday Slip-On Shoes'],
  Books: ['Business & Entrepreneurship Guide', 'Personal Finance Handbook', 'Technology Beginner Guide', 'Modern Cooking Recipe Book', 'Self Improvement Workbook', 'Creative Writing Guide'],
  'Beauty & Personal Care': ['Personal Care Grooming Kit', 'Electric Facial Cleansing Brush', 'Portable Hair Dryer', 'Rechargeable Hair Trimmer', 'Beauty Makeup Organizer', 'Beauty Care Gift Set'],
  'Cameras & Photography': ['Mirrorless Digital Camera', 'Portable Action Camera', 'Adjustable Camera Tripod', 'Camera Carrying Bag', 'LED Photography Light', 'Universal Camera Strap'],
  'Computers & Accessories': ['USB-C Laptop Dock', 'Wireless Computer Mouse', 'Mechanical Keyboard', 'Laptop Cooling Stand', 'Adjustable Monitor Stand', 'USB Hub Adapter'],
  'Phones & Tablets': ['Android Smartphone', '10.1-Inch Android Tablet', 'Fast Charging Power Bank', 'Universal Tablet Stand', 'Smartphone Camera Lens Kit', 'Wireless Phone Controller'],
  'Audio & Headphones': ['Wireless Bluetooth Headphones', 'Noise Cancelling Earbuds', 'Portable Bluetooth Speaker', 'Wireless Gaming Headset', 'Over-Ear Studio Headphones', 'USB Condenser Microphone'],
  Furniture: ['Modern Office Chair', 'Adjustable Computer Desk', 'Modern Storage Cabinet', 'Living Room Side Table', 'Wooden Bookshelf', 'Modern TV Stand'],
  'Pet Supplies': ['Comfort Pet Bed', 'Stainless Steel Pet Bowl', 'Adjustable Pet Leash', 'Pet Grooming Kit', 'Portable Pet Carrier', 'Interactive Pet Toy'],
  'Garden & Outdoor': ['Heavy Duty Garden Hose', 'Adjustable Garden Sprinkler', 'Outdoor Storage Box', 'Garden Hand Tool Set', 'Plant Growing Pot Set', 'Outdoor Folding Chair'],
  'Outdoor & Camping': ['Portable Camping Tent', 'Lightweight Sleeping Bag', 'Rechargeable Camping Lantern', 'Folding Camp Chair', 'Portable Camping Stove', 'Hiking Backpack'],
  'Tools & Hardware': ['Professional Hand Tool Set', 'Cordless Power Drill', 'Adjustable Wrench Set', 'Heavy Duty Screwdriver Set', 'Portable Tool Organizer', 'Precision Tool Kit'],
  Lighting: ['Modern Table Lamp', 'Adjustable Floor Lamp', 'LED Ceiling Light', 'Rechargeable Desk Lamp', 'Decorative Wall Light', 'Smart LED Light Strip'],
  Kitchenware: ['Stainless Steel Knife Set', 'Non-Stick Cooking Utensil Set', 'Glass Food Storage Set', 'Bamboo Cutting Board', 'Kitchen Measuring Set', 'Stainless Steel Mixing Bowl Set'],
  'Baby Products': ['Comfort Baby Stroller', 'Adjustable Baby Carrier', 'Baby Feeding Set', 'Portable Changing Mat', 'Soft Baby Blanket', 'Baby Monitor'],
  'Kids & Baby': ['Educational Building Set', 'Kids Learning Puzzle', 'Creative Art Kit', 'Interactive Learning Toy', 'Children’s Board Game', 'Kids Science Kit'],
  'Jewelry & Watches': ['Classic Stainless Steel Watch', 'Minimalist Bracelet', 'Elegant Pendant Necklace', 'Fashion Earrings Set', 'Classic Leather Watch', 'Jewelry Storage Box'],
  'Perfumes & Fragrances': ['Eau de Parfum', 'Long-Lasting Fragrance Mist', 'Classic Eau de Toilette', 'Unisex Signature Fragrance', 'Luxury Fragrance Gift Set', 'Travel Perfume Atomizer'],
};

const generatedNamePattern = /\b(Collection|Series|Kit|Set|Edition|System|Range|Solution|Package)\b/i;

function displayName(product: Product, category: string) {
  if (!generatedNamePattern.test(product.name)) return product.name;
  const options = categoryProducts[category];
  if (!options?.length) return product.name;
  const seed = product.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return `${options[seed % options.length]} — ${product.id.slice(0, 4).toUpperCase()}`;
}

function imageSearchTerm(category: string, name: string) {
  const terms: Record<string, string> = {
    Electronics: 'consumer electronics product',
    'Home & Kitchen': 'kitchen appliance product',
    Fashion: 'fashion clothing product',
    'Men’s Fashion': 'mens fashion clothing',
    "Men's Fashion": 'mens fashion clothing',
    'Women’s Fashion': 'womens fashion clothing',
    "Women's Fashion": 'womens fashion clothing',
    Gaming: 'gaming accessories product',
    Automotive: 'car accessories product',
    'Sports & Fitness': 'fitness equipment product',
    Skincare: 'skincare cosmetics product',
    Shoes: 'shoes footwear product',
    Books: 'books product',
    'Beauty & Personal Care': 'beauty personal care product',
    'Cameras & Photography': 'camera photography equipment',
    'Computers & Accessories': 'computer accessories product',
    'Phones & Tablets': 'smartphone tablet product',
    'Audio & Headphones': 'headphones audio product',
    Furniture: 'modern furniture product',
    'Pet Supplies': 'pet supplies product',
    'Garden & Outdoor': 'garden outdoor product',
    'Outdoor & Camping': 'camping outdoor gear',
    'Tools & Hardware': 'hand tools hardware product',
    Lighting: 'modern lighting product',
    Kitchenware: 'kitchen utensils product',
    'Baby Products': 'baby products',
    'Kids & Baby': 'kids toys learning products',
    'Jewelry & Watches': 'jewelry watches product',
    'Perfumes & Fragrances': 'perfume fragrance product',
  };
  return terms[category] ?? `${category} product ${name}`;
}

function productHash(id: string) {
  return id.split('').reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 7);
}

function fallbackImage(category: string, name: string, id: string) {
  const query = encodeURIComponent(imageSearchTerm(category, name));
  // MC products deliberately ignore their database main_image_url.
  // The unique lock plus cache-busting version prevents one cached photo from
  // being reused across the catalog while keeping the image category-specific.
  const lock = productHash(id) % 1000000;
  const version = productHash(`${id}:${name}`) % 1000000;
  return `https://loremflickr.com/800/800/${query}?lock=${lock}&v=${version}`;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <div className="container empty-products"><h2>No products yet</h2><p>Add products in Supabase and they will appear here automatically.</p></div>;
  }

  return (
    <div className="container product-grid">
      {products.map((product) => {
        const category = Array.isArray(product.categories) ? product.categories[0]?.name : product.categories?.name;
        const safeCategory = category ?? 'MARTCART';
        const name = displayName(product, safeCategory);
        const isGeneratedProduct = product.sku?.startsWith('MC-') ?? false;
        const image = isGeneratedProduct
          ? fallbackImage(safeCategory, name, product.id)
          : (product.main_image_url || fallbackImage(safeCategory, name, product.id));

        return (
          <article className="product-card" key={product.id}>
            <Link href={`/shop/${product.slug}`} className="product-card-link" aria-label={`View ${name}`}>
              <div className="product-image"><img src={image} alt={name} loading="lazy" /></div>
              <div className="product-meta"><span>{safeCategory}</span><strong>{product.stock_quantity > 0 ? 'In stock' : 'Out of stock'}</strong></div>
              <h2>{name}</h2>
              <p>${Number(product.price).toFixed(2)} {product.currency}</p>
            </Link>
            <div className="product-grid-actions">
              <AddToCartButton productId={product.id} name={name} slug={product.slug} price={Number(product.price)} currency={product.currency} imageUrl={image} stockQuantity={product.stock_quantity} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
