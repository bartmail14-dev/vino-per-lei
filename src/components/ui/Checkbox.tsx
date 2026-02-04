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
          "flex items-center gap-3 cursor-pointer group py-1.5",
          props.disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 border-2 rounded transition-all duration-150",
              "border-grey",
              "peer-checked:bg-wine peer-checked:border-wine",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-wine peer-focus-visible:ring-offset-2",
              "group-hover:border-wine-light"
            )}
          />
          <svg
            className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {label && (
          <span className="text-sm text-charcoal group-hover:text-wine-dark transition-colors">
            {label}
            {count !== undefined && (
              <span className="text-grey ml-1">({count})</span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
