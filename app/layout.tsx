import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassGen — Clean & Secure Password Generator",
  description:
    "A clean, minimal, cryptographically secure password generator. Customize length, symbols, numbers, and exclude ambiguous characters with real-time entropy estimation.",
  keywords: ["PassGen", "password generator", "security", "cryptography", "minimalist", "vercel"],
  authors: [{ name: "PassGen" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark) || (saved === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-sky-500/20 selection:text-sky-500 min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
