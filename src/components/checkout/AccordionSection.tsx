"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";

interface AccordionSectionProps {
  id: string;
  title: string;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  completedSummary?: string;
  onActivate: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function AccordionSection({
  id,
  title,
  stepNumber,
  isActive,
  isCompleted,
  completedSummary,
  onActivate,
  onEdit,
  children,
}: AccordionSectionProps) {
  return (
    <div
      className={cn(
        "border border-sand rounded-lg overflow-hidden transition-shadow",
        isActive && "shadow-md border-wine/30"
      )}
    >
      {/* Header */}
      <button
        onClick={isCompleted ? onEdit : onActivate}
        className={cn(
          "w-full px-6 py-4 flex items-center gap-4 text-left transition-colors",
          isActive ? "bg-white" : "bg-warm-white hover:bg-white",
          isCompleted && !isActive && "cursor-pointer"
        )}
        aria-expanded={isActive}
        aria-controls={`section-${id}`}
      >
        {/* Step indicator */}
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
            isCompleted
              ? "bg-success text-white"
              : isActive
              ? "bg-wine text-white"
              : "bg-sand text-grey"
          )}
        >
          {isCompleted ? <CheckIcon className="w-4 h-4" /> : stepNumber}
        </div>

        {/* Title and summary */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-semibold transition-colors",
              isActive ? "text-charcoal" : "text-grey"
            )}
          >
            {title}
          </h3>
          {isCompleted && !isActive && completedSummary && (
            <p className="text-sm text-grey truncate">{completedSummary}</p>
          )}
        </div>

        {/* Edit button for completed sections */}
        {isCompleted && !isActive && (
          <span className="text-sm text-wine font-medium">Wijzigen</span>
        )}

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon
            className={cn(
              "w-5 h-5 transition-colors",
              isActive ? "text-wine" : "text-grey"
            )}
          />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            id={`section-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

