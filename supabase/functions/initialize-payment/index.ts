import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { cart_items } = await req.json();

    if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
      throw new Error("Cart items are required");
    }

    // Fetch actual prices from database (never trust client)
    const productIds = cart_items.map((item: any) => item.id);
    const { data: products, error: productsError } = await supabaseClient
      .from("products")
      .select("id, price, title")
      .in("id", productIds);

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
      throw new Error("No valid products found");
    }

    // Calculate total from authoritative database prices
    const total = products.reduce((sum: number, product: any) => {
      const cartItem = cart_items.find((item: any) => item.id === product.id);
      const quantity = cartItem?.quantity || 1;
      return sum + product.price * quantity;
    }, 0);

    // Initialize Paystack payment
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: Math.round(total * 100), // Paystack uses kobo (smallest currency unit)
          currency: "NGN",
          callback_url: `${req.headers.get("origin")}/mylibrary?payment=success`,
          metadata: {
            user_id: user.id,
            cart_items: cart_items.map((item: any) => ({
              id: item.id,
              quantity: item.quantity || 1,
            })),
          },
        }),
      }
    );

    const paystackData = await response.json();

    if (!paystackData.status) {
      throw new Error(
        paystackData.message || "Failed to initialize payment"
      );
    }

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
