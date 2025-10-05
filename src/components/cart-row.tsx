"use client";

import { X } from "lucide-react";
import { CartQty } from "./cart-qty";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type CartRowProps = {
  id?: string | number;
  title?: string;
  price?: number;
  qty?: number;
  image?: string;
  className?: string;
  onRemove?: (id: string | number) => void;
};

export function CartRow({
  id = "1",
  title = "The Future Of AI In Everyday Products",
  price = 19,
  qty = 2,
  image,
  className,
  onRemove,
}: CartRowProps) {
  const [count, setCount] = useState(qty);
  const subtotal = useMemo(() => (price * count).toFixed(2), [price, count]);

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 py-6 text-white",
        "sm:gap-6 md:py-8",
        className
      )}
      role="row"
      aria-label={`Cart item ${title}`}
    >
      <button
        className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-zinc-300 hover:bg-white/5"
        aria-label={`Remove ${title}`}
        onClick={() => onRemove?.(id)}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-4">
        <div className="relative h-14 w-20 overflow-hidden rounded-sm bg-black/20 ring-1 ring-white/10">
          <img
            src={image && image.trim() !== "" ? image : "/placeholder.svg"}
            alt="Product image"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="text-sm text-zinc-200">{title}</div>
      </div>

      <div className="text-sm text-zinc-200">${price.toFixed(2)}</div>

      <CartQty value={count} onChange={setCount} />

      <div className="text-sm font-medium text-zinc-100">${subtotal}</div>
    </div>
  );
}
