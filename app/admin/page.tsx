'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function addProduct(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setStatus('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in before adding products.');
      if (!name.trim() || !Number(price) || Number(price) <= 0) throw new Error('Enter a product name and valid USD price.');

      let imageUrl: string | null = null;
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const upload = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type });
        if (upload.error) throw upload.error;
        imageUrl = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
      }

      const slug = `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
      const { error } = await supabase.from('products').insert({ name: name.trim(), slug, description: description.trim() || null, price: Number(price), currency: 'USD', stock_quantity: Math.max(0, Number(stock) || 0), main_image_url: imageUrl, is_active: true });
      if (error) throw error;
      setName(''); setPrice(''); setStock(''); setDescription(''); setFile(null);
      const input = document.getElementById('product-image') as HTMLInputElement | null; if (input) input.value = '';
      setStatus('Product added successfully.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to add product.');
    } finally { setSaving(false); }
  }

  return <main className="admin-page"><div className="container admin-card"><p className="eyebrow">MARTCART ADMIN</p><h1>Add a product</h1><p className="admin-note">Upload product photos from your phone and save products directly to Supabase.</p><form onSubmit={addProduct} className="admin-form"><label>Product name<input value={name} onChange={e => setName(e.target.value)} required /></label><label>Price (USD)<input type="number" min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required /></label><label>Stock quantity<input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} /></label><label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} /></label><label>Product image<input id="product-image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label><button className="button dark" disabled={saving}>{saving ? 'Saving...' : 'Add product'}</button>{status && <p className="admin-status">{status}</p>}</form></div></main>;
}
