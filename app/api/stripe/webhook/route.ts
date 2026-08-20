import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) return new NextResponse("Stripe webhook is not configured.", { status: 500 });

  const stripe = new Stripe(secretKey);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing Stripe signature.", { status: 400 });

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") return NextResponse.json({ received: true });

    const admin = createAdminSupabaseClient();
    const paymentReference = session.payment_intent ? String(session.payment_intent) : session.id;
    const { data: existing } = await admin.from("orders").select("id").eq("payment_reference", paymentReference).maybeSingle();
    if (existing) return NextResponse.json({ received: true, duplicate: true });

    const items = JSON.parse(session.metadata?.items || "[]") as Array<{ product_id: string; product_name: string; unit_price: number; quantity: number; line_total: number }>;
    if (!items.length) throw new Error("Stripe session has no order items.");

    const subtotal = items.reduce((sum, item) => sum + Number(item.line_total), 0);
    const shippingDetails = session.collected_information?.shipping_details;
    const metadata = session.metadata || {};
    const userId = metadata.user_id || null;

    const { data: order, error: orderError } = await admin.from("orders").insert({
      user_id: userId,
      status: "processing",
      subtotal,
      shipping_fee: 0,
      discount_amount: 0,
      total: Number(session.amount_total || Math.round(subtotal * 100)) / 100,
      currency: "USD",
      payment_status: "paid",
      payment_provider: "stripe",
      payment_reference: paymentReference,
      shipping_name: metadata.shipping_name || shippingDetails?.name || null,
      shipping_phone: metadata.shipping_phone || session.customer_details?.phone || null,
      shipping_address: metadata.shipping_address || shippingDetails?.address?.line1 || null,
      shipping_city: metadata.shipping_city || shippingDetails?.address?.city || null,
      shipping_country: metadata.shipping_country || shippingDetails?.address?.country || null,
    }).select("id").single();

    if (orderError) throw orderError;

    const { error: itemsError } = await admin.from("order_items").insert(items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      line_total: item.line_total,
    })));
    if (itemsError) throw itemsError;

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return new NextResponse("Webhook error.", { status: 400 });
  }
}
