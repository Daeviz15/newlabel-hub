import { cn } from "@/lib/utils";
import { Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useSavedItems } from "@/hooks/use-saved-items";

type ResumeCardProps = {
  imageSrc?: string;
  title?: string;
  percent?: number;
  brand?: string;
  onClick?: () => void;
};

export function ResumeCard({
  imageSrc = "/portrait-course-poster.png",
  title = "The Future Of AI In Everyday Products",
  percent = 72,
  brand = "jsty",
  onClick,
}: ResumeCardProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#151515] cursor-pointer hover:ring-2 hover:ring-lime-500 transition-all"
      onClick={onClick}
    >
      <div className="absolute left-3 top-3 z-10 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-zinc-200 ring-1 ring-white/10">
        {brand}
      </div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
        <OptimizedImage
          src={imageSrc || "/placeholder.svg"}
          alt={`${title} poster`}
          className="h-full w-full object-cover"
          containerClassName="h-full w-full"
        />
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
          {title}
        </h3>
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
  );
}

type ProductCardProps = {
  id?: string;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  price?: string;
  brand?: string;
  bgColor?: string;
  priceAccent?: 'lime' | 'purple' | 'thc';
  onClick?: () => void;
  className?: string;
  productId?: string;
  onSaveToggle?: (productId: string, isSaved: boolean) => void;
  onAddToCart?: (e: React.MouseEvent) => void;
};

export function ProductCard({
  id = "",
  imageSrc = "/studio-set-course-poster.png",
  title = "The Silent Trauma Of Millennials",
  subtitle = "The House Chronicles",
  price = "$18",
  brand = "",
  bgColor = "ring-lime-500",
  priceAccent = 'lime',
  onClick,
  className = "",
  productId,
  onSaveToggle,
  onAddToCart,
}: ProductCardProps) {
  const { isItemSaved, toggleSavedItem } = useSavedItems();
  const isSaved = productId ? isItemSaved(productId) : false;

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!productId) return;

    const wasSaved = isSaved;
    const success = await toggleSavedItem(productId);
    if (success && onSaveToggle) {
      onSaveToggle(productId, !wasSaved);
    }
  };

  const priceBgClass =
    priceAccent === 'purple'
      ? 'bg-purple-400 text-black'
      : priceAccent === 'thc'
        ? 'bg-orange-500 text-black'
        : 'bg-lime-500 text-black';

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-[#151515] cursor-pointer hover:ring-2 transition-all",
        bgColor,
        className
      )}
      onClick={onClick}
    >
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        <span className="rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-zinc-200 ring-1 ring-white/10">
          {brand}
        </span>
      </div>

      <div className="absolute right-3 top-3 z-10 flex gap-2">
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-black/80 hover:scale-105"
            aria-label="Add to cart"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          </button>
        )}
        {productId && (
          <button
            onClick={handleSaveClick}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-black/80 hover:scale-105"
            aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isSaved ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </button>
        )}
      </div>

      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
        <OptimizedImage
          src={imageSrc || "/placeholder.svg"}
          alt={`${title} poster`}
          className="h-full w-full object-cover"
          containerClassName="h-full w-full"
        />
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
          {title}
        </h3>
        <p className="text-[11px] text-zinc-400">{subtitle}</p>
        <div className="flex items-center justify-between">
          <span className={cn("rounded-md px-2 py-1 text-xs font-bold", priceBgClass)}>
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}

type TopPickProps = {
  imageSrc?: string;
  eyebrow?: string;
  title?: string;
  author?: string;
  authorRole?: string;
  cta?: string;
  accent?: "lime" | "purple";
  imageFit?: "cover" | "contain";
  onClick?: () => void;
};

export function TopPick({
  imageSrc = "/studio-set-course-poster.png",
  eyebrow = "This Week's Top Pick",
  title = "The Silent Trauma Of Millennials",
  author = "The House Chronicles",
  authorRole = "Podcast • NewLabel",
  cta = "Listen Now",
  accent = "lime",
  imageFit = "cover",
  onClick,
}: TopPickProps) {
  const accentClass = accent === "purple" ? "bg-purple-400" : "bg-lime-500";
  const ringClass = accent === "purple" ? "ring-purple-400" : "ring-lime-500";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-[#151515] cursor-pointer hover:ring-2 transition-all",
        ringClass
      )}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-square sm:aspect-[4/5] w-full sm:w-1/2 overflow-hidden bg-black/20">
          <OptimizedImage
            src={imageSrc || "/placeholder.svg"}
            alt={`${title} poster`}
            className={cn("h-full w-full", imageFit === "cover" ? "object-cover" : "object-contain")}
            containerClassName="h-full w-full"
          />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="space-y-3">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
              {eyebrow}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {title}
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">{author}</p>
              <p className="text-xs text-zinc-400">{authorRole}</p>
            </div>
            <button
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-black transition-colors",
                accentClass,
                accent === "purple" ? "hover:bg-purple-500" : "hover:bg-lime-400"
              )}
            >
              {cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}