import { cn } from "@/lib/utils"
import { Heart, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

type ResumeCardProps = {
  imageSrc?: string
  title?: string
  percent?: number
  brand?: string
}

export function ResumeCard({
  imageSrc = "/portrait-course-poster.png",
  title = "The Future Of AI In Everyday Products",
  percent = 72,
  brand = "jsty",
}: ResumeCardProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#151515]">
      <div className="absolute left-3 top-3 z-10 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-zinc-200 ring-1 ring-white/10">
        {brand}
      </div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={`${title} poster`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">{title}</h3>
        <div className="mt-2 h-2 w-full rounded-full bg-zinc-800">
          <div
            className="h-2 rounded-full bg-lime-500"
            style={{ width: `${clamped}%` }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clamped}
            role="progressbar"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">{clamped}%</span>
          <Button
            size="sm"
            className="h-8 rounded-md bg-lime-500 px-3 text-xs font-medium text-black hover:bg-lime-400"
          >
            <Play className="mr-1 h-3.5 w-3.5" />
            Resume Playing
          </Button>
        </div>
      </div>
    </div>
  )
}

type ProductCardProps = {
  imageSrc?: string
  title?: string
  subtitle?: string
  price?: string
  liked?: boolean
  brand?: string
}

export function ProductCard({
  imageSrc = "/studio-set-course-poster.png",
  title = "The Silent Trauma Of Millennials",
  subtitle = "The House Chronicles",
  price = "$18",
  liked = false,
  brand = "jsty",
}: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#151515]">
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <span className="rounded-sm bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-lime-400 ring-1 ring-lime-500/40">
          {price}
        </span>
      </div>
      <button
        aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/60 ring-1 ring-white/10 transition-colors hover:bg-black/80"
      >
        <Heart className={cn("h-4 w-4", liked ? "fill-lime-500 text-lime-500" : "text-white")} />
      </button>

      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={`${title} poster`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="space-y-1 p-4">
        <div className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">{title}</div>
        <div className="text-[11px] text-zinc-400">{subtitle}</div>
        <div className="mt-2 text-[11px] text-zinc-400">{brand}</div>
      </div>
    </div>
  )
}

type TopPickProps = {
  imageSrc?: string
  eyebrow?: string
  title?: string
  author?: string
  authorRole?: string
  cta?: string
}

export function TopPick({
  imageSrc = "/assets/dashboard-images/only.jpg",
  eyebrow = "This week's top pick",
  title = "The Future Of AI In Everyday Products",
  author = "Ada Nwosu",
  authorRole = "Machine Learning Engineer & Newlabel",
  cta = "Buy This Course",
}: TopPickProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#121212] p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[420px_1fr]">
        <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-xl bg-black/20 md:aspect-[4/3]">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt="Top pick portrait"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">{eyebrow}</div>
          <h3 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">{title}</h3>
          <div className="mt-4 h-px w-full bg-white/10" />
          <div className="mt-4 space-y-1 text-sm">
            <div className="font-semibold text-white">{author}</div>
            <div className="text-zinc-400">{authorRole}</div>
          </div>
          <div className="mt-6">
            <Button className="h-10 rounded-md bg-lime-500 px-5 text-black hover:bg-lime-400">{cta}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
