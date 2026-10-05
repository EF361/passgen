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
  KeyRound,
  AlignLeft,
} from "lucide-react";

interface OptionsPanelProps {
  options: GeneratorOptions;
  onChange: (options: GeneratorOptions) => void;
}

const SEPARATOR_OPTIONS = [
  { value: "-", label: "Hyphen (-)" },
  { value: ".", label: "Dot (.)" },
  { value: "_", label: "Underscore (_)" },
  { value: "#", label: "Hash (#)" },
  { value: "!", label: "Bang (!)" },
  { value: "@", label: "At (@)" },
  { value: "$", label: "Dollar ($)" },
  { value: " ", label: "Space ( )" },
];

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  const isPassphrase = options.mode === "passphrase";

  const updateOption = <K extends keyof GeneratorOptions>(
    key: K,
    value: GeneratorOptions[K]
  ) => {
    // Only in password mode: ensure at least one character set remains active
    if (
      !isPassphrase &&
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
      if (activeCount <= 1) return;
    }
    onChange({ ...options, [key]: value });
  };

  const handleLengthChange = (newLength: number) => {
    onChange({ ...options, length: Math.min(64, Math.max(6, newLength)) });
  };

  const handleWordCountChange = (delta: number) => {
    onChange({
      ...options,
      passphraseWords: Math.min(8, Math.max(3, options.passphraseWords + delta)),
    });
  };

  const characterOptions = [
    {
      id: "includeUppercase" as const,
      title: "Uppercase",
      description: "A-Z",
      icon: <CaseUpper className="w-4 h-4" />,
      checked: options.includeUppercase,
    },
    {
      id: "includeLowercase" as const,
      title: "Lowercase",
      description: "a-z",
      icon: <CaseLower className="w-4 h-4" />,
      checked: options.includeLowercase,
    },
    {
      id: "includeNumbers" as const,
      title: "Numbers",
      description: "0-9",
      icon: <Hash className="w-4 h-4" />,
      checked: options.includeNumbers,
    },
    {
      id: "includeSymbols" as const,
      title: "Symbols",
      description: "!@#$%...",
      icon: <Sparkles className="w-4 h-4" />,
      checked: options.includeSymbols,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
        {[
          { value: "password", label: "Password", icon: <KeyRound className="w-3.5 h-3.5" /> },
          { value: "passphrase", label: "Passphrase", icon: <AlignLeft className="w-3.5 h-3.5" /> },
        ].map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => updateOption("mode", m.value as "password" | "passphrase")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              options.mode === m.value
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Password Mode Options */}
      {!isPassphrase && (
        <>
          {/* Length control */}
          <div className="space-y-3 p-4 bg-zinc-50/70 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="length-slider" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Password Length
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Recommended: 16+ characters
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
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
              <div className="flex justify-between text-[11px] text-zinc-400 dark:text-zinc-500 px-1 pt-2 pb-0.5 font-mono">
                <span>6</span>
                <span>16</span>
                <span>32</span>
                <span>64</span>
              </div>
            </div>
          </div>

          {/* Character type toggles */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
              Character Sets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5">
              {characterOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="switch"
                  aria-checked={item.checked}
                  onClick={() => updateOption(item.id, !item.checked)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    item.checked
                      ? "bg-white dark:bg-zinc-900 border-sky-500/60 dark:border-sky-500/50 shadow-sm shadow-sky-500/5"
                      : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                    <div className={`p-2 rounded-xl transition-colors shrink-0 ${
                      item.checked ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.title}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{item.description}</div>
                    </div>
                  </div>
                  <div className={`shrink-0 w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    item.checked ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${item.checked ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Exclude ambiguous toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={options.excludeAmbiguous}
            onClick={() => updateOption("excludeAmbiguous", !options.excludeAmbiguous)}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              options.excludeAmbiguous
                ? "bg-white dark:bg-zinc-900 border-sky-500/60 dark:border-sky-500/50 shadow-sm"
                : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
              <div className={`p-2 rounded-xl transition-colors shrink-0 ${
                options.excludeAmbiguous ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
              }`}>
                <EyeOff className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Exclude Ambiguous</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Removes: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">i l 1 I o 0 O</code>
                </div>
              </div>
            </div>
            <div className={`shrink-0 w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              options.excludeAmbiguous ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
            }`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${options.excludeAmbiguous ? "translate-x-4" : "translate-x-0"}`} />
            </div>
          </button>
        </>
      )}

      {/* Passphrase Mode Options */}
      {isPassphrase && (
        <div className="space-y-4">
          {/* Word count stepper */}
          <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Word Count</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">4+ words for high security</div>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleWordCountChange(-1)}
                  disabled={options.passphraseWords <= 3}
                  aria-label="Decrease word count"
                  className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-sky-600 dark:text-sky-400 tabular-nums">
                  {options.passphraseWords}
                </span>
                <button
                  type="button"
                  onClick={() => handleWordCountChange(1)}
                  disabled={options.passphraseWords >= 8}
                  aria-label="Increase word count"
                  className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Passphrase Entropy & Complexity Controls (Casing, Numbers, Symbols) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
              Entropy &amp; Complexity
            </h3>
            <div className="space-y-2">
              {/* Capitalize words toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={options.includeUppercase}
                onClick={() => updateOption("includeUppercase", !options.includeUppercase)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  options.includeUppercase
                    ? "bg-white dark:bg-zinc-900 border-sky-500/60 dark:border-sky-500/50 shadow-sm shadow-sky-500/5"
                    : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-60 hover:opacity-80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                  <div className={`p-2 rounded-xl transition-colors shrink-0 ${
                    options.includeUppercase ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  }`}>
                    <CaseUpper className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Capitalize Words</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Title Case (e.g. Word-Word)</div>
                  </div>
                </div>
                <div className={`shrink-0 w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  options.includeUppercase ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${options.includeUppercase ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </button>

              {/* Include Numbers toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={options.includeNumbers}
                onClick={() => updateOption("includeNumbers", !options.includeNumbers)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  options.includeNumbers
                    ? "bg-white dark:bg-zinc-900 border-sky-500/60 dark:border-sky-500/50 shadow-sm shadow-sky-500/5"
                    : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-60 hover:opacity-80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                  <div className={`p-2 rounded-xl transition-colors shrink-0 ${
                    options.includeNumbers ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  }`}>
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Include Numbers</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Injects random digits (e.g. Word42-Word)</div>
                  </div>
                </div>
                <div className={`shrink-0 w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  options.includeNumbers ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${options.includeNumbers ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </button>

              {/* Include Symbols toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={options.includeSymbols}
                onClick={() => updateOption("includeSymbols", !options.includeSymbols)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  options.includeSymbols
                    ? "bg-white dark:bg-zinc-900 border-sky-500/60 dark:border-sky-500/50 shadow-sm shadow-sky-500/5"
                    : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-60 hover:opacity-80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                  <div className={`p-2 rounded-xl transition-colors shrink-0 ${
                    options.includeSymbols ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Include Symbols</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Injects special symbols (e.g. Word!-Word)</div>
                  </div>
                </div>
                <div className={`shrink-0 w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  options.includeSymbols ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${options.includeSymbols ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Separator Picker */}
          <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 space-y-2">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Word Separator</div>
            <div className="flex flex-wrap gap-2">
              {SEPARATOR_OPTIONS.map((sep) => (
                <button
                  key={sep.value}
                  type="button"
                  onClick={() => updateOption("passphraseSeparator", sep.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    options.passphraseSeparator === sep.value
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-sky-400"
                  }`}
                >
                  {sep.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
