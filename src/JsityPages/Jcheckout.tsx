"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useUserProfile } from "@/hooks/use-user-profile";
import { CheckoutForm } from "@/components/checkout";
import { JHomeHeader } from "./components/home-header";
import JsityFooter from "./components/JsityFooter";
import type { BillingDetails, CartItem } from "@/types/checkout";

const BRAND_COLOR = "#8B5CF6"; // Jsity purple

export default function Jcheckout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state: cartState, clearCart } = useCart();
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Add purple focus styles for this page only
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .jcheckout-page input:focus-visible,
      .jcheckout-page textarea:focus-visible {
        outline: none !important;
        border-color: rgb(147 51 234) !important;
        box-shadow: 0 0 0 2px rgb(147 51 234 / 0.2) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handlePayment = async (billingDetails: BillingDetails) => {
    if (cartState.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to complete your purchase",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "initialize-payment",
        {
          body: {
            cart_items: cartState.items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
            billing_details: {
              first_name: billingDetails.firstName,
              last_name: billingDetails.lastName,
              email: billingDetails.email,
              phone: billingDetails.phone,
              country: billingDetails.country,
              state: billingDetails.state,
              street: billingDetails.street,
              notes: billingDetails.notes,
            },
          },
        }
      );

      if (error) throw error;

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      toast({
        title: "Payment failed",
        description: error.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check for payment success callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
      clearCart();
      toast({
        title: "Payment successful!",
        description: "Your courses have been added to your library",
      });
      window.history.replaceState({}, "", "/mylibrary");
    }
  }, [clearCart, toast]);

  // Map cart items to the expected type
  const cartItems: CartItem[] = cartState.items.map((item) => ({
    id: item.id,
    title: item.title,
    image: item.image,
    quantity: item.quantity,
    price: item.price,
    creator: item.creator,
  }));

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white jcheckout-page">
      <JHomeHeader
        search=""
        onSearchChange={() => {}}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <h1 className="text-xl sm:text-2xl font-vietnam font-bold mb-6 sm:mb-8 md:mb-12">
          Checkout
        </h1>

        <CheckoutForm
          cartItems={cartItems}
          total={cartState.total}
          userName={userName ?? ""}
          userEmail={userEmail ?? ""}
          onPayment={handlePayment}
          isProcessing={isProcessingPayment}
          brandColor={BRAND_COLOR}
        />
      </div>

      <JsityFooter />
    </main>
  );
}
