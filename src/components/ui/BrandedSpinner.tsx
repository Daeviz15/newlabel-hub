"use client";

import { motion } from "framer-motion";

interface BrandedSpinnerProps {
  /** Size of the spinner: 'sm' (40px), 'md' (64px), 'lg' (96px), 'xl' (128px) */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional message to display below spinner */
  message?: string;
  /** Whether to show the full page overlay */
  fullPage?: boolean;
}

const sizeMap = {
  sm: { container: 40, logo: 20, ring: 36, stroke: 2 },
  md: { container: 64, logo: 28, ring: 56, stroke: 3 },
  lg: { container: 96, logo: 40, ring: 84, stroke: 3 },
  xl: { container: 128, logo: 52, ring: 112, stroke: 4 },
};

/**
 * BrandedSpinner - A premium loading spinner with NewLabel branding
 * Features dual spinning rings (green & purple) with the logo in the center
 */
export function BrandedSpinner({
  size = "md",
  message,
  fullPage = false,
}: BrandedSpinnerProps) {
  const dimensions = sizeMap[size];
  const center = dimensions.container / 2;
  const radius = dimensions.ring / 2;

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="relative"
        style={{
          width: dimensions.container,
          height: dimensions.container,
        }}
      >
        {/* Outer glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30"
          style={{
            background: "radial-gradient(circle, #70E002 0%, #8B5CF6 50%, transparent 70%)",
          }}
        />

        {/* SVG Container for rings */}
        <svg
          className="absolute inset-0"
          width={dimensions.container}
          height={dimensions.container}
          viewBox={`0 0 ${dimensions.container} ${dimensions.container}`}
        >
          {/* Background track - subtle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={dimensions.stroke}
          />

          {/* Outer ring - Green (brand-green) */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#greenGradient)"
            strokeWidth={dimensions.stroke}
            strokeLinecap="round"
            strokeDasharray={`${radius * Math.PI * 0.4} ${radius * Math.PI * 1.6}`}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ originX: "50%", originY: "50%" }}
          />

          {/* Inner ring - Purple (secondary accent) */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius - dimensions.stroke * 2.5}
            fill="none"
            stroke="url(#purpleGradient)"
            strokeWidth={dimensions.stroke * 0.8}
            strokeLinecap="round"
            strokeDasharray={`${(radius - 8) * Math.PI * 0.3} ${(radius - 8) * Math.PI * 1.7}`}
            initial={{ rotate: 360 }}
            animate={{ rotate: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ originX: "50%", originY: "50%" }}
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#70E002" />
              <stop offset="50%" stopColor="#8FE840" />
              <stop offset="100%" stopColor="#70E002" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center logo container with pulse effect */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center shadow-lg"
            style={{
              width: dimensions.logo * 1.5,
              height: dimensions.logo * 1.5,
            }}
          >
            <img
              src="/assets/logos.png"
              alt="Loading"
              className="object-contain"
              style={{
                width: dimensions.logo,
                height: dimensions.logo,
              }}
            />
          </div>
        </motion.div>

        {/* Particle effects */}
        {size !== "sm" && (
          <>
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-brand-green"
              animate={{
                x: [0, 10, -10, 0],
                y: [0, -10, 10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
              style={{ top: "10%", left: "50%" }}
            />
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-purple-500"
              animate={{
                x: [0, -10, 10, 0],
                y: [0, 10, -10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
              style={{ bottom: "10%", right: "20%" }}
            />
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-brand-green"
              animate={{
                x: [0, 15, -15, 0],
                y: [0, -5, 5, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1,
              }}
              style={{ top: "50%", left: "5%" }}
            />
          </>
        )}
      </div>

      {/* Loading message */}
      {message && (
        <motion.p
          className="text-sm text-zinc-400 font-vietnam"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b0b]/95 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

/**
 * LoadingOverlay - A container-relative loading overlay
 */
export function LoadingOverlay({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b0b0b]/80 backdrop-blur-sm rounded-lg">
      <BrandedSpinner size="md" message={message} />
    </div>
  );
}

/**
 * PageLoader - Full page loading state
 */
export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
      <BrandedSpinner size="lg" message={message} />
    </div>
  );
}

/**
 * InlineLoader - Small inline loading indicator
 */
export function InlineLoader() {
  return <BrandedSpinner size="sm" />;
}

export default BrandedSpinner;
