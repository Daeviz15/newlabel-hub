import { cn } from "@/lib/utils"

type BrandMarkProps = { className?: string }

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative h-7 w-7 rounded-md bg-lime-500">
        <div className="absolute inset-1 rounded-[4px] bg-black" />
        <div className="absolute left-[6px] top-[6px] h-3 w-3 rotate-45 rounded-[2px] bg-lime-500" />
      </div>
    </div>
  )
}
