import type React from "react";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  className?: string;
}

export function EmptyState({
  title = "No content available",
  description = "We're working on adding new content. Please check back later!",
  icon: Icon = Database,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500",
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full blur-xl animate-pulse" />
        <div className="relative bg-white/5 p-4 rounded-2xl ring-1 ring-white/10 shadow-2xl">
          <Icon className="w-12 h-12 text-zinc-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-zinc-400 max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}
