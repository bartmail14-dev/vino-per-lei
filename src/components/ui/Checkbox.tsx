"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  count?: number;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, count, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "flex items-center gap-3 cursor-pointer group py-2 px-1 -mx-1 rounded-lg",
          "transition-all duration-200",
          "hover:bg-gold/[0.04]",
          props.disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-[18px] h-[18px] border-[1.5px] rounded transition-all duration-200",
              "border-sand shadow-[0_1px_2px_rgba(26,26,26,0.06)]",
              "peer-checked:bg-[image:var(--wine-gradient)] peer-checked:border-wine peer-checked:shadow-[0_1px_3px_rgba(26,31,61,0.25)]",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-gold/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream",
              "group-hover:border-gold/70"
            )}
          />
          <svg
            className="absolute top-[3px] left-[3px] w-3 h-3 text-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {label && (
          <span className="text-sm text-charcoal tracking-wide group-hover:text-wine-dark transition-colors duration-200 leading-snug">
            {label}
            {count !== undefined && (
              <span className="ml-2 text-[11px] text-grey/80 bg-champagne/50 px-1.5 py-0.5 rounded-md tabular-nums font-medium">
                {count}
              </span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
