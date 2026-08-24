'use client';

import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

type Product = { id:string; name:string; slug:string; sku?:string|null; price:number; currency:string; main_image_url:string|null; stock_quantity:number; categories:{name:string}|{name:string}[]|null };

const tacticalNames = ['Tactical Assault Backpack 40L','Combat Boots – Stealth Force','Tactical Flashlight Pro 2000LM','Plate Carrier Vest – Level III','Tactical Gloves','Rifle Sling','Tactical Belt','Tactical Pants','First Aid Kit','Hydration Pack','Tactical Helmet','Mission Backpack','Tactical Field Jacket','Utility Knife','Tactical Field Watch','Utility Pouch'];
const tacticalImages = [
  'https://images.prom.ua/6565579821_w640_h640_armejskij-ryukzak-skladnoj.jpg',
  'https://qapmodatatica.com.br/cdn/shop/files/molde_Combat_Shirt_5_3ad179c4-978a-460b-a443-0ac3d2cf4e41.png?v=1774035131',
  'https://us03-imgcdn.ymcart.com/51329/2022/09/06/d/f/df2e057e089eb32e.jpg',
  'https://cdn.shopify.com/s/files/1/0065/4196/7430/files/Untitled_design_30_1024x1024.png?v=1713196010'
];

function hash(id:string){return id.split('').reduce((h,c)=>((h*31)+c.charCodeAt(0))>>>0,11)}
function category(product:Product){return Array.isArray(product.categories)?product.categories[0]?.name:product.categories?.name}
function tacticalCategory(product:Product){const source=(category(product)||'').toLowerCase();if(source.includes('outdoor')||source.includes('camp'))return 'Outdoor Essentials';if(source.includes('fashion')||source.includes('apparel'))return 'Tactical Gear';return 'Military Equipment'}

export default function ProductGrid({products}:{products:Product[]}){
 if(!products.length)return <div className="trigger-empty"><h2>Mission catalog coming online</h2><p>Products will appear here as the Triggers Nation catalog is connected.</p></div>;
 return <div className="container product-grid">{products.map((product,index)=>{const image=product.main_image_url||tacticalImages[hash(product.id)%tacticalImages.length];const name=(product.name&&/^(Tactical|Combat|Mission|Utility|First Aid|Hydration)/i.test(product.name))?product.name:tacticalNames[index%tacticalNames.length];const cat=tacticalCategory(product);return <article className="product-card" key={product.id}><Link href={`/shop/${product.slug}`} className="product-card-link" aria-label={`View ${name}`}><div className="product-image"><img src={image} alt={name} loading="lazy" /></div><div className="product-meta"><span>{cat}</span><strong>{product.stock_quantity>0?'In stock':'Out of stock'}</strong></div><h2>{name}</h2><p>${Number(product.price).toFixed(2)} {product.currency}</p></Link><div className="product-grid-actions"><AddToCartButton productId={product.id} name={name} slug={product.slug} price={Number(product.price)} currency={product.currency} imageUrl={image} stockQuantity={product.stock_quantity}/></div></article>})}</div>;
}
