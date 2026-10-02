"use client";

import { GeneratorOptions } from "@/lib/generator";
import {
  CaseUpper,
  CaseLower,
  Hash,
  Sparkles,
  EyeOff,
  Minus,
  Plus,
} from "lucide-react";

interface OptionsPanelProps {
  options: GeneratorOptions;
  onChange: (options: GeneratorOptions) => void;
}

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  const updateOption = <K extends keyof GeneratorOptions>(
    key: K,
    value: GeneratorOptions[K]
  ) => {
    // Prevent unchecking all character sets
    if (
      (key === "includeUppercase" ||
        key === "includeLowercase" ||
        key === "includeNumbers" ||
        key === "includeSymbols") &&
      value === false
    ) {
      const activeCount = [
        options.includeUppercase,
        options.includeLowercase,
        options.includeNumbers,
        options.includeSymbols,
      ].filter(Boolean).length;

      if (activeCount <= 1) {
        // Must keep at least one character set active
        return;
      }
    }

    onChange({
      ...options,
      [key]: value,
    });
  };

  const handleLengthChange = (newLength: number) => {
    const clamped = Math.min(64, Math.max(6, newLength));
    onChange({
      ...options,
      length: clamped,
    });
  };

  const characterOptions = [
    {
      id: "includeUppercase",
      title: "Uppercase Letters",
      description: "A-Z",
      icon: <CaseUpper className="w-4 h-4" />,
      checked: options.includeUppercase,
    },
    {
      id: "includeLowercase",
      title: "Lowercase Letters",
      description: "a-z",
      icon: <CaseLower className="w-4 h-4" />,
      checked: options.includeLowercase,
    },
    {
      id: "includeNumbers",
      title: "Numbers",
      description: "0-9",
      icon: <Hash className="w-4 h-4" />,
      checked: options.includeNumbers,
    },
    {
      id: "includeSymbols",
      title: "Symbols",
      description: "!@#$%^&*...",
      icon: <Sparkles className="w-4 h-4" />,
      checked: options.includeSymbols,
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Password Length Control */}
      <div className="space-y-3 p-4 bg-zinc-50/70 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label
              htmlFor="length-slider"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Password Length
            </label>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Recommended: 16+ characters for strong security
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-2 py-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <button
              type="button"
              onClick={() => handleLengthChange(options.length - 1)}
              disabled={options.length <= 6}
              aria-label="Decrease length"
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono font-bold text-sm text-sky-600 dark:text-sky-400 tabular-nums">
              {options.length}
            </span>
            <button
              type="button"
              onClick={() => handleLengthChange(options.length + 1)}
              disabled={options.length >= 64}
              aria-label="Increase length"
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <input
            id="length-slider"
            type="range"
            min={6}
            max={64}
            value={options.length}
            onChange={(e) => handleLengthChange(parseInt(e.target.value, 10))}
            className="w-full"
            aria-label="Password length slider"
          />
          <div className="flex justify-between text-[11px] text-zinc-400 dark:text-zinc-500 px-0.5 pt-1">
            <span>6</span>
            <span>16 (Balanced)</span>
            <span>32 (Strong)</span>
            <span>64</span>
          </div>
        </div>
      </div>

      {/* Character Type Toggles */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
          Character Sets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {characterOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              role="switch"
              aria-checked={item.checked}
              onClick={() => updateOption(item.id, !item.checked)}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                item.checked
                  ? "bg-white dark:bg-zinc-900 border-sky-500/60 dark:border-sky-500/50 shadow-sm shadow-sky-500/5"
                  : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-60 hover:opacity-80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    item.checked
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Toggle switch visual */}
              <div
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  item.checked ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    item.checked ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filter Toggle */}
      <div className="pt-1">
        <button
          type="button"
          role="switch"
          aria-checked={options.excludeAmbiguous}
          onClick={() => updateOption("excludeAmbiguous", !options.excludeAmbiguous)}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 ${
            options.excludeAmbiguous
              ? "bg-white dark:bg-zinc-900 border-sky-500/60 dark:border-sky-500/50 shadow-sm"
              : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg transition-colors ${
                options.excludeAmbiguous
                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
              }`}
            >
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Exclude Ambiguous Characters
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Avoids confusing letters & numbers: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">i, l, 1, I, o, 0, O</code>
              </div>
            </div>
          </div>

          <div
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
              options.excludeAmbiguous ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                options.excludeAmbiguous ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
