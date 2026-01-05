"use client";

import { motion } from "framer-motion";
import { Video, Clock, Bell, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentComingSoonProps {
  /** Title for the empty state */
  title?: string;
  /** Description for the empty state */
  description?: string;
  /** Variant of the empty state: 'default', 'compact' */
  variant?: "default" | "compact";
  /** Whether to show the notification bell CTA */
  showNotifyButton?: boolean;
  /** Brand accent color: 'purple', 'green' */
  accentColor?: "purple" | "green";
}

/**
 * ContentComingSoon - A premium empty state component for when no content is available
 */
export function ContentComingSoon({
  title = "Amazing Content Coming Soon",
  description = "We're preparing exciting new content for you. Check back soon or enable notifications to be the first to know!",
  variant = "default",
  showNotifyButton = false,
  accentColor = "purple",
}: ContentComingSoonProps) {
  const isCompact = variant === "compact";
  const isPurple = accentColor === "purple";
  
  const gradientClass = isPurple 
    ? "from-purple-500/20 via-transparent to-purple-500/10"
    : "from-brand-green/20 via-transparent to-brand-green/10";
  
  const iconBgClass = isPurple
    ? "from-purple-600 to-purple-800"
    : "from-brand-green to-green-600";
    
  const accentTextClass = isPurple ? "text-purple-400" : "text-brand-green";

  if (isCompact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center py-12 px-4"
      >
        <div className="flex items-center gap-4 text-gray-400">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${iconBgClass} flex items-center justify-center`}>
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-white">{title}</p>
            <p className="text-sm text-gray-500">Content is being prepared...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClass} border border-white/5 p-8 sm:p-12`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${iconBgClass} opacity-10 blur-3xl`} />
        <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br ${iconBgClass} opacity-10 blur-3xl`} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${iconBgClass} flex items-center justify-center shadow-lg mb-6`}
        >
          <Rocket className="w-10 h-10 text-white" />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
          {description}
        </p>

        {/* Status indicator */}
        <div className={`flex items-center gap-2 ${accentTextClass} text-sm font-medium mb-6`}>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Clock className="w-4 h-4" />
          </motion.div>
          <span>Content being prepared</span>
        </div>

        {/* Notify button */}
        {showNotifyButton && (
          <Button
            variant="outline"
            className={`border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notify me when ready
          </Button>
        )}

        {/* Decorative dots */}
        <div className="flex gap-1.5 mt-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${isPurple ? 'bg-purple-500' : 'bg-brand-green'}`}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * EmptyCoursesGrid - A grid placeholder showing the empty state
 */
export function EmptyCoursesGrid({
  message = "New courses are on the way!",
}: {
  message?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Show placeholder cards with animation */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800/50 aspect-[4/5]"
        >
          {/* Shimmer effect background with green-purple gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-zinc-900/30 to-purple-500/5" />
          
          {/* Content placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-green/30 to-purple-600/30 flex items-center justify-center mb-4 border border-brand-green/20"
            >
              <Video className="w-6 h-6 text-brand-green" />
            </motion.div>
            <p className="text-sm font-medium bg-gradient-to-r from-brand-green to-purple-400 bg-clip-text text-transparent">Coming Soon</p>
          </div>

          {/* Subtle animated border with green-purple transition */}
          <motion.div
            className="absolute inset-0 border border-brand-green/0 rounded-xl"
            animate={{ 
              borderColor: [
                "rgba(112, 224, 2, 0)", 
                "rgba(112, 224, 2, 0.3)", 
                "rgba(139, 92, 246, 0.3)", 
                "rgba(139, 92, 246, 0)"
              ] 
            }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default ContentComingSoon;
