"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";


interface CartItem {
  id: number
  title: string
  image: string
  quantity: number
  price: number
}

export default function CheckoutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  ])

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
                  <label htmlFor="firstName" className="block font-vietnam text-sm mb-2">First Name</label>
                  <Input id="firstName" placeholder="First name" className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-vietnam text-sm mb-2">Last Name</label>
                  <Input id="lastName" placeholder="Last name" className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600" />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm mb-2">Country/Region</label>
                <Input id="country" placeholder="Nigeria" className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600" />
              </div>
              <div>
                <label htmlFor="street" className="block text-sm font-vietnam mb-2">Street Address</label>
                <Input id="street" placeholder="Street Address" className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600" />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-vietnam mb-2">State/County</label>
                <Input id="state" placeholder="Lagos" className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600" />
              </div>
              <div>
                <label htmlFor="phone" className="block font-vietnam text-sm mb-2">Phone Number</label>
                <Input id="phone" type="tel" placeholder="Phone number" className="bg-zinc-900 border-zinc-800 font-vietnam  text-white placeholder:text-zinc-600" />
              </div>
              <div>
                <label htmlFor="email" className="block font-vietnam text-sm mb-2">Email Address</label>
                <Input id="email" type="email" placeholder="Your Email" className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600" />
              </div>
              <div>
                <label htmlFor="notes" className="block font-vietnam text-sm mb-2">Additional Notes</label>
                <Textarea id="notes" placeholder="Special notes for delivery" rows={6} className="bg-zinc-900 border-zinc-800 font-vietnam text-white placeholder:text-zinc-600 resize-none" />
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
                  <button onClick={() => removeItem(item.id)} className="flex-shrink-0 font-vietnam p-1 hover:bg-zinc-900 rounded transition-colors">
                    <X className="h-4 w-4 text-zinc-500" />
                  </button>
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-sm font-vietnam font-medium mb-1">{item.title}</h3>
                    <p className="text-xs font-vietnam text-zinc-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-vietnam  font-semibold">${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-lg font-vietnam font-semibold pt-4 border-t border-zinc-800 mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-[#70E002] hover:bg-[#73b812] font-vietnam text-black font-semibold py-6 text-base">Pay with Paystack</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}