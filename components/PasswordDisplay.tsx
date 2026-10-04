"use client";

import { useState } from "react";
import { Copy, Check, RotateCw, Lock, QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
}

export function PasswordDisplay({ password, onRegenerate }: PasswordDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [spinning, setSpinning] = useState(false);
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

  const handleRegenerateClick = () => {
    setSpinning(true);
    setShowQR(false);
    onRegenerate();
    setTimeout(() => setSpinning(false), 450);
  };

  return (
    <div className="relative group w-full space-y-2">
      {/* Main Password Row */}
      <div className="flex items-center justify-between p-4 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-x-auto select-all">
            {password ? (
              <span className="font-mono text-lg md:text-xl font-medium tracking-wide text-zinc-900 dark:text-zinc-100 break-all select-all">
                {password}
              </span>
            ) : (
              <span className="text-zinc-400 dark:text-zinc-500 text-sm italic select-none">
                Select options below to generate password...
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* QR Code Toggle */}
          <button
            type="button"
            onClick={() => setShowQR((v) => !v)}
            disabled={!password}
            title="Show QR code"
            aria-label="Toggle QR code"
            className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
              showQR
                ? "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {showQR ? <X className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
          </button>

          {/* Refresh / Regenerate Button */}
          <button
            type="button"
            onClick={handleRegenerateClick}
            disabled={!password}
            title="Generate new password"
            aria-label="Generate new password"
            className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
          >
            <RotateCw
              className={`w-5 h-5 transition-transform duration-500 ${spinning ? "rotate-180" : ""}`}
            />
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!password}
            title={copied ? "Copied to clipboard!" : "Copy to clipboard"}
            aria-label="Copy to clipboard"
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm active:scale-95 ${
              copied
                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied</span>
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
