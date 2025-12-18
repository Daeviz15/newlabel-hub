"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { THomeHeader } from "./components/home-header";
import ThcFooter from "./components/ThcFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const PRESET_AMOUNTS = [1000, 5000, 10000];

export default function ThcDonate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const donationTarget = (location.state as
    | { productId?: string; productTitle?: string }
    | null) ?? { productId: undefined, productTitle: undefined };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleSelectPreset = (value: number) => {
    setAmount(value);
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setAmount("");
      return;
    }
    const num = Number(value);
    if (!Number.isNaN(num) && num >= 0) {
      setAmount(num);
    }
  };

  const handleDonate = async () => {
    const numericAmount = typeof amount === "number" ? amount : Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: "Enter a valid amount",
        description: "Please enter a positive donation amount.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "initialize-donation",
        {
          body: {
            amount: numericAmount,
            brand: "thc",
            productId: donationTarget.productId,
            productTitle: donationTarget.productTitle,
          },
        },
      );

      if (error) {
        throw error;
      }

      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No payment URL received from Paystack");
      }
    } catch (err: unknown) {
      console.error("Donation initialization error:", err);
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast({
        title: "Unable to start donation",
        description:
          message ||
          "We couldn't start the donation process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle donation success redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("donation") === "success") {
      toast({
        title: "Thank you for your donation!",
        description: "Your support helps sustain THC and its content.",
      });
      window.history.replaceState({}, "", "/thc-dashboard");
    }
  }, [toast]);

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <THomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-vietnam mb-3">
            {donationTarget.productTitle
              ? `Support "${donationTarget.productTitle}"`
              : "Support THC with a Donation"}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            {donationTarget.productTitle
              ? "Your generosity helps keep this course available and supports future content like it. Choose a preset amount or enter any amount you feel led to give."
              : "Your generosity helps us keep creating and sharing life-giving content. Choose a preset amount or enter any amount you feel led to give."}
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 mb-3 font-vietnam">
              Choose an amount
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PRESET_AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelectPreset(value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold font-vietnam transition-all
                    ${
                      amount === value
                        ? "bg-[#70E002] border-[#70E002] text-black"
                        : "bg-[#151515] border-white/10 text-white hover:border-[#70E002]"
                    }`}
                >
                  ₦{value.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="donation-amount"
                className="text-xs font-medium text-zinc-400 font-vietnam"
              >
                Or enter a custom amount (NGN)
              </label>
              <Input
                id="donation-amount"
                type="number"
                min={0}
                value={amount === "" ? "" : amount}
                onChange={handleChangeAmount}
                className="bg-[#151515] border-white/10 text-white placeholder:text-zinc-500 font-vietnam"
                placeholder="e.g. 2500"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleDonate}
              disabled={isSubmitting}
              className="w-full bg-[#70E002] hover:bg-[#4BA600] text-black font-semibold font-vietnam py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Redirecting to Paystack..." : "Donate with Paystack"}
            </Button>
          </div>
        </div>
      </div>

      <ThcFooter />
    </main>
  );
}


