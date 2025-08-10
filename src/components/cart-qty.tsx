"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type QtyProps = {
  value?: number
  min?: number
  max?: number
  className?: string
  onChange?: (value: number) => void
}

export function CartQty({ value = 1, min = 1, max = 99, className, onChange }: QtyProps) {
  const [qty, setQty] = useState(Math.min(Math.max(value, min), max))

  function set(value: number) {
    const next = Math.min(Math.max(value, min), max)
    setQty(next)
    onChange?.(next)
  }

  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-md bg-[#1f1f1f] px-2 text-sm text-white ring-1 ring-white/10",
        className,
      )}
      role="group"
      aria-label="Quantity"
    >
      <Button
        type="button"
        variant="ghost"
        className="h-6 w-6 rounded-[6px] p-0 text-zinc-300 hover:bg-white/5"
        onClick={() => set(qty - 1)}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="tabular-nums">{qty}</span>
      <Button
        type="button"
        variant="ghost"
        className="h-6 w-6 rounded-[6px] p-0 text-zinc-300 hover:bg-white/5"
        onClick={() => set(qty + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
