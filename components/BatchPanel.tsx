"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, Download, Layers } from "lucide-react";
import { generatePassword, GeneratorOptions } from "@/lib/generator";

interface BatchPanelProps {
  options: GeneratorOptions;
}

export function BatchPanel({ options }: BatchPanelProps) {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const BATCH_COUNT = 5;

  const handleGenerate = () => {
    const batch: string[] = [];
    for (let i = 0; i < BATCH_COUNT; i++) {
      batch.push(generatePassword(options));
    }
    setPasswords(batch);
    setAllCopied(false);
  };

  const handleCopyOne = async (pw: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(pw);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch { /* ignore */ }
  };

  const handleCopyAll = async () => {
    const text = passwords.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const content = `PassGen — Batch Export\nGenerated: ${new Date().toLocaleString()}\n\n${passwords.join("\n")}\n\n---\nGenerated securely using CSPRNG (crypto.getRandomValues)\nhttps://intelligent-curie-alpha.vercel.app`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passgen-batch-${timestamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Batch Generate ({BATCH_COUNT})</span>
        </div>
        {passwords.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              title="Copy all passwords"
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all ${
                allCopied
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {allCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{allCopied ? "Copied!" : "Copy all"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              title="Download as .txt"
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Export .txt</span>
            </button>
          </div>
        )}
      </div>

      {/* Generate button or results */}
      {passwords.length === 0 ? (
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-sm text-zinc-500 dark:text-zinc-400 hover:border-sky-400 dark:hover:border-sky-600 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate {BATCH_COUNT} passwords at once</span>
        </button>
      ) : (
        <div className="space-y-1.5">
          {passwords.map((pw, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 truncate flex-1">
                {pw}
              </span>
              <button
                type="button"
                onClick={() => handleCopyOne(pw, idx)}
                aria-label="Copy this password"
                className={`shrink-0 p-1.5 rounded-lg transition-all ${
                  copiedIdx === idx
                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100"
                }`}
              >
                {copiedIdx === idx ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Regenerate batch</span>
          </button>
        </div>
      )}
    </div>
  );
}
