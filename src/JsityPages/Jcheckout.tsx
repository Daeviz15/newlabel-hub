"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JHomeHeader } from "./components/home-header";
import JsityFooter from "./components/JsityFooter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

  const handlePayment = async () => {
    if (cartState.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessingPayment(true);
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
    } finally {
      setIsProcessingPayment(false);
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
      navigate("/mylibrary");
    }
  }, [clearCart, toast, navigate]);

  const total = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Billing Details */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
            <h2 className="text-2xl font-vietnam font-semibold mb-6">
              Billing Details
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block font-vietnam text-sm mb-2"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    className="bg-zinc-900 font-vietnam text-white placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block font-vietnam text-sm mb-2"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm mb-2">
                  Country/Region
                </label>
                <Input
                  id="country"
                  placeholder="Nigeria"
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-vietnam mb-2"
                >
                  Street Address
                </label>
                <Input
                  id="street"
                  placeholder="Street Address"
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-vietnam mb-2"
                >
                  State/County
                </label>
                <Input
                  id="state"
                  placeholder="Lagos"
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block font-vietnam text-sm mb-2"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone number"
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-vietnam text-sm mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block font-vietnam text-sm mb-2"
                >
                  Additional Notes
                </label>
                <Textarea
                  id="notes"
                  placeholder="Special notes for delivery"
                  rows={6}
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600 resize-none"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 h-fit">
            <h2 className="text-2xl font-vietnam font-semibold mb-6">
              Order Summary
            </h2>
            <div className="flex justify-between font-vietnam text-sm font-medium mb-6 pb-4 border-b border-zinc-800">
              <span>Product</span>
              <span>Amount</span>
            </div>

            <div className="space-y-4 mb-6">
              {cartState.items.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">
                  Your cart is empty
                </p>
              ) : (
                cartState.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-vietnam font-medium mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs font-vietnam text-zinc-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-vietnam font-semibold">
                      ₦{item.price.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between text-lg font-vietnam font-semibold pt-4 border-t border-zinc-800 mb-6">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <Button
              onClick={handlePayment}
              disabled={isProcessingPayment || cartState.items.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-400 font-vietnam font-semibold py-6 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? "Processing..." : "Pay with Paystack"}
            </Button>
          </div>
        </div>
      </div>

      <JsityFooter />
    </main>
  );
}
