"use client";

import { CartRow } from "../components/cart-row";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { HomeHeader } from "@/components/home-header";

type Item = {
  id: string;
  title: string;
  price: number;
  qty: number;
  image: string;
};

const initialItems: Item[] = [
  {
    id: "1",
    title: "The Future Of AI In Everyday Products",
    price: 19,
    qty: 2,
    image: "/images/product-thumb.png",
  },
  {
    id: "2",
    title: "The Future Of AI In Everyday Products",
    price: 19,
    qty: 2,
    image: "/images/product-thumb.png",
  },
];

export default function CartPage() {
  const [items, setItems] = useState<Item[]>(initialItems);

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Compute totals (mirrors the subtotals shown)
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

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
        {/* Page Title */}
        <section className="py-10 md:py-14">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Cart
          </h1>
        </section>

        {/* Table Header */}
        <section aria-labelledby="cart-heading" className="pb-6">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-end gap-4 px-0 text-sm text-zinc-300 sm:gap-6">
            <div />
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Subtotal</div>
          </div>
          <div className="mt-3 h-px w-full bg-white/10" />
        </section>

        {/* Rows */}
        <section
          role="table"
          aria-label="Shopping cart items"
          className="divide-y divide-white/10"
        >
          {items.map((item) => (
            <CartRow
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              qty={item.qty}
              image={item.image}
              onRemove={removeItem}
            />
          ))}
        </section>

        {/* Bottom divider */}
        <div className="h-px w-full bg-white/10" />

        {/* CTA row */}
        <div className="flex items-center justify-end py-10">
          <Button className="h-10 rounded-md bg-lime-500 px-6 text-black hover:bg-lime-400">
            Proceed to checkout
          </Button>
        </div>

        {/* Spacer above your footer (if present globally) */}
        <div className="h-6 md:h-10" />
      </div>
    </main>
  );
}
