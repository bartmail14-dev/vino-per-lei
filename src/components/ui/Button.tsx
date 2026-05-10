"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center overflow-hidden text-button uppercase rounded-lg transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-wine text-white border border-wine/90 hover:-translate-y-0.5 hover:bg-wine-dark hover:border-wine-dark active:translate-y-0 active:scale-[0.98] shadow-[0_12px_26px_-18px_rgba(26,31,61,0.8)] hover:shadow-[0_18px_36px_-22px_rgba(26,31,61,0.95)] before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gold/60 before:to-transparent before:opacity-70 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-100",
      secondary:
        "border-2 border-wine text-wine bg-transparent hover:-translate-y-0.5 hover:bg-wine hover:text-white active:translate-y-0 active:scale-[0.98]",
      ghost:
        "text-wine bg-transparent hover:bg-wine/5 active:bg-wine/10 uppercase tracking-normal font-medium",
      danger:
        "bg-error text-white hover:-translate-y-0.5 hover:bg-red-700 active:translate-y-0 active:scale-[0.98]",
      gold:
        "bg-gold text-white hover:-translate-y-0.5 hover:bg-gold-light active:translate-y-0 active:scale-[0.98] shadow-sm hover:shadow-md before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-white/60 before:opacity-70 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-100",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-12 px-8 text-sm",
      lg: "h-14 px-10 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="relative z-10">Even geduld...</span>
          </span>
        ) : (
          <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

// Animated button wrapper for special effects
export const AnimatedButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & HTMLMotionProps<"button">
>(({ children, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...(props as HTMLMotionProps<"button">)}
    >
      {children}
    </motion.button>
  );
});

AnimatedButton.displayName = "AnimatedButton";
