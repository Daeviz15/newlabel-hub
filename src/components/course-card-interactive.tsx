import { Heart } from "lucide-react"

type CourseCardProps = {
  id: string
  image: string
  title: string
  creator: string
  price: string
  onAddToCart: () => void
  onViewDetails: () => void
  accent?: 'lime' | 'purple'
}

export function CourseCard({
  id,
  image,
  title,
  creator,
  price,
  onAddToCart,
  onViewDetails,
  accent = 'lime',
}: CourseCardProps) {
  const ringHoverClass = accent === 'purple' ? 'hover:ring-purple-500' : 'hover:ring-lime-500'
  const priceTextClass = accent === 'purple' ? 'text-purple-400' : 'text-lime-400'
  const priceRingClass = accent === 'purple' ? 'ring-purple-500/40' : 'ring-lime-500/40'
  const titleHoverClass = accent === 'purple' ? 'group-hover:text-purple-400' : 'group-hover:text-lime-400'
  return (
    <div className={`group relative overflow-hidden rounded-xl border border-white/10 bg-[#151515] hover:ring-2 ${ringHoverClass} transition-all duration-300 cursor-pointer`}>
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <span className={`rounded-sm bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold ${priceTextClass} ring-1 ${priceRingClass}`}>
          {price}
        </span>
      </div>
      <button
        onClick={onAddToCart}
        className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/60 ring-1 ring-white/10 transition-colors hover:bg-black/80"
        aria-label="Add to cart"
      >
        <Heart className="h-4 w-4 text-white" />
      </button>

      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20" onClick={onViewDetails}>
        <img
          src={image || "/placeholder.svg"}
          alt={`${title} poster`}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="space-y-1 p-4" onClick={onViewDetails}>
        <div className={`line-clamp-2 text-[13px] font-semibold leading-snug text-white ${titleHoverClass} transition-colors`}>
          {title}
        </div>
        <div className="text-[11px] text-zinc-400">{creator}</div>
      </div>
    </div>
  )
}
