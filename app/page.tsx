"use client";

import { useState, useEffect, useCallback } from "react";
import {
  generatePassword,
  calculatePasswordStrength,
  GeneratorOptions,
  PasswordStrength,
} from "@/lib/generator";
import { PasswordDisplay } from "@/components/PasswordDisplay";
import { StrengthMeter } from "@/components/StrengthMeter";
import { OptionsPanel } from "@/components/OptionsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { KeyRound, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";

const DEFAULT_OPTIONS: GeneratorOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
};

export default function Home() {
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState<string>("");
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Very Weak",
    colorClass: "text-zinc-400 dark:text-zinc-500",
    bgClass: "bg-zinc-300 dark:bg-zinc-700",
    percentage: 0,
    entropy: 0,
  });

  const handleGenerate = useCallback(() => {
    const newPass = generatePassword(options);
    setPassword(newPass);
    setStrength(calculatePasswordStrength(newPass));
  }, [options]);

  // Auto-generate password on mount and whenever options change
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Background ambient lighting accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative w-full max-w-xl flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              KeyCraft
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50">
                Secure
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Minimalist CSPRNG Password Generator
            </p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Card */}
      <main className="relative w-full max-w-xl my-auto py-6">
        <div className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-7 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 space-y-6">
          {/* Output Display & Controls */}
          <div className="space-y-3">
            <PasswordDisplay
              password={password}
              onRegenerate={handleGenerate}
            />
            <StrengthMeter strength={strength} />
          </div>

          <div className="h-px w-full bg-zinc-200/80 dark:bg-zinc-800/80" />

          {/* Configuration Options */}
          <OptionsPanel options={options} onChange={setOptions} />

          {/* Dedicated Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full group flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>Generate Fresh Password</span>
            </button>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Cryptographic CSPRNG</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Zero Server Transmission</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-xl py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
        <p>Built with Next.js, Tailwind CSS & Lucide • Optimized for Vercel</p>
      </footer>
    </div>
  );
}
