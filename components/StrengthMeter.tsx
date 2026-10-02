"use client";

import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { PasswordStrength } from "@/lib/generator";

interface StrengthMeterProps {
  strength: PasswordStrength;
}

export function StrengthMeter({ strength }: StrengthMeterProps) {
  const { score, label, colorClass, bgClass, entropy } = strength;

  const getStrengthIcon = () => {
    if (score >= 4) {
      return <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    }
    if (score >= 2) {
      return <Shield className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
    }
    return <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
  };

  return (
    <div className="w-full space-y-2 pt-2">
      <div className="flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
          {getStrengthIcon()}
          <span>Security Strength:</span>
          <span className={`font-semibold ${colorClass}`}>{label}</span>
        </div>
        <span className="text-zinc-400 dark:text-zinc-500 tabular-nums">
          {entropy > 0 ? `~${entropy} bits entropy` : "0 bits"}
        </span>
      </div>

      {/* Segmented bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => {
          const isActive = score >= step;
          return (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${
                isActive ? bgClass : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
