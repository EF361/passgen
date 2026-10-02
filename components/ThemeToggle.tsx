"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("theme") as ThemeMode) || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === "system") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isSystemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-full border border-zinc-300/50 dark:border-zinc-700/50 backdrop-blur-sm h-9 w-28 animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full border border-zinc-300 dark:border-zinc-700/60 shadow-sm backdrop-blur-md transition-all">
      <button
        type="button"
        onClick={() => handleThemeChange("light")}
        title="Light theme"
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "light"
            ? "bg-white text-amber-500 shadow-sm"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
        aria-label="Switch to light mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => handleThemeChange("dark")}
        title="Dark theme"
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "dark"
            ? "bg-zinc-900 text-sky-400 shadow-sm"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
        aria-label="Switch to dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => handleThemeChange("system")}
        title="Follow system theme"
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "system"
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
        aria-label="Switch to system mode"
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
}
