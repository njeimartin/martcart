"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => { setEmail(data.user?.email ?? null); setLoading(false); });
  }, []);

  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = "/";
  }

  if (loading) return <main className="auth-page"><div className="auth-card"><p>Loading account…</p></div></main>;
  if (!email) return <main className="auth-page"><div className="auth-card"><h1>Please sign in.</h1><a className="button dark" href="/auth">Go to sign in</a></div></main>;

  return <main className="account-page"><div className="container account-card"><p className="eyebrow">MY ACCOUNT</p><h1>Welcome back.</h1><p>{email}</p><div className="account-links"><a href="/shop">Continue shopping →</a><a href="/cart">View cart →</a></div><button className="button dark" onClick={signOut}>Sign out</button></div></main>;
}
