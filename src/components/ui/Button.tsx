"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
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
      "inline-flex items-center justify-center font-semibold uppercase tracking-wide transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-wine text-white hover:bg-wine-dark active:scale-[0.98]",
      secondary:
        "border-2 border-wine text-wine bg-transparent hover:bg-wine hover:text-white active:scale-[0.98]",
      ghost:
        "text-wine bg-transparent hover:underline underline-offset-4 uppercase tracking-normal font-medium",
      danger:
        "bg-error text-white hover:bg-red-700 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs rounded",
      md: "h-12 px-8 text-sm rounded",
      lg: "h-14 px-10 text-base rounded",
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
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            Even geduld...
          </>
        ) : (
          children
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
