import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecret) {
      throw new Error("Paystack secret key not configured");
    }

    // Verify webhook signature
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();

    const encoder = new TextEncoder();
    const keyData = encoder.encode(paystackSecret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );

    const signatureData = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );

    const computedSignature = Array.from(new Uint8Array(signatureData))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (computedSignature !== signature) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Paystack webhook event:", event.event);

    const metadata = event.data?.metadata ?? {};

    // Short-circuit for donations – we don't currently persist them server-side
    if (metadata.type === "donation") {
      console.log(
        `Received donation from user ${metadata.user_id} for amount ${metadata.donation_amount}`,
      );
      return new Response("OK", { status: 200 });
    }

    // Only process successful charges
    if (event.event === "charge.success") {
      const { user_id, cart_items } = event.data.metadata;

      if (!user_id || !cart_items) {
        console.error("Missing metadata in webhook");
        return new Response("Missing metadata", { status: 400 });
      }

      // Fetch product prices to record actual amounts
      const productIds = cart_items.map((item: any) => item.id);
      const { data: products, error: productsError } = await supabaseClient
        .from("products")
        .select("id, price")
        .in("id", productIds);

      if (productsError) {
        console.error("Error fetching products:", productsError);
        throw productsError;
      }

      // Create purchase records
      const purchases = cart_items.map((item: any) => {
        const product = products?.find((p) => p.id === item.id);
        return {
          user_id,
          product_id: item.id,
          amount_paid: product?.price || 0,
          payment_provider: "paystack",
          payment_reference: event.data.reference,
        };
      });

      const { error: insertError } = await supabaseClient
        .from("purchases")
        .insert(purchases);

      if (insertError) {
        console.error("Error creating purchases:", insertError);
        throw insertError;
      }

      // Clear user's cart after successful purchase
      const { error: clearCartError } = await supabaseClient
        .from("cart_items")
        .delete()
        .eq("user_id", user_id)
        .in("product_id", productIds);

      if (clearCartError) {
        console.error("Error clearing cart:", clearCartError);
        // Don't throw - purchases already created
      }

      console.log(`Successfully processed purchase for user ${user_id}`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
