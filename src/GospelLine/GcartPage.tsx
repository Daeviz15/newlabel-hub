"use client";

import { memo, useCallback, useState } from "react";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/use-user-profile";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import JsityFooter from "./components/GFooter";
import { THomeHeader } from "./components/home-header";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export function GcartPage() {
  const navigate = useNavigate();
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const {
    state,
    updateQuantity: updateCartQuantity,
    removeItem: removeCartItem,
  } = useCart();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const cartItems = state.items.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));

  const updateQuantity = useCallback(
    async (id: string, delta: number) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      const newQuantity = item.quantity + delta;
      if (newQuantity < 1) return;

      setLoading(true);
      try {
        await updateCartQuantity(id, newQuantity);
        toast({
          title: "Cart updated",
          description: "Quantity updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [state.items, updateCartQuantity, toast]
  );

  const removeItem = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await removeCartItem(id);
        toast({
          title: "Item removed",
          description: "Product removed from cart",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove item",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [removeCartItem, toast]
  );

  const calculateSubtotal = useCallback((price: number, quantity: number) => {
    return (price * quantity).toFixed(2);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black">
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-zinc-900 rounded-lg p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#70E002] animate-spin" />
            <p className="text-white text-sm">Updating cart...</p>
          </div>
        </div>
      )}
      <THomeHeader
        search={search}
        onSearchChange={(q: string) => setSearch(q)}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-6 md:space-y-8">
          {/* Table Header - Desktop Only */}
          <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b border-zinc-800 text-zinc-400 text-sm font-medium">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 md:space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400 text-lg">Your cart is empty</p>
                <Button
                  onClick={() => navigate("/gospel-courses")}
                  className="mt-4 bg-[#70E002] text-black hover:bg-[#4BA600]"
                >
                  Browse Courses
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  calculateSubtotal={calculateSubtotal}
                />
              ))
            )}
          </div>

          {/* Checkout Button */}
          {cartItems.length > 0 && (
            <div className="flex justify-end pt-6 md:pt-8">
              <Button
                size="lg"
                onClick={() => navigate("/gospel-checkout")}
                className="w-full sm:w-auto bg-[#70E002] text-black hover:bg-[#4BA600] font-medium px-8 md:px-12"
              >
                Proceed to checkout
              </Button>
            </div>
          )}
        </div>
      </main>
      <JsityFooter />
    </div>
  );
}

// Memoized cart row to reduce re-renders when unrelated state changes
const CartRow = memo(function CartRow({
  item,
  updateQuantity,
  removeItem,
  calculateSubtotal,
}: {
  item: CartItem;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  calculateSubtotal: (price: number, quantity: number) => string;
}) {
  return (
    <div>
      <div className="hidden lg:grid grid-cols-12 gap-4 items-center py-4 border-b border-zinc-800/50">
        {/* Product */}
        <div className="col-span-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="relative w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="text-white font-medium">{item.title}</h3>
        </div>

        {/* Price */}
        <div className="col-span-2 text-center text-white font-medium">
          ₦{item.price.toFixed(2)}
        </div>

        {/* Quantity Controls */}
        <div className="col-span-2 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(item.id, -1)}
            className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-8 text-center text-white font-medium">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(item.id, 1)}
            className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Subtotal */}
        <div className="col-span-2 text-right text-white font-medium">
          ₦{calculateSubtotal(item.price, item.quantity)}
        </div>
      </div>

      <div className="lg:hidden bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-white font-medium text-sm sm:text-base line-clamp-2">
                {item.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 shrink-0 w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Price and Quantity Row */}
            <div className="flex items-center justify-between gap-4">
              <div className="text-white font-medium">
                ₦{item.price.toFixed(2)}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center text-white font-medium text-sm">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Subtotal</span>
              <span className="text-white font-medium">
                ₦{calculateSubtotal(item.price, item.quantity)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
