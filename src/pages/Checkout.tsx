"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";

interface CartItem {
  id: number;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

export default function CheckoutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "The Future Of AI In Everyday Products",
      image: "/assets/dashboard-images/Cart1.jpg",
      quantity: 1,
      price: 19.0,
    },
    {
      id: 2,
      title: "The Future Of AI In Everyday Products",
      image: "/assets/dashboard-images/Cart1.jpg",
      quantity: 1,
      price: 19.0,
    },
  ]);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Correct event type
  function handlePayment(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setShowPaymentModal(true);
  }

  return (
    <>
      <HomeHeader search="" onSearchChange={null} userEmail="" avatarUrl="" onSignOut={null} />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-vietnam font-bold mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Billing Details */}
          <div className="bg-[#A3A3A3 10%] border border-zinc-800 rounded-lg p-8">
            <h2 className="text-2xl font-vietnam font-semibold mb-6">Billing Details</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block font-vietnam text-sm mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-vietnam text-sm mb-2">
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
                <label htmlFor="street" className="block text-sm font-vietnam mb-2">
                  Street Address
                </label>
                <Input
                  id="street"
                  placeholder="Street Address"
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-vietnam mb-2">
                  State/County
                </label>
                <Input
                  id="state"
                  placeholder="Lagos"
                  className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-vietnam text-sm mb-2">
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
                <label htmlFor="email" className="block font-vietnam text-sm mb-2">
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
                <label htmlFor="notes" className="block font-vietnam text-sm mb-2">
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
          <div className="bg-[#A3A3A3 10%] border border-zinc-800 rounded-lg p-8 h-fit">
            <h2 className="text-2xl font-vietnam font-semibold mb-6">Order Summary</h2>
            <div className="flex justify-between font-vietnam text-sm font-medium mb-6 pb-4 border-b border-zinc-800">
              <span>Product</span>
              <span>Amount</span>
            </div>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 font-vietnam p-1 hover:bg-zinc-900 rounded transition-colors"
                  >
                    <X className="h-4 w-4 text-zinc-500" />
                  </button>
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-vietnam font-medium mb-1">{item.title}</h3>
                    <p className="text-xs font-vietnam text-zinc-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-vietnam font-semibold">${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-lg font-vietnam font-semibold pt-4 border-t border-zinc-800 mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button
              onClick={handlePayment}
              className="w-full bg-[#70E002] hover:bg-[#73b812] font-vietnam text-black font-semibold py-6 text-base"
            >
              Pay with Paystack
            </Button>
          </div>
        </div>

        {/* Paystack Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-2 right-2 md:-top-3 md:-right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-1/3 bg-gray-50 p-4 md:p-6 rounded-t-lg md:rounded-l-lg md:rounded-tr-none border-b md:border-b-0 md:border-r border-gray-200">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">PAY WITH</h3>
                  <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                    <button className="flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-lg border-2 border-[#84cc16] text-left">
                      <div className="h-4 w-4 md:h-5 md:w-5 bg-[#84cc16] rounded flex items-center justify-center flex-shrink-0">
                        <Check className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">
                        Card
                      </span>
                    </button>
                    <button className="flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-lg border border-gray-200 text-left hover:border-gray-300 transition-colors">
                      <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                      <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">Bank</span>
                    </button>
                    <button className="flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-lg border border-gray-200 text-left hover:border-gray-300 transition-colors">
                      <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                      <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">GTB 737</span>
                    </button>
                    <button className="flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-lg border border-gray-200 text-left hover:border-gray-300 transition-colors">
                      <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                      <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">Mobile money</span>
                    </button>
                    <button className="flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-lg border border-gray-200 text-left hover:border-gray-300 transition-colors">
                      <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                      <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">Visa QR</span>
                    </button>
                  </div>
                </div>

                {/* Main Payment Form */}
                <div className="w-full md:w-2/3 p-4 md:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="8" width="16" height="2" fill="#00C3F7" />
                        <rect x="4" y="12" width="16" height="2" fill="#00C3F7" />
                        <rect x="4" y="16" width="10" height="2" fill="#00C3F7" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] md:text-xs text-gray-600">demo@paystack.com</p>
                      <p className="text-xs md:text-sm font-semibold text-[#84cc16]">Pay NGN 100</p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 text-center mb-4 md:mb-6">
                      Enter your card details to pay
                    </h2>

                    <div>
                      <label className="block text-[10px] md:text-xs font-medium text-gray-600 mb-1.5 md:mb-2">
                        CARD NUMBER
                      </label>
                      <Input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 md:h-11 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-[10px] md:text-xs font-medium text-gray-600 mb-1.5 md:mb-2">
                          CARD EXPIRY
                        </label>
                        <Input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 md:h-11 text-sm"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5 md:mb-2">
                          <label className="block text-[10px] md:text-xs font-medium text-gray-600">
                            CVV
                          </label>
                          <button className="text-[10px] md:text-xs text-blue-600 hover:underline">HELP?</button>
                        </div>
                        <Input
                          type="text"
                          placeholder="123"
                          className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 md:h-11 text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      className="w-full bg-[#84cc16] hover:bg-[#73b812] text-black font-semibold py-5 md:py-6 text-sm md:text-base rounded-lg"
                    >
                      Pay NGN 100
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
