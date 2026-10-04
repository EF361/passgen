"use client";

import { ShieldCheck, ShieldAlert, Shield, CaseUpper, CaseLower, Hash, Sparkles } from "lucide-react";
import { PasswordStrength, PasswordStats } from "@/lib/generator";

interface StrengthMeterProps {
  strength: PasswordStrength;
  stats?: PasswordStats;
  showStats?: boolean;
}

export function StrengthMeter({ strength, stats, showStats }: StrengthMeterProps) {
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

  const statItems = stats && stats.total > 0 ? [
    { icon: <CaseUpper className="w-3.5 h-3.5" />, label: "Upper", count: stats.uppercase, color: "text-sky-500" },
    { icon: <CaseLower className="w-3.5 h-3.5" />, label: "Lower", count: stats.lowercase, color: "text-indigo-500" },
    { icon: <Hash className="w-3.5 h-3.5" />, label: "Digits", count: stats.digits, color: "text-amber-500" },
    { icon: <Sparkles className="w-3.5 h-3.5" />, label: "Symbols", count: stats.symbols, color: "text-rose-500" },
  ] : null;

  return (
    <div className="w-full space-y-3 pt-2">
      <div className="flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
          {getStrengthIcon()}
          <span>Strength:</span>
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

      {/* Character Statistics Panel */}
      {showStats && statItems && (
        <div className="grid grid-cols-4 gap-2 pt-1">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60"
            >
              <div className={`${item.color}`}>{item.icon}</div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 tabular-nums leading-none">
                {item.count}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
