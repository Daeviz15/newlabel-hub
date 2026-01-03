"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { useUserProfile } from "@/hooks/use-user-profile";

interface BillingDetails {
  firstName: string;
  lastName: string;
  country: string;
  street: string;
  state: string;
  phone: string;
  email: string;
  notes: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  country?: string;
  street?: string;
  state?: string;
  phone?: string;
  email?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state: cartState, clearCart } = useCart();
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const total = cartState.total;

  // Billing form state
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: "",
    lastName: "",
    country: "Nigeria",
    street: "",
    state: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Pre-fill email from user profile
  useEffect(() => {
    if (userEmail) {
      setBillingDetails((prev) => ({ ...prev, email: userEmail }));
    }
    if (userName) {
      const nameParts = userName.split(" ");
      setBillingDetails((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
      }));
    }
  }, [userEmail, userName]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validateField = (name: keyof BillingDetails, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        return value.trim() ? undefined : "First name is required";
      case "lastName":
        return value.trim() ? undefined : "Last name is required";
      case "country":
        return value.trim() ? undefined : "Country is required";
      case "street":
        return value.trim() ? undefined : "Street address is required";
      case "state":
        return value.trim() ? undefined : "State is required";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        return validatePhone(value) ? undefined : "Enter a valid phone number";
      case "email":
        if (!value.trim()) return "Email is required";
        return validateEmail(value) ? undefined : "Enter a valid email address";
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(billingDetails) as (keyof BillingDetails)[]).forEach((key) => {
      if (key !== "notes") {
        const error = validateField(key, billingDetails[key]);
        if (error) {
          newErrors[key as keyof FormErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof BillingDetails, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  async function handlePayment(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // Validate form first
    if (!validateForm()) {
      toast({
        title: "Please fill in all required fields",
        description: "Check the form for errors and try again",
        variant: "destructive",
      });
      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {};
      Object.keys(billingDetails).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return;
    }

    if (cartState.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);

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

      // Call edge function to initialize payment with billing details
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
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      toast({
        title: "Payment failed",
        description:
          error.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  }

  // Check for payment success callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
      clearCart();
      toast({
        title: "Payment successful!",
        description: "Your courses have been added to your library",
      });
      // Clean up URL
      window.history.replaceState({}, "", "/mylibrary");
    }
  }, []);

  const getInputClassName = (fieldName: keyof FormErrors) => {
    const baseClass = "bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600";
    const errorClass = touched[fieldName] && errors[fieldName] ? "border-red-500 focus:border-red-500" : "";
    return `${baseClass} ${errorClass}`;
  };

  return (
    <>
      <HomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />

      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <h1 className="text-xl sm:text-2xl font-vietnam font-bold mb-6 sm:mb-8 md:mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Billing Details */}
          <div className="bg-[#A3A3A3 10%] border border-zinc-800 rounded-lg p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-vietnam font-semibold mb-4 sm:mb-6">
              Billing Details
            </h2>
            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="block font-vietnam text-sm mb-2">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={billingDetails.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="First name"
                    className={getInputClassName("firstName")}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="block font-vietnam text-sm mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={billingDetails.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Last name"
                    className={getInputClassName("lastName")}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="country" className="block text-sm mb-2">
                  Country/Region <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={billingDetails.country}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Nigeria"
                  className={getInputClassName("country")}
                />
                {touched.country && errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <Label htmlFor="street" className="block text-sm font-vietnam mb-2">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={billingDetails.street}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Street Address"
                  className={getInputClassName("street")}
                />
                {touched.street && errors.street && (
                  <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state" className="block text-sm font-vietnam mb-2">
                  State/County <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={billingDetails.state}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Lagos"
                  className={getInputClassName("state")}
                />
                {touched.state && errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="block font-vietnam text-sm mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={billingDetails.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Phone number"
                  className={getInputClassName("phone")}
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="block font-vietnam text-sm mb-2">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={billingDetails.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Your Email"
                  className={getInputClassName("email")}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="notes" className="block font-vietnam text-sm mb-2">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={billingDetails.notes}
                  onChange={handleInputChange}
                  placeholder="Special notes for delivery"
                  rows={6}
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600 resize-none"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-[#A3A3A3 10%] border border-zinc-800 rounded-lg p-4 sm:p-6 md:p-8 h-fit">
            <h2 className="text-xl sm:text-2xl font-vietnam font-semibold mb-4 sm:mb-6">
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
                      src={item.image || "/assets/dashboard-images/face.jpg"}
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
                      ₦{(item.price * item.quantity).toLocaleString()}
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
              className="w-full bg-[#70E002] hover:bg-[#73b812] font-vietnam text-black font-semibold py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? "Processing..." : "Pay with Paystack"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
