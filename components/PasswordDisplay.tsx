"use client";

import { useState } from "react";
import { Copy, Check, Lock, QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PasswordDisplayProps {
  password: string;
  onRegenerate?: () => void;
}

export function PasswordDisplay({ password }: PasswordDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group w-full space-y-3">
      {/* Main Password Card */}
      <div className="p-4 sm:p-5 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm transition-all duration-200 space-y-3">
        {/* Header toolbar: Status/Label on left, QR & Copy actions on right */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Active Password
            </span>
            {password && (
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                ({password.length} chars)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* QR Code Toggle */}
            <button
              type="button"
              onClick={() => setShowQR((v) => !v)}
              disabled={!password}
              title={showQR ? "Hide QR code" : "Show QR code"}
              aria-label="Toggle QR code"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
                showQR
                  ? "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {showQR ? <X className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden sm:inline">{showQR ? "Close" : "QR"}</span>
            </button>

            {/* Quick Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!password}
              title={copied ? "Copied to clipboard!" : "Copy to clipboard"}
              aria-label="Copy to clipboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 shadow-sm active:scale-95 ${
                copied
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-40"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 animate-in zoom-in duration-200" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dedicated Horizontal Password Display: Full card width without wrapping */}
        <div className="w-full overflow-x-auto py-1 scrollbar-none select-all">
          {password ? (
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-zinc-900 dark:text-zinc-100 whitespace-nowrap select-all text-left">
              {password}
            </div>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500 text-sm italic select-none">
              Generating secure password...
            </span>
          )}
        </div>
      </div>

      {/* QR Code Panel */}
      {showQR && password && (
        <div className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Scan to transfer password to another device
          </p>
          <div className="p-3 bg-white rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <QRCodeSVG
              value={password}
              size={160}
              bgColor="#ffffff"
              fgColor="#09090b"
              level="M"
            />
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center max-w-xs">
            Never share QR codes of sensitive passwords over public channels
          </p>
        </div>
      )}
    </div>
  );
}
