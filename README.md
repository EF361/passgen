# PassGen — Minimalist & Cryptographically Secure Password Generator

<p align="center">
  <a href="https://intelligent-curie-alpha.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel%20Production-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Security-CSPRNG%20Web%20Crypto-emerald?style=for-the-badge&logo=shield&logoColor=white" alt="CSPRNG" />
</p>

<p align="center">
  <b>A modern, responsive, client-side password and passphrase generator designed with high-security CSPRNG mathematics, instant cross-device QR transfer, real-time Shannon entropy metrics, and tailored responsive experiences for Desktop and Mobile.</b>
</p>

<p align="center">
  🌐 <b>Live Deployment</b>: <a href="https://intelligent-curie-alpha.vercel.app">https://intelligent-curie-alpha.vercel.app</a><br/>
  📂 <b>Repository</b>: <a href="https://github.com/EF361/passgen">https://github.com/EF361/passgen</a>
</p>

---

## 🌟 Key Highlights

### 1. Dual Responsive UX Architecture
- **Desktop & iPad / Tablets (`lg:`)**: Spacious 12-column dashboard layout. Features a dedicated **sticky right-side configuration panel** alongside a wide left hero workspace with live strength metrics, character breakdown cards, batch generation, and session history tabs.
- **Mobile Devices (`< lg`)**: Thumb-first vertical flow equipped with an anchored **sticky bottom quick-action bar** for instantaneous one-tap *Generate* and *Copy* actions without scrolling.

### 2. Dual Generation Engines
- **Random Character Engine**: Length range from 6 to 64 characters with independent toggles for Uppercase, Lowercase, Numbers, and Symbols, plus an **Ambiguous Character Filter** (`i, l, 1, I, o, 0, O, |, \`).
- **Memorable Passphrase Engine (xkcd-style)**: Generates human-pronounceable, memorable passphrases using a curated 512-word dictionary with customizable separators (`-`, `.`, `_`, space).

### 3. Deep Security & Mathematical Analysis
- **Shannon Entropy Calculation**: Evaluates bits of cryptographic entropy in real time:
  $$\text{Entropy} = L \times \log_2(R)$$
  *(where $L$ is password length and $R$ is active character pool size).*
- **5-Tier Strength Meter**: Visual color-coded security gauge (`Very Weak` $\to$ `Strong`).
- **Character Breakdown Statistics**: Real-time counter showing exact counts of uppercase, lowercase, numeric digits, and special symbols.

### 4. Cross-Device & Productivity Tools
- 📱 **QR Code Transfer**: Generates an on-screen SVG QR code for friction-free transfer of long credentials to mobile devices without cloud clipboards.
- ⚡ **Batch Generator**: Generates 5 passwords simultaneously with single-click batch copy and **`.txt` file export**.
- 📋 **Session Password History**: In-memory log of the last 10 generated passwords with individual copy buttons.
- 🌓 **Theme Engine**: Modern dark-mode-first aesthetic with smooth Light, Dark, and System mode switching backed by an anti-FOUC initialization script.

---

## 🔒 Cryptographic Architecture

PassGen adheres to strict zero-trust, client-side cryptographic principles:

```
[User Browser]
      │
      ├──> Web Crypto API: window.crypto.getRandomValues()
      │         │
      │         ├──> Rejection Sampling (Uniform distribution, eliminates modulo bias)
      │         ├──> Guaranteed Set Inclusion (Ensures at least 1 char per active set)
      │         └──> Fisher-Yates Shuffle (Cryptographically randomized positioning)
      │
      └──> 100% Client-Side Evaluation (Zero network requests, zero telemetry)
```

1. **No `Math.random()`**: Standard `Math.random()` uses pseudo-random algorithms (e.g. xorshift128+) that are cryptographically predictable. PassGen exclusively uses `globalThis.crypto.getRandomValues()`.
2. **Modulo Bias Elimination**: Implements rejection sampling so that integer ranges that do not cleanly divide $2^{32}$ discard biased samples, guaranteeing truly uniform distribution.
3. **Zero Transmission**: Generated passwords never leave your browser memory. No telemetry, no logs, and no third-party APIs.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **[Next.js 15](https://nextjs.org/)** | React framework with App Router, static generation, and edge optimizations |
| **[React 19](https://react.dev/)** | Modern concurrent UI architecture and hooks |
| **[TypeScript 5](https://www.typescriptlang.org/)** | End-to-end type safety |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first styling with custom glassmorphism and theme variables |
| **[Lucide React](https://lucide.dev/)** | Crisp, lightweight icons |
| **[qrcode.react](https://www.npmjs.com/package/qrcode.react)** | SVG QR code generator for cross-device credential transfer |
| **[Vercel](https://vercel.com/)** | Automated CI/CD deployment via GitHub integration |

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/EF361/passgen.git
cd passgen

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running Tests

```bash
# Run unit test suite (validates CSPRNG uniformity, boundary lengths, and charset isolation)
npm test
```

### Production Build

```bash
# Compile and verify static production build
npm run build
```

---

## 📱 Interface Showcase

### Desktop Split-View Layout (`>= 1024px`)
- **Left Stage**: Interactive Password Hero card with Shannon entropy gauge, character count breakdown, action bar, and secondary workspace tabs (Batch Generator & Session History).
- **Right Side Panel**: Dedicated, sticky configuration card with instant live-sync adjustments.

### Mobile Experience (`< 1024px`)
- **Vertical Streamlined Flow**: Clean cards with segmented tabs at the top.
- **Sticky Bottom Action Bar**: Fast thumb-reach buttons for one-touch generation and clipboard copy.

---

## 📝 Suggested LinkedIn Post Template

Feel free to use the following caption when showcasing this project on LinkedIn:

```text
🚀 Excited to share my latest project: PassGen — a minimalist, cryptographically secure password & passphrase generator!

Tired of clunky, ad-filled password tools, I built PassGen with a focus on cryptographic integrity, elegant UX, and responsive architecture:

🔑 Key Highlights:
• 100% Client-Side CSPRNG: Uses the Web Crypto API (crypto.getRandomValues) with rejection sampling to eliminate modulo bias. Zero network requests, zero server transmission.
• Dual Generation Modes: Traditional randomized character generation (with ambiguous character exclusions like l, 1, I, O, 0) + xkcd-style pronounceable passphrases.
• Real-time Shannon Entropy: Calculates theoretical bit entropy and breaks down uppercase, lowercase, numbers, and symbols dynamically.
• Cross-Device QR Transfer: Scan an on-screen QR code to instantly move generated passwords to your phone without cloud clipboards.
• Tailored Responsive UX: A desktop split-view with a sticky settings side-panel + a mobile-optimized interface with a thumb-anchored action bar.
• Batch Generator & Export: Generate 5 passwords at once and download them directly as a text file.

Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons, and deployed on Vercel with automatic CI/CD.

🌐 Live Demo: https://intelligent-curie-alpha.vercel.app
📂 GitHub Repo: https://github.com/EF361/passgen

I would love to hear your thoughts and feedback! What's your go-to strategy for secure password management?

#webdevelopment #nextjs #reactjs #typescript #tailwindcss #cybersecurity #frontend #javascript #portfolio #vercel
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
