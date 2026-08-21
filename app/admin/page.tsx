'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// The admin dashboard depends on authenticated Supabase state and must never be
// statically prerendered during the Vercel build.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Product = { id: string; name: string; price: number; stock_quantity: number; main_image_url: string | null; is_active: boolean; category_id: string | null };
type Category = { id: string; name: string };
type Order = { id: string; status: string; total: number; created_at: string };

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  async function loadDashboard() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'admin') return;
      setAuthorized(true);
      const [productsResult, categoriesResult, ordersResult] = await Promise.all([
        supabase.from('products').select('id,name,price,stock_quantity,main_image_url,is_active,category_id').order('created_at', { ascending: false }),
        supabase.from('categories').select('id,name').order('name'),
        supabase.from('orders').select('id,status,total,created_at').order('created_at', { ascending: false }).limit(100),
      ]);
      setProducts(productsResult.data ?? []);
      setCategories(categoriesResult.data ?? []);
      setOrders(ordersResult.data ?? []);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to load the admin dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  function resetForm() { setEditingId(null); setName(''); setPrice(''); setStock(''); setDescription(''); setCategoryId(''); setFile(null); setStatus(''); const input = document.getElementById('product-image') as HTMLInputElement | null; if (input) input.value = ''; }

  function editProduct(product: Product) {
    setEditingId(product.id); setName(product.name); setPrice(String(product.price)); setStock(String(product.stock_quantity)); setCategoryId(product.category_id ?? ''); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setStatus('');
    try {
      const supabase = createClient();
      if (!name.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0) throw new Error('Enter a valid product name and USD price.');
      let imageUrl: string | undefined;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in.');
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const upload = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type });
        if (upload.error) throw upload.error;
        imageUrl = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
      }
      if (editingId) {
        const update: Record<string, unknown> = { name: name.trim(), price: Number(price), stock_quantity: Math.max(0, Number(stock) || 0), category_id: categoryId || null };
        if (imageUrl) update.main_image_url = imageUrl;
        const { error } = await supabase.from('products').update(update).eq('id', editingId);
        if (error) throw error;
        setStatus('Product updated successfully.');
      } else {
        const slug = `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
        const { error } = await supabase.from('products').insert({ name: name.trim(), slug, description: description.trim() || null, price: Number(price), currency: 'USD', stock_quantity: Math.max(0, Number(stock) || 0), category_id: categoryId || null, main_image_url: imageUrl ?? null, is_active: true });
        if (error) throw error;
        setStatus('Product added successfully.');
      }
      resetForm(); await loadDashboard();
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to save product.'); }
    finally { setSaving(false); }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('products').delete().eq('id', id);
      setStatus(error ? error.message : 'Product deleted.');
      if (!error) await loadDashboard();
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to delete product.'); }
  }

  async function changeOrderStatus(id: string, statusValue: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('orders').update({ status: statusValue }).eq('id', id);
      setStatus(error ? error.message : 'Order status updated.');
      if (!error) await loadDashboard();
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to update order status.'); }
  }

  if (loading) return <main className="admin-page"><div className="container admin-card"><h1>Loading MARTCART Admin...</h1></div></main>;
  if (!authorized) return <main className="admin-page"><div className="container admin-card"><p className="eyebrow">MARTCART ADMIN</p><h1>Admin access required.</h1><p className="admin-note">Sign in with an account whose profile role is set to admin.</p><a className="button dark" href="/auth">Go to sign in</a>{status && <p className="admin-status" role="alert">{status}</p>}</div></main>;

  const revenue = orders.filter(o => ['paid','processing','shipped','delivered'].includes(o.status)).reduce((sum, o) => sum + Number(o.total || 0), 0);
  const lowStock = products.filter(p => p.stock_quantity <= 5).length;

  return <main className="admin-page"><div className="container">
    <div className="admin-header"><div><p className="eyebrow">MARTCART ADMIN</p><h1>Store dashboard</h1><p className="admin-note">Manage your catalog, inventory and orders.</p></div><a className="button dark" href="/shop">View store</a></div>
    <div className="admin-stats"><div><span>Products</span><strong>{products.length}</strong></div><div><span>Orders</span><strong>{orders.length}</strong></div><div><span>Revenue</span><strong>${revenue.toFixed(2)}</strong></div><div><span>Low stock</span><strong>{lowStock}</strong></div></div>
    <section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">CATALOG</p><h2>{editingId ? 'Edit product' : 'Add product'}</h2></div>{editingId && <button type="button" className="button light" onClick={resetForm}>Cancel</button>}</div>
      <form onSubmit={saveProduct} className="admin-form"><label>Product name<input value={name} onChange={e => setName(e.target.value)} required /></label><div className="form-row"><label>Price (USD)<input type="number" min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required /></label><label>Stock<input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} /></label></div><label>Category<select value={categoryId} onChange={e => setCategoryId(e.target.value)}><option value="">No category</option>{categories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} /></label><label>Product image<input id="product-image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label><button className="button dark" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update product' : 'Add product'}</button>{status && <p className="admin-status" role="alert">{status}</p>}</form>
    </section>
    <section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">PRODUCTS</p><h2>Manage catalog</h2></div></div><div className="admin-table">{products.map(p => <div className="admin-row" key={p.id}><div className="row-product">{p.main_image_url ? <img src={p.main_image_url} alt="" /> : <span>M</span>}<div><strong>{p.name}</strong><small>${Number(p.price).toFixed(2)} USD · {p.stock_quantity} in stock</small></div></div><div className="row-actions"><button type="button" onClick={() => editProduct(p)}>Edit</button><button type="button" onClick={() => deleteProduct(p.id)}>Delete</button></div></div>)}{!products.length && <p className="admin-note">No products yet.</p>}</div></section>
    <section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">ORDERS</p><h2>Recent orders</h2></div></div><div className="admin-table">{orders.map(o => <div className="admin-row" key={o.id}><div><strong>#{o.id.slice(0, 8)}</strong><small>{new Date(o.created_at).toLocaleString()} · ${Number(o.total).toFixed(2)} USD</small></div><select value={o.status} onChange={e => changeOrderStatus(o.id, e.target.value)}>{['pending','paid','processing','shipped','delivered','cancelled','refunded'].map(s => <option key={s}>{s}</option>)}</select></div>)}{!orders.length && <p className="admin-note">No orders yet.</p>}</div></section>
  </div></main>;
}
