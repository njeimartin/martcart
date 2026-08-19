import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import WishlistButton from '@/components/WishlistButton';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: product } = await supabase
    .from('products')
    .select('id, name, slug, description, price, currency, main_image_url, stock_quantity, brand, rating, review_count, categories(name)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!product) notFound();
  const category = product.categories as { name?: string } | { name?: string }[] | null;
  const categoryName = Array.isArray(category) ? category[0]?.name : category?.name;

  return <main className="product-page"><div className="container product-detail"><div className="detail-image">{product.main_image_url ? <img src={product.main_image_url} alt={product.name} /> : <span>{categoryName?.charAt(0) ?? 'M'}</span>}</div><div className="detail-copy"><p className="eyebrow">{categoryName ?? 'MARTCART'}{product.brand ? ` · ${product.brand}` : ''}</p><h1>{product.name}</h1><div className="price">${Number(product.price).toFixed(2)} <small>{product.currency}</small></div><p className="description">{product.description ?? 'Quality product, selected for the MARTCART collection.'}</p><p className="stock">{product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Currently out of stock'}</p><div className="product-actions"><AddToCartButton productId={product.id} name={product.name} slug={product.slug} price={Number(product.price)} currency={product.currency} imageUrl={product.main_image_url} stockQuantity={product.stock_quantity} /><WishlistButton productId={product.id} /></div></div></div></main>;
}
