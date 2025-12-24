"use client";

import { cn } from "~/lib/utils";

interface FishIconProps {
  className?: string;
  variant?: "default" | "safe" | "alert";
}

export function FishIcon({ className, variant = "default" }: FishIconProps) {
  const colors = {
    default: "text-primary",
    safe: "text-accent",
    alert: "text-coral",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", colors[variant], className)}
    >
      <path
        d="M12 6C8.5 6 5.5 8.5 4 12C5.5 15.5 8.5 18 12 18C15.5 18 18.5 15.5 20 12C18.5 8.5 15.5 6 12 6Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M22 12C22 12 19 6 12 6C5 6 2 12 2 12C2 12 5 18 12 18C19 18 22 12 22 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 12L4 10V14L1 12Z"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="currentColor"
      />
      <circle
        cx="13"
        cy="11"
        r="1"
        fill="white"
      />
    </svg>
  );
}

interface BubbleEffectProps {
  count?: number;
  className?: string;
}

export function BubbleEffect({ count = 12, className }: BubbleEffectProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full bg-white/20 animate-bubble"
          style={{
            left: `${5 + i * (90 / count)}%`,
            width: `${8 + (i % 3) * 6}px`,
            height: `${8 + (i % 3) * 6}px`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

