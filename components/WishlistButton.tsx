'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function WishlistButton({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function toggle() {
    setBusy(true); setMessage('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = '/auth'; return; }
    let { data: wishlist } = await supabase.from('wishlists').select('id').eq('user_id', user.id).maybeSingle();
    if (!wishlist) {
      const created = await supabase.from('wishlists').insert({ user_id: user.id }).select('id').single();
      if (created.error) { setMessage(created.error.message); setBusy(false); return; }
      wishlist = created.data;
    }
    const existing = await supabase.from('wishlist_items').select('id').eq('wishlist_id', wishlist.id).eq('product_id', productId).maybeSingle();
    if (existing.data) {
      const { error } = await supabase.from('wishlist_items').delete().eq('id', existing.data.id);
      setMessage(error ? error.message : 'Removed from wishlist.');
    } else {
      const { error } = await supabase.from('wishlist_items').insert({ wishlist_id: wishlist.id, product_id: productId });
      setMessage(error ? error.message : 'Added to wishlist ❤️');
    }
    setBusy(false);
  }

  return <div><button type="button" className="button light" disabled={busy} onClick={toggle}>{busy ? 'Saving…' : '♡ Wishlist'}</button>{message && <small className="wishlist-message">{message}</small>}</div>;
}
