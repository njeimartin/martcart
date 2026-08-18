import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);
    const { items, customerEmail } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => {
      const price = Number(item.price);
      const quantity = Math.max(1, Number(item.quantity) || 1);

      if (!item.name || !Number.isFinite(price) || price <= 0) {
        throw new Error("Invalid cart item.");
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: String(item.name),
            ...(item.imageUrl ? { images: [String(item.imageUrl)] } : {}),
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      };
    });

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customerEmail || undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=true`,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["CM", "US", "GB", "CA", "NG"],
      },
      metadata: {
        source: "martcart",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Unable to create Stripe checkout session." }, { status: 500 });
  }
}
