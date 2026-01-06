"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface BrandedImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
}

const FALLBACK_IMAGES = {
  course: "/assets/dashboard-images/face.jpg",
  podcast: "/assets/dashboard-images/lady.jpg",
  default: "/assets/dashboard-images/only.jpg",
};

/**
 * BrandedImage component that handles image loading errors gracefully
 * with a branded fallback instead of placeholder.svg
 */
export function BrandedImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  aspectRatio = "portrait",
}: BrandedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getFallbackSrc = () => {
    // Determine fallback based on alt text or use default
    const altLower = alt.toLowerCase();
    if (altLower.includes("podcast") || altLower.includes("episode")) {
      return FALLBACK_IMAGES.podcast;
    }
    if (altLower.includes("course") || altLower.includes("lesson")) {
      return FALLBACK_IMAGES.course;
    }
    return FALLBACK_IMAGES.default;
  };

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }[aspectRatio];

  const actualSrc = hasError || !src ? getFallbackSrc() : src;

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${aspectRatioClass} ${fallbackClassName}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}
      
      {/* Error state with icon */}
      {hasError && !actualSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <ImageOff className="w-8 h-8 text-zinc-600" />
        </div>
      )}
      
      <img
        src={actualSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}

export default BrandedImage;
