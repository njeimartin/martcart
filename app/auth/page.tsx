"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
        else window.location.href = "/account";
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
        if (error) setMessage(error.message);
        else if (data.session) window.location.href = "/account";
        else setMessage("Account created. Check your email to confirm your account.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to complete authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <a className="logo" href="/">MART<span>CART</span></a>
        <p className="eyebrow">{mode === "login" ? "WELCOME BACK" : "JOIN MARTCART"}</p>
        <h1>{mode === "login" ? "Sign in to your account." : "Create your account."}</h1>
        <form onSubmit={submit}>
          {mode === "signup" && <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
          <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="button dark" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
        </form>
        {message && <p className="form-message" role="alert">{message}</p>}
        <button type="button" className="switch-auth" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>
          {mode === "login" ? "New to MARTCART? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
