"use client";

import { CartRow } from "../components/cart-row";
import { Button } from "@/components/ui/button";
import { HomeHeader } from "@/components/home-header";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { state, removeItem } = useCart();

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  return (
    <main className="min-h-[100dvh] bg-[#0b0b0b] text-white">
      <HomeHeader
        search=""
        onSearchChange={null}
        userEmail=""
        avatarUrl=""
        onSignOut={null}
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
        <section className="py-10 md:py-14">
          <h1 className="text-2xl font-semibold font-vietnam tracking-tight sm:text-3xl">
            Cart
          </h1>
        </section>

        <section aria-labelledby="cart-heading" className="pb-6">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] font-vietnam items-end gap-4 px-0 text-sm text-zinc-300 sm:gap-6">
            <div />
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Subtotal</div>
          </div>
          <div className="mt-3 h-px w-full bg-white/10" />
        </section>

        <section
          role="table"
          aria-label="Shopping cart items"
          className="divide-y divide-white/10"
        >
          {state.items.map((item) => (
            <CartRow
              key={item.id}
              id={item.id}
              title={item.title}
              price={parseFloat(item.price.replace('$', ''))}
              qty={item.quantity}
              image={item.image}
              onRemove={handleRemoveItem}
            />
          ))}
        </section>

        <div className="h-px w-full bg-white/10" />

        <div className="flex items-center justify-end py-10">
          <Button className="h-10 rounded-md font-vietnam bg-[#70E002] px-6 text-[#121212] hover:bg-lime-400">
            Proceed to checkout
          </Button>
        </div>

        <div className="h-6 md:h-10" />
      </div>
    </main>
  );
}