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
  Sliders,
  Copy,
  Check,
  Sparkles,
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

type MobileTab = "generator" | "batch" | "history";
type DesktopTab = "batch" | "history";

export default function Home() {
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState<string>("");
  const [strength, setStrength] = useState<PasswordStrength>(EMPTY_STRENGTH);
  const [stats, setStats] = useState<PasswordStats>({
    uppercase: 0,
    lowercase: 0,
    digits: 0,
    symbols: 0,
    total: 0,
  });
  const [history, setHistory] = useState<PasswordEntry[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("generator");
  const [desktopTab, setDesktopTab] = useState<DesktopTab>("batch");
  const [bottomCopied, setBottomCopied] = useState(false);
  const [bottomSpinning, setBottomSpinning] = useState(false);
  const idCounter = useRef(0);

  const handleBottomGenerate = () => {
    setBottomSpinning(true);
    handleGenerate();
    setTimeout(() => setBottomSpinning(false), 500);
  };

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

  const handleCopyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setBottomCopied(true);
      setTimeout(() => setBottomCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setBottomCopied(true);
      setTimeout(() => setBottomCopied(false), 2000);
    }
  };

  const handleExportSingle = () => {
    if (!password) return;
    const content = `PassGen — Secure Password Export\nGenerated: ${new Date().toLocaleString()}\n\nPassword: ${password}\nLength: ${password.length}\nEntropy: ~${strength.entropy} bits\nStrength: ${strength.label}\n\n---\nGenerated securely using CSPRNG (crypto.getRandomValues)\nhttps://intelligent-curie-alpha.vercel.app`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passgen-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const mobileTabs: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
    { id: "generator", label: "Settings", icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: "batch", label: "Batch (5)", icon: <Layers className="w-3.5 h-3.5" /> },
    {
      id: "history",
      label: `History${history.length > 0 ? ` (${history.length})` : ""}`,
      icon: <ClipboardList className="w-3.5 h-3.5" />,
    },
  ];

  const desktopTabs: { id: DesktopTab; label: string; icon: React.ReactNode }[] = [
    { id: "batch", label: "Batch Generator", icon: <Layers className="w-4 h-4" /> },
    {
      id: "history",
      label: `Session History${history.length > 0 ? ` (${history.length})` : ""}`,
      icon: <ClipboardList className="w-4 h-4" />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 pb-36 lg:pb-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative w-full max-w-6xl xl:max-w-7xl flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              PassGen
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50">
                CSPRNG
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Clean &amp; secure cryptographic password generator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative w-full max-w-6xl xl:max-w-7xl my-auto py-4">
        {/* DESKTOP & IPAD/TABLET LAYOUT (>= lg): Split-view with Right Side Panel */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Left/Center Area (col-span-7 xl:col-span-8) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Hero Password Display Card */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  Generated Result
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                  {password.length} characters
                </span>
              </div>

              <PasswordDisplay password={password} onRegenerate={handleGenerate} />

              <StrengthMeter strength={strength} stats={stats} showStats={showStats} />

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex-1 group flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 active:scale-[0.99] transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Regenerate Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStats((v) => !v)}
                  title="Toggle character statistics"
                  className={`p-3.5 rounded-2xl border font-medium text-sm transition-all duration-200 active:scale-95 ${
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
                  className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop Workspace Tabs (Batch & History) */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-950/5 dark:shadow-black/20 overflow-hidden">
              <div className="flex border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 px-3">
                {desktopTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDesktopTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-5 text-sm font-semibold transition-all duration-200 ${
                      desktopTab === tab.id
                        ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 -mb-px"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-b-2 border-transparent -mb-px"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {desktopTab === "batch" && <BatchPanel options={options} />}
                {desktopTab === "history" && (
                  <PasswordHistory history={history} onClear={() => setHistory([])} />
                )}
              </div>
            </div>
          </div>

          {/* Right Side Panel: Settings & Configuration (col-span-5 xl:col-span-4) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <aside className="sticky top-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Generator Settings
                  </h2>
                </div>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>

              <OptionsPanel options={options} onChange={setOptions} />
            </aside>
          </div>
        </div>

        {/* MOBILE LAYOUT (< lg): Stacked Flow + Tabbed Navigation */}
        <div className="lg:hidden space-y-4 max-w-xl mx-auto">
          {/* Mobile Password Hero Card */}
          <div className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 space-y-4">
            <PasswordDisplay password={password} onRegenerate={handleGenerate} />

            <StrengthMeter strength={strength} stats={stats} showStats={showStats} />

            {/* Mobile Utility Actions (Stats & Export) */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowStats((v) => !v)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                  showStats
                    ? "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400"
                    : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>{showStats ? "Hide Breakdown" : "Character Breakdown"}</span>
              </button>

              <button
                type="button"
                onClick={handleExportSingle}
                disabled={!password}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export .txt</span>
              </button>
            </div>
          </div>

          {/* Mobile Tabbed Navigation & Content */}
          <div className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-950/5 dark:shadow-black/20 overflow-hidden">
            <div className="flex border-b border-zinc-200/80 dark:border-zinc-800/80">
              {mobileTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMobileTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    mobileTab === tab.id
                      ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 -mb-px bg-sky-50/50 dark:bg-sky-950/20"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-b-2 border-transparent -mb-px"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-5">
              {mobileTab === "generator" && (
                <OptionsPanel options={options} onChange={setOptions} />
              )}
              {mobileTab === "batch" && <BatchPanel options={options} />}
              {mobileTab === "history" && (
                <PasswordHistory history={history} onClear={() => setHistory([])} />
              )}
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>CSPRNG — crypto.getRandomValues</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sky-500" />
            <span>100% Client-Side · Zero Server Transmission</span>
          </div>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR: Instant One-Tap Generate & Copy in Thumb Reach */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800 shadow-2xl">
        <div className="max-w-xl mx-auto flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBottomGenerate}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md shadow-sky-600/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${bottomSpinning ? "rotate-180" : ""}`} />
            <span>Generate</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPassword}
            disabled={!password}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm shadow-sm active:scale-[0.98] transition-all duration-200 ${
              bottomCopied
                ? "bg-emerald-500 text-white"
                : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40"
            }`}
          >
            {bottomCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative w-full max-w-6xl xl:max-w-7xl py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
        <p>
          PassGen • Built with Next.js, Tailwind CSS &amp; Lucide •{" "}
          <a
            href="https://github.com/EF361/passgen"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            GitHub Repository
          </a>{" "}
          •{" "}
          <a
            href="https://intelligent-curie-alpha.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Live Demo
          </a>
        </p>
      </footer>
    </div>
  );
}
