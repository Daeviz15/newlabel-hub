import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { ReactNode, Suspense } from "react";
import { PageLoader } from "@/components/ui/BrandedSpinner";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
} as const;

export const PageTransitionLayout = ({ children }: { children?: ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen w-full"
      >
        <Suspense fallback={<PageLoader message="Loading..." />}>
          {children || <Outlet />}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};
