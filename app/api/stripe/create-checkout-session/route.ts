import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });

    const stripe = new Stripe(secretKey);
    const { items, customerEmail, shipping } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const ids = [...new Set(items.map((item: any) => String(item.productId || "")).filter(Boolean))];
    if (!ids.length) return NextResponse.json({ error: "Invalid cart." }, { status: 400 });

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, name, slug, price, currency, main_image_url, stock_quantity, is_active")
      .in("id", ids)
      .eq("is_active", true);

    if (productError) throw productError;
    const productMap = new Map((products ?? []).map((product) => [product.id, product]));

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItems: Array<{ product_id: string; product_name: string; unit_price: number; quantity: number; line_total: number }> = [];

    for (const item of items) {
      const product = productMap.get(String(item.productId));
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      if (!product) return NextResponse.json({ error: "A product in your cart is no longer available." }, { status: 400 });
      if (product.stock_quantity < quantity) return NextResponse.json({ error: `${product.name} does not have enough stock.` }, { status: 400 });

      const price = Number(product.price);
      if (!Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "A product has an invalid price." }, { status: 400 });

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: product.name, ...(product.main_image_url ? { images: [product.main_image_url] } : {}) },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      });
      orderItems.push({ product_id: product.id, product_name: product.name, unit_price: price, quantity, line_total: price * quantity });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const metadata = {
      source: "martcart",
      user_id: user?.id || "",
      items: JSON.stringify(orderItems),
      shipping_name: String(shipping?.name || "").slice(0, 450),
      shipping_phone: String(shipping?.phone || "").slice(0, 450),
      shipping_address: String(shipping?.address || "").slice(0, 450),
      shipping_city: String(shipping?.city || "").slice(0, 450),
      shipping_country: String(shipping?.country || "").slice(0, 450),
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customerEmail || user?.email || undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=true`,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["CM", "US", "GB", "CA", "NG"] },
      phone_number_collection: { enabled: true },
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Unable to create Stripe checkout session." }, { status: 500 });
  }
}
