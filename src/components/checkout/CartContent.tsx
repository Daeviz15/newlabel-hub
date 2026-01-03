"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import type { CartItem } from "@/types/checkout";

interface CartContentProps {
  items: CartItem[];
  total: number;
  onUpdateQuantity: (id: string | number, quantity: number) => void;
  onRemoveItem: (id: string | number) => void;
  checkoutRoute: string;
  brandColor?: string;
  isLoading?: boolean;
}

export function CartContent({
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  checkoutRoute,
  brandColor = "#70E002",
  isLoading = false,
}: CartContentProps) {
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  const handleRemove = async (id: string | number) => {
    setRemovingId(id);
    await onRemoveItem(id);
    setRemovingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-400" />
        <p className="text-zinc-400 mt-4">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-zinc-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2 font-vietnam">
          Your cart is empty
        </h2>
        <p className="text-zinc-400 mb-6 max-w-md">
          Looks like you haven't added any courses yet. Start exploring and find something you love!
        </p>
        <Button
          onClick={() => navigate("/catalogue")}
          className="font-vietnam text-black font-semibold py-3 px-8"
          style={{ backgroundColor: brandColor }}
        >
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg transition-all hover:border-zinc-700"
          >
            <img
              src={item.image || "/assets/dashboard-images/face.jpg"}
              alt={item.title}
              className="w-full sm:w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-vietnam font-semibold text-white text-lg mb-1">
                  {item.title}
                </h3>
                {item.creator && (
                  <p className="text-sm text-zinc-400">{item.creator}</p>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-zinc-700 hover:bg-zinc-800"
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-zinc-700 hover:bg-zinc-800"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Price & Remove */}
                <div className="flex items-center gap-4">
                  <span className="font-vietnam font-bold text-lg" style={{ color: brandColor }}>
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                  >
                    {removingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-vietnam font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal ({items.length} items)</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Discount</span>
              <span>₦0</span>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span style={{ color: brandColor }}>₦{total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            onClick={() => navigate(checkoutRoute)}
            className="w-full font-vietnam text-black font-semibold py-6 text-base transition-all hover:scale-[1.02]"
            style={{ backgroundColor: brandColor }}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartContent;
