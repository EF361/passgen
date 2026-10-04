"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  generatePassword,
  calculatePasswordStrength,
  getPasswordStats,
  GeneratorOptions,
  PasswordStrength,
  PasswordStats,
} from "@/lib/generator";
import { PasswordDisplay } from "@/components/PasswordDisplay";
import { StrengthMeter } from "@/components/StrengthMeter";
import { OptionsPanel } from "@/components/OptionsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PasswordHistory, PasswordEntry } from "@/components/PasswordHistory";
import { BatchPanel } from "@/components/BatchPanel";
import {
  KeyRound,
  ShieldCheck,
  Globe,
  RefreshCw,
  ClipboardList,
  Layers,
  Download,
  BarChart2,
} from "lucide-react";

const MAX_HISTORY = 10;

const DEFAULT_OPTIONS: GeneratorOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
  mode: "password",
  passphraseWords: 4,
  passphraseSeparator: "-",
};

const EMPTY_STRENGTH: PasswordStrength = {
  score: 0,
  label: "Very Weak",
  colorClass: "text-zinc-400 dark:text-zinc-500",
  bgClass: "bg-zinc-300 dark:bg-zinc-700",
  percentage: 0,
  entropy: 0,
};

type Tab = "generator" | "history" | "batch";

export default function Home() {
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState<string>("");
  const [strength, setStrength] = useState<PasswordStrength>(EMPTY_STRENGTH);
  const [stats, setStats] = useState<PasswordStats>({ uppercase: 0, lowercase: 0, digits: 0, symbols: 0, total: 0 });
  const [history, setHistory] = useState<PasswordEntry[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("generator");
  const idCounter = useRef(0);

  const handleGenerate = useCallback(() => {
    const newPass = generatePassword(options);
    const newStrength = calculatePasswordStrength(newPass);
    const newStats = getPasswordStats(newPass);
    setPassword(newPass);
    setStrength(newStrength);
    setStats(newStats);

    if (newPass) {
      setHistory((prev) => {
        const entry: PasswordEntry = {
          id: String(++idCounter.current),
          password: newPass,
          createdAt: new Date(),
        };
        return [entry, ...prev].slice(0, MAX_HISTORY);
      });
    }
  }, [options]);

  // Auto-generate on mount and option changes
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleExportSingle = () => {
    if (!password) return;
    const content = `PassGen — Single Password Export\nGenerated: ${new Date().toLocaleString()}\n\nPassword: ${password}\nLength: ${password.length}\nEntropy: ~${strength.entropy} bits\nStrength: ${strength.label}\n\n---\nGenerated securely using CSPRNG (crypto.getRandomValues)\nhttps://intelligent-curie-alpha.vercel.app`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passgen-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "generator", label: "Generator", icon: <KeyRound className="w-3.5 h-3.5" /> },
    { id: "batch", label: "Batch", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "history", label: `History${history.length > 0 ? ` (${history.length})` : ""}`, icon: <ClipboardList className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative w-full max-w-xl flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              PassGen
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50">
                CSPRNG
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Clean &amp; secure password generator
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="relative w-full max-w-xl my-auto py-4 space-y-3">
        {/* Password Output Card */}
        <div className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-6 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 space-y-4">
          <PasswordDisplay password={password} onRegenerate={handleGenerate} />

          <StrengthMeter strength={strength} stats={stats} showStats={showStats} />

          {/* Quick action row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              className="flex-1 group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 active:scale-[0.99] transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>Generate</span>
            </button>

            <button
              type="button"
              onClick={() => setShowStats((v) => !v)}
              title="Toggle character statistics"
              className={`p-3 rounded-2xl border font-medium text-sm transition-all duration-200 active:scale-95 ${
                showStats
                  ? "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400"
                  : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleExportSingle}
              disabled={!password}
              title="Export password as .txt"
              className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200 active:scale-95"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation + Content Card */}
        <div className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-950/5 dark:shadow-black/20 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-zinc-200/80 dark:border-zinc-800/80">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 -mb-px bg-sky-50/50 dark:bg-sky-950/20"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-b-2 border-transparent -mb-px"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6">
            {activeTab === "generator" && (
              <OptionsPanel options={options} onChange={setOptions} />
            )}
            {activeTab === "batch" && (
              <BatchPanel options={options} />
            )}
            {activeTab === "history" && (
              <PasswordHistory
                history={history}
                onClear={() => setHistory([])}
              />
            )}
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>CSPRNG — crypto.getRandomValues</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sky-500" />
            <span>100% client-side · No server</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-xl py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
        <p>
          Built with Next.js, Tailwind CSS &amp; Lucide •{" "}
          <a
            href="https://github.com/EF361/passgen"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
