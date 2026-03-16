"use client";

import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className,
}: QuantitySelectorProps) {
  const sizeClasses = {
    sm: {
      button: "w-8 h-8",
      input: "w-10 h-8 text-sm",
      icon: "w-3 h-3",
    },
    md: {
      button: "w-11 h-11",
      input: "w-14 h-11 text-base",
      icon: "w-4 h-4",
    },
  };

  const classes = sizeClasses[size];
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center border border-sand rounded-lg overflow-hidden",
        "transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-gold/50 focus-within:border-gold/30",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={cn(
          classes.button,
          "flex items-center justify-center",
          "text-charcoal bg-transparent",
          "hover:bg-wine/5 active:bg-wine/10",
          "transition-colors duration-150",
          "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          "focus-visible:outline-none focus-visible:bg-wine/5"
        )}
        aria-label="Verminder aantal"
      >
        <svg className={classes.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className={cn(
          classes.input,
          "text-center font-semibold tabular-nums",
          "border-x border-sand bg-white",
          "focus:outline-none focus:bg-warm-white",
          "transition-colors duration-150",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        aria-label="Aantal"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={cn(
          classes.button,
          "flex items-center justify-center",
          "text-charcoal bg-transparent",
          "hover:bg-wine/5 active:bg-wine/10",
          "transition-colors duration-150",
          "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          "focus-visible:outline-none focus-visible:bg-wine/5"
        )}
        aria-label="Verhoog aantal"
      >
        <svg className={classes.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
