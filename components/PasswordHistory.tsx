"use client";

import { useState } from "react";
import { Copy, Check, ClipboardList, Trash2 } from "lucide-react";

interface PasswordEntry {
  id: string;
  password: string;
  createdAt: Date;
}

interface PasswordHistoryProps {
  history: PasswordEntry[];
  onClear: () => void;
}

export type { PasswordEntry };

export function PasswordHistory({ history, onClear }: PasswordHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (entry: PasswordEntry) => {
    try {
      await navigator.clipboard.writeText(entry.password);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Recent Passwords ({history.length})</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          title="Clear history"
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="space-y-1.5">
        {history.map((entry, idx) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-[10px] tabular-nums text-zinc-400 dark:text-zinc-600 shrink-0 w-4 text-right">
                {idx + 1}
              </span>
              <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 truncate">
                {entry.password}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(entry)}
              title="Copy password"
              aria-label="Copy password from history"
              className={`shrink-0 p-1.5 rounded-lg transition-all ${
                copiedId === entry.id
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100"
              }`}
            >
              {copiedId === entry.id ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
