import { cn } from "@/lib/utils";
import { Heart, Play, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useSavedItems } from "@/hooks/use-saved-items";

type PodcastCardProps = {
  id: string;
  imageSrc?: string;
  title?: string;
  host?: string;
  episodeCount?: number;
  onClick?: () => void;
};

export function PodcastCard({
  id,
  imageSrc = "/podcast-cover-art.png",
  title = "The Weekly Podcast",
  host = "Amazing Host",
  episodeCount = 24,
  onClick,
}: PodcastCardProps) {
  const { isItemSaved, toggleSavedItem } = useSavedItems();
  const liked = isItemSaved(id);

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#151515] hover:ring-4 hover:ring-[#70E002] transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Price Badge - replaced with episode badge */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <span className="rounded-md bg-[#70E002] px-2 py-1 text-xs font-bold text-black flex items-center gap-1">
          <Headphones className="w-3 h-3" />
          {episodeCount} Episodes
        </span>
      </div>

      {/* Like Button */}
      <button
        aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/10 transition-colors hover:bg-black/80"
        onClick={(e) => {
          e.stopPropagation();
          toggleSavedItem(id);
        }}
      >
        <Heart
          className={cn(
            "h-4 w-4",
            liked ? "fill-[#70E002] text-[#70E002]" : "text-white"
          )}
        />
      </button>

      {/* Podcast Cover Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/20">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={`${title} podcast cover`}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-[#70E002] flex items-center justify-center">
            <Play className="w-6 h-6 text-black fill-black ml-1" />
          </div>
        </div>
      </div>

      {/* Podcast Info */}
      <div className="space-y-2 p-4">
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-white font-vietnam">
          {title}
        </div>
        <div className="text-xs text-zinc-400 font-vietnam">{host}</div>
      </div>
    </div>
  );
}

type PodcastCardInteractiveProps = {
  id: string;
  imageSrc: string;
  title: string;
  host: string;
  episodeCount: number;
  accent?: "lime" | "thc";
  onPlayEpisode: () => void;
};

export function PodcastCardInteractive({
  id,
  imageSrc,
  title,
  host,
  episodeCount,
  accent = "thc",
  onPlayEpisode,
}: PodcastCardInteractiveProps) {
  const accentColor = accent === "thc" ? "bg-[#70E002]" : "bg-lime-500";
  const accentHover =
    accent === "thc" ? "hover:bg-[#65cc00]" : "hover:bg-lime-400";

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 bg-[#151515] group hover:ring-2 hover:ring-[#70E002] transition-all">
      <div className="relative aspect-square overflow-hidden bg-black/20">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onPlayEpisode}
            className={`${accentColor} ${accentHover} w-12 h-12 rounded-full flex items-center justify-center transition-all transform group-hover:scale-110`}
            aria-label={`Play ${title}`}
          >
            <Play className="w-5 h-5 text-black fill-black ml-1" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 mb-2">{host}</p>
        <span className="inline-block px-2 py-1 rounded text-xs bg-white/10 text-zinc-300">
          {episodeCount} episodes
        </span>
      </div>
    </div>
  );
}
