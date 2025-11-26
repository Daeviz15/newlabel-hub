import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  variant?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scale" | "blur";
  delay?: number;
  duration?: number;
  className?: string;
}

export function MotionWrapper({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  className = "",
}: MotionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    blur: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  delay = 0.1,
  className = "",
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  variant?: "fadeUp" | "fadeIn" | "scale" | "slide";
  className?: string;
}

export function StaggerItem({
  children,
  variant = "fadeUp",
  className = "",
}: StaggerItemProps) {
  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
    slide: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 },
    },
  };

  return (
    <motion.div
      variants={variants[variant]}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

