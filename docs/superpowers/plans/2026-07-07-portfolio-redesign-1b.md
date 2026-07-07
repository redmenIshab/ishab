# Portfolio Redesign (Direction 1B — Technical/README) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current warp-starfield portfolio with the "Technical/README" (Direction 1B) design — cool near-black, blue accent, terminal framing, wireframe-sphere hero — driven by real content from `resumeData.js`.

**Architecture:** Single-page Next.js App Router client page composing focused section components. Framer Motion (already installed) handles scroll reveals; a `<canvas>` component renders the wireframe sphere; small hooks handle count-up and magnetic pointer effects; row hover is pure CSS. All content is mapped from `resumeData.js` through one typed view-model module.

**Tech Stack:** Next.js 16.2.3 (App Router), React 19, Tailwind 4 (global stylesheet), Framer Motion 12, `next/font/google` (Space Grotesk + JetBrains Mono).

## Global Constraints

- **No test framework is installed and none should be added.** This is a visual redesign. Each task's verification = `npm run lint` passes AND `npx tsc --noEmit` passes (or `npm run build` succeeds) AND the described manual browser check via `npm run dev` (http://localhost:3000).
- **Next.js version note:** Next 16.2.3 has breaking changes vs. older docs. `next/font/google` usage is confirmed against `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` (variable-font + `variable` CSS-var pattern — same as current `layout.tsx`).
- **Content source:** all copy/links come from `resumeData.js`. No new data layer, no fetching.
- **Design tokens (1B):** bg `#08090b`; surface `#0a0c10`, stripes `#0e1116`, border `#1a1e24`; row-hover bg `#0d0f13`; divider `#14161a`; text primary `#e8ecf0`, secondary `#8b93a1`, muted `#5f6875`, faint `#4d5561`; accent blue `#7db4ff`. Radius 3px. Default easing `cubic-bezier(.2,.7,0,1)`.
- **Fonts:** Space Grotesk (display+body), JetBrains Mono (all meta/labels/nav/tags/footer). Remove Orbitron / Be Vietnam Pro / Fira Code.
- **Motion:** every animation must be disabled/settled under `prefers-reduced-motion: reduce`.
- **Copy strings** (verbatim): nav `REDMEN.ISHAB`, `LEAD ENGINEER · FULL STACK`, `WORK / EXPERIENCE / CONTACT`. Hero kicker `$ whoami — full-stack engineer & technical leader`. Status block `STATUS: SHIPPING` / `LOCATION: NEPAL` / `ROLE: LEAD ENGINEER` / `OPEN TO: GOOD PEOPLE_`. Work header `~/work — THINGS I'VE SHIPPED` / `2019 — 2026`. About label `~/about — README.md`. Experience label `~/experience — WHERE I'VE WORKED`. Skills label `~/skills — WHAT I DO`. Contact kicker `$ echo "let's talk" — I actually reply`. Footer `© 2026 — REDMEN ISHAB`.
- **Commit** after each task. Work happens on branch `redesign-1b-technical` (already checked out).

---

## File Structure

```
app/layout.tsx              MODIFY  fonts → Space Grotesk + JetBrains Mono
app/globals.css             REWRITE 1B tokens, base, keyframes, all section styles
app/page.tsx                REWRITE client page composing sections
app/lib/content.ts          CREATE  typed view models from resumeData
app/lib/useCountUp.ts       CREATE  count-up-on-scroll hook
app/lib/useMagnetic.ts      CREATE  magnetic pointer hook
app/components/Reveal.tsx    CREATE  Framer Motion scroll-reveal wrapper
app/components/Nav.tsx       CREATE  fixed 3-part nav
app/components/WireframeHero.tsx CREATE canvas sphere + glow + status + H1
app/components/IndexRow.tsx  CREATE  shared index-list row
app/components/WorkIndex.tsx CREATE  ~/work project rows
app/components/ExperienceIndex.tsx CREATE ~/experience rows
app/components/FeaturedTile.tsx CREATE 21:9 placeholder
app/components/About.tsx     CREATE  lead + count-up stats
app/components/Skills.tsx    CREATE  ~/skills rows
app/components/Contact.tsx   CREATE  magnetic email + footer
resumeData.d.ts             CREATE  ambient types for resumeData.js
```

The current `WarpCanvas` (in `app/page.tsx`) and all warp/nebula/starfield/glass CSS are deleted.

---

## Task 1: Content layer (view models + types)

**Files:**
- Create: `resumeData.d.ts`
- Create: `app/lib/content.ts`

**Interfaces:**
- Produces: `projects: ProjectVM[]`, `experience: ExperienceVM[]`, `skills: SkillVM[]`, `stats: StatVM[]`, `socials: SocialVM[]`, and constants `NAME_FIRST`, `NAME_LAST`, `HERO_INTRO`, `ABOUT_LEAD_PRE`, `ABOUT_LEAD_HIGHLIGHT`, `ABOUT_LEAD_POST`, `EMAIL`.
  - `ProjectVM = { index: string; name: string; tag: string; url: string; action: string }`
  - `ExperienceVM = { role: string; company: string; period: string }`
  - `SkillVM = { title: string; meta: string }`
  - `StatVM = { value: number; suffix: string; label: string }`
  - `SocialVM = { label: string; url: string }`

- [ ] **Step 1: Add ambient types for the JS data module**

Create `resumeData.d.ts`:

```ts
declare const resumeData: {
  name: string;
  role: string;
  gmailId: string;
  website: string;
  aboutme: string;
  socialLinks: { name: string; url: string; className?: string }[];
  work: {
    CompanyName: string;
    specialization: string;
    MonthOfLeaving?: string;
    YearOfLeaving?: string;
    Achievements: string;
  }[];
  skills: { skillname: string }[];
  portfolio: { name: string; description: string; webURL: string }[];
  [key: string]: unknown;
};
export default resumeData;
```

- [ ] **Step 2: Write the content-mapping module**

Create `app/lib/content.ts`:

```ts
import resumeData from "../../resumeData";

export type ProjectVM = { index: string; name: string; tag: string; url: string; action: string };
export type ExperienceVM = { role: string; company: string; period: string };
export type SkillVM = { title: string; meta: string };
export type StatVM = { value: number; suffix: string; label: string };
export type SocialVM = { label: string; url: string };

const nameParts = resumeData.name.trim().split(/\s+/);
export const NAME_FIRST = nameParts[0] ?? resumeData.name;
export const NAME_LAST = nameParts.slice(1).join(" ") || "";
export const EMAIL = resumeData.gmailId;

export const HERO_INTRO =
  "I build full-stack products and lead the teams that ship them — a decade close to the code, from POS systems to healthcare and AI platforms.";

// About lead, split so the middle phrase can be rendered in the accent colour.
export const ABOUT_LEAD_PRE = "Six years in, I still measure success like an engineer — ship, learn, iterate — but I lead people like ";
export const ABOUT_LEAD_HIGHLIGHT = "people, not processes";
export const ABOUT_LEAD_POST =
  ". From CTO of a hospitality startup to shipping healthcare and AI platforms, I care about the craft and the teams behind it.";

const PROJECT_TAGS: Record<string, string> = {
  Krane: "AI · LOGISTICS",
  Venteur: "HEALTHCARE",
  "Memora Health": "AUTOMATION",
  "Restaurant Management and POS System": "HOSPITALITY",
  "Cryptocurrency Wallet and Exchange Platform": "BLOCKCHAIN",
};

export const projects: ProjectVM[] = resumeData.portfolio.map((p, i) => ({
  index: String(i + 1).padStart(2, "0"),
  name: p.name,
  tag: PROJECT_TAGS[p.name] ?? "",
  url: p.webURL,
  action: "OPEN ↗",
}));

export const experience: ExperienceVM[] = resumeData.work.map((w) => ({
  role: w.specialization.trim(),
  company: w.CompanyName,
  period: w.YearOfLeaving ? w.YearOfLeaving.trim() : "NOW",
}));

export const skills: SkillVM[] = resumeData.skills.map((s) => {
  const [rawTitle, ...rest] = s.skillname.split(":");
  const meta = rest.join(":").trim().replace(/\s*,\s*/g, " · ");
  return { title: rawTitle.trim(), meta };
});

export const stats: StatVM[] = [
  { value: 6, suffix: "y+", label: "YEARS SHIPPING" },
  { value: 5, suffix: "", label: "PRODUCTS BUILT" },
  { value: 20, suffix: "+", label: "ENGINEERS LED" },
];

export const socials: SocialVM[] = [
  ...resumeData.socialLinks.map((s) => ({ label: s.name.toUpperCase(), url: s.url })),
  { label: "MEDIUM", url: resumeData.website.startsWith("http") ? resumeData.website : `https://${resumeData.website}` },
];
```

- [ ] **Step 3: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Sanity-check the mapped data**

Run: `node -e "require('@babel/register'); " 2>/dev/null; npx tsx -e "import('./app/lib/content.ts').then(m => console.log(m.projects.length, m.experience.map(e=>e.period), m.skills.map(s=>s.title)))" 2>/dev/null || echo "tsx not present — skip runtime check, rely on tsc"`
Expected: prints `5`, an array of periods ending in `NOW`, and skill titles `Language`, `Dev Ops`, `Database`, `Operations`, `Industry`, `Technology`. (If `tsx` isn't installed, the `tsc` gate in Step 3 is sufficient.)

- [ ] **Step 5: Commit**

```bash
git add resumeData.d.ts app/lib/content.ts
git commit -m "Add typed content view-model layer from resumeData"
```

---

## Task 2: Foundation — fonts, tokens, base stylesheet, page shell

Swaps the theme wholesale: new fonts, rewritten `globals.css` with all 1B section styles, and a new `page.tsx` shell rendering the fixed nav + empty section anchors. Removes the warp theme so the app builds green on the new foundation.

**Files:**
- Modify: `app/layout.tsx`
- Rewrite: `app/globals.css`
- Rewrite: `app/page.tsx`
- Create: `app/components/Nav.tsx`

**Interfaces:**
- Consumes: `NAME_FIRST`, `NAME_LAST` are not needed here; Nav uses literal copy strings.
- Produces: CSS classes used by later tasks — `.p-root`, `.p-nav`, `.p-section`, `.p-hero`, `.hero-canvas`, `.hero-glow`, `.hero-content`, `.hero-kicker`, `.hero-h1`, `.hero-status`, `.blink`, `.index-head`, `.index-row`, `.index-num`, `.index-title`, `.index-meta`, `.index-action`, `.featured`, `.featured-ph`, `.about-grid`, `.about-lead`, `.hl`, `.stats`, `.stat-num`, `.stat-cap`, `.side-label`, `.skill-row`, `.contact-kicker`, `.contact-email`, `.footer-row`, `.footer-links`, `.reveal`.

- [ ] **Step 1: Swap fonts in `app/layout.tsx`**

Replace the four font imports/instances at the top of `app/layout.tsx` (currently `Be_Vietnam_Pro, Fira_Code, Orbitron, Space_Grotesk`) with exactly:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import resumeData from "../resumeData";

const displayFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
```

Then change the `<html>` className line to:

```tsx
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
```

Leave the entire `metadata` object and the `<body className="min-h-full flex flex-col">` unchanged.

- [ ] **Step 2: Rewrite `app/globals.css`**

Replace the ENTIRE contents of `app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bg: #08090b;
  --surface: #0a0c10;
  --stripe: #0e1116;
  --border: #1a1e24;
  --row-hover: #0d0f13;
  --divider: #14161a;
  --text: #e8ecf0;
  --text-2: #8b93a1;
  --muted: #5f6875;
  --faint: #4d5561;
  --accent: #7db4ff;
  --ease: cubic-bezier(.2, .7, 0, 1);
  --pad: clamp(1.25rem, 4vw, 3rem);
}

@theme inline {
  --color-background: var(--bg);
  --color-foreground: var(--text);
  --font-sans: var(--font-space-grotesk);
  --font-mono: var(--font-jetbrains-mono);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-space-grotesk), sans-serif;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

.p-root { position: relative; min-height: 100vh; overflow-x: clip; }

/* ---------- nav ---------- */
.p-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; justify-content: space-between; align-items: center;
  gap: 1rem; padding: 1.4rem var(--pad);
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 0.75rem; letter-spacing: 0.08em; color: var(--text-2);
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--divider);
}
.p-nav .brand { color: var(--text); font-weight: 600; }
.p-nav .mid { color: var(--muted); }
.p-nav .links { display: flex; gap: 1.75rem; }
.p-nav .links a { transition: color 0.25s var(--ease); }
.p-nav .links a:hover { color: var(--accent); }

/* ---------- section rhythm ---------- */
.p-section { padding: clamp(4rem, 9vw, 8.75rem) var(--pad); border-top: 1px solid var(--divider); }
.side-label {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 0.7rem; letter-spacing: 0.16em; color: var(--muted);
}

/* ---------- hero ---------- */
.p-hero {
  position: relative; min-height: 100vh; overflow: hidden;
  border-bottom: 1px solid var(--divider);
}
.hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.hero-vignette {
  position: absolute; inset: 0; z-index: 1;
  background: radial-gradient(90% 80% at 50% 50%, transparent 40%, var(--bg) 92%);
}
.hero-glow {
  position: absolute; width: 560px; height: 560px; left: 0; top: 0; z-index: 1;
  pointer-events: none; border-radius: 50%;
  background: radial-gradient(circle, rgba(125, 180, 255, 0.12), transparent 62%);
  transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.4s;
}
.hero-content { position: absolute; left: var(--pad); bottom: 3.5rem; right: var(--pad); z-index: 2; }
.hero-kicker {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 0.75rem; letter-spacing: 0.2em; color: var(--accent); margin: 0 0 1.5rem;
}
.hero-h1 {
  margin: 0; font-weight: 700; text-transform: uppercase;
  font-size: clamp(3rem, 12vw, 7rem); line-height: 0.9; letter-spacing: -0.045em;
}
.hero-h1 .accent { color: var(--accent); }
.hero-copy { max-width: 560px; margin: 1.75rem 0 0; font-size: 1.05rem; line-height: 1.6; color: var(--text-2); }
.hero-status {
  position: absolute; right: var(--pad); top: 7.5rem; z-index: 2; text-align: right;
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 0.75rem; color: var(--muted); line-height: 1.9;
}
.blink { color: var(--accent); animation: blink 1s step-end infinite; }

/* ---------- index rows (work + experience) ---------- */
.index-head {
  display: flex; justify-content: space-between;
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 0.7rem; letter-spacing: 0.16em; color: var(--muted);
  padding-bottom: 1.1rem; border-bottom: 1px solid var(--divider); margin-bottom: 0.5rem;
}
.index-row {
  display: grid; grid-template-columns: 48px 1fr 200px 120px; gap: 1.5rem;
  align-items: center; padding: 1.6rem 1rem; margin: 0 -1rem;
  border-bottom: 1px solid var(--divider);
  transition: background 0.3s var(--ease);
}
.index-num { font-family: var(--font-jetbrains-mono), monospace; font-size: 0.75rem; color: var(--muted); transition: color 0.3s; }
.index-title { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 500; letter-spacing: -0.02em; transition: transform 0.3s var(--ease), color 0.3s; }
.index-meta { font-family: var(--font-jetbrains-mono), monospace; font-size: 0.75rem; color: var(--text-2); }
.index-action { font-family: var(--font-jetbrains-mono), monospace; font-size: 0.75rem; color: var(--accent); text-align: right; transition: transform 0.3s var(--ease); }
.index-row:hover { background: var(--row-hover); }
.index-row:hover .index-num { color: var(--accent); }
.index-row:hover .index-title { transform: translateX(14px); color: var(--accent); }
.index-row:hover .index-action { transform: translateX(8px); }

/* ---------- featured tile ---------- */
.featured { padding: clamp(2.5rem, 6vw, 4rem) var(--pad) clamp(4rem, 8vw, 6rem); }
.featured-ph {
  aspect-ratio: 21 / 9; border: 1px solid var(--border); border-radius: 3px;
  background: repeating-linear-gradient(90deg, var(--stripe) 0 16px, var(--surface) 16px 32px);
  display: flex; align-items: flex-end; padding: 1.5rem;
  font-family: var(--font-jetbrains-mono), monospace; font-size: 0.75rem; color: var(--faint); letter-spacing: 0.1em;
}

/* ---------- about + skills + experience side grid ---------- */
.about-grid { display: grid; grid-template-columns: 200px 1fr; gap: 3rem; }
.about-lead { margin: 0; font-size: clamp(1.5rem, 3.4vw, 2.1rem); font-weight: 400; line-height: 1.36; letter-spacing: -0.02em; max-width: 780px; }
.hl { color: var(--accent); }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3.5rem; max-width: 620px; }
.stat-num { font-size: clamp(2.2rem, 5vw, 3.25rem); font-weight: 600; letter-spacing: -0.03em; }
.stat-cap { font-family: var(--font-jetbrains-mono), monospace; font-size: 0.68rem; color: var(--muted); letter-spacing: 0.12em; margin-top: 0.4rem; }
.skill-row {
  display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  padding: 1.4rem 0; border-bottom: 1px solid var(--divider);
}
.skill-row .title { font-size: clamp(1.25rem, 2.6vw, 1.6rem); font-weight: 500; }
.skill-row .meta { font-family: var(--font-jetbrains-mono), monospace; font-size: 0.75rem; color: var(--text-2); text-align: right; }

/* ---------- contact ---------- */
.contact-kicker { font-family: var(--font-jetbrains-mono), monospace; font-size: 0.75rem; letter-spacing: 0.2em; color: var(--accent); margin: 0 0 1.75rem; }
.contact-email {
  display: inline-block; font-weight: 700; text-transform: uppercase; line-height: 0.95;
  font-size: clamp(2.25rem, 8vw, 5rem); letter-spacing: -0.04em;
  transition: color 0.3s, transform 0.15s ease-out; will-change: transform;
}
.contact-email:hover { color: var(--accent); }
.footer-row {
  display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  margin-top: 4.5rem; font-family: var(--font-jetbrains-mono), monospace;
  font-size: 0.75rem; letter-spacing: 0.1em; color: var(--muted);
}
.footer-links { display: flex; gap: 1.75rem; }
.footer-links a { transition: color 0.25s; }
.footer-links a:hover { color: var(--accent); }

/* ---------- keyframes ---------- */
@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes revClip { from { clip-path: inset(0 0 100% 0); opacity: 0.2; } to { clip-path: inset(0 0 0 0); opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 820px) {
  .p-nav .mid { display: none; }
  .about-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .index-row { grid-template-columns: 32px 1fr auto; }
  .index-row .index-meta { display: none; }
  .hero-status { position: static; text-align: left; margin-top: 1.5rem; }
  .hero-content { bottom: 2.5rem; }
  .stats { grid-template-columns: 1fr; gap: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 3: Create the fixed nav component**

Create `app/components/Nav.tsx`:

```tsx
export function Nav() {
  return (
    <nav className="p-nav">
      <span className="brand">REDMEN.ISHAB</span>
      <span className="mid">LEAD ENGINEER · FULL STACK</span>
      <span className="links">
        <a href="#work">WORK</a>
        <a href="#experience">EXPERIENCE</a>
        <a href="#contact">CONTACT</a>
      </span>
    </nav>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx` with the new shell**

Replace the ENTIRE contents of `app/page.tsx` with:

```tsx
import { Nav } from "./components/Nav";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <header className="p-hero" id="home" />
      <section className="p-section" id="work" />
      <section className="featured" />
      <section className="p-section" id="about" />
      <section className="p-section" id="experience" />
      <section className="p-section" id="skills" />
      <section className="p-section" id="contact" />
    </div>
  );
}
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: both pass, no references to the deleted fonts or warp classes.

- [ ] **Step 6: Browser check**

Run: `npm run dev`, open http://localhost:3000.
Expected: near-black `#08090b` page, fixed mono nav (`REDMEN.ISHAB` left, `LEAD ENGINEER · FULL STACK` center, `WORK/EXPERIENCE/CONTACT` right with blue hover), empty section spacing below. No console errors. Stop the dev server (Ctrl-C) when done.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/globals.css app/page.tsx app/components/Nav.tsx
git commit -m "Swap to 1B fonts, tokens, base stylesheet and page shell"
```

---

## Task 3: Hero — wireframe sphere, glow, status, kinetic H1

**Files:**
- Create: `app/components/WireframeHero.tsx`
- Create: `app/components/Reveal.tsx`
- Modify: `app/page.tsx` (wire hero + make client)

**Interfaces:**
- Consumes: `NAME_FIRST`, `NAME_LAST`, `HERO_INTRO` from `app/lib/content`.
- Produces: `<WireframeHero />` (self-contained, no props); `<Reveal delay? className?>` wrapper used by later tasks.

- [ ] **Step 1: Create the reveal wrapper**

Create `app/components/Reveal.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create the wireframe hero**

Create `app/components/WireframeHero.tsx`. This ports the handoff's `_setupWireframe` + hero pointer glow into a React client component with rAF cleanup and reduced-motion handling:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { NAME_FIRST, NAME_LAST, HERO_INTRO } from "../lib/content";

export function WireframeHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!canvas || !hero) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let R = 0;
    const N = 520;
    const pts: { x: number; y: number; z: number }[] = [];
    const gr = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = gr * i;
      pts.push({ x: Math.cos(th) * rad, y, z: Math.sin(th) * rad });
    }

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w, h) * 0.34;
    };

    let a = 0;
    let tiltX = 0;
    let tiltY = 0;

    const render = () => {
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      if (!reduce) a += 0.0045;
      tiltY += (mouse.current.x * 0.6 - tiltY) * 0.06;
      tiltX += (mouse.current.y * 0.5 - tiltX) * 0.06;
      const ca = Math.cos(a + tiltY);
      const sa = Math.sin(a + tiltY);
      const cb = Math.cos(a * 0.6 + tiltX);
      const sb = Math.sin(a * 0.6 + tiltX);
      for (const p of pts) {
        let x = p.x * ca - p.z * sa;
        let z = p.x * sa + p.z * ca;
        const y = p.y * cb - z * sb;
        z = p.y * sb + z * cb;
        const scale = (z + 1.6) / 2.6;
        const sx = cx + x * R;
        const sy = cy + y * R;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.4 * scale + 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(125,180,255," + (0.15 + scale * 0.6) + ")";
        ctx.fill();
      }
    };

    const tick = () => {
      render();
      raf = requestAnimationFrame(tick);
    };

    fit();
    if (reduce) {
      render();
    } else {
      tick();
    }

    const onResize = () => {
      fit();
      if (reduce) render();
    };
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      mouse.current.x = (x / r.width) * 2 - 1;
      mouse.current.y = (y / r.height) * 2 - 1;
      if (glow) {
        glow.style.opacity = "1";
        glow.style.left = x + "px";
        glow.style.top = y + "px";
      }
    };
    const onLeave = () => {
      mouse.current.x = 0;
      mouse.current.y = 0;
      if (glow) glow.style.opacity = "0";
    };

    window.addEventListener("resize", onResize);
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <header className="p-hero" id="home" ref={heroRef}>
      <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-glow" ref={glowRef} aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-kicker">$ whoami — full-stack engineer &amp; technical leader</p>
        <h1 className="hero-h1" style={{ animation: "revClip 1s .2s cubic-bezier(.2,.7,0,1) both" }}>
          {NAME_FIRST}
          <br />
          <span className="accent">{NAME_LAST}.</span>
        </h1>
        <p className="hero-copy">{HERO_INTRO}</p>
        <div className="hero-status">
          STATUS: SHIPPING
          <br />
          LOCATION: NEPAL
          <br />
          ROLE: LEAD ENGINEER
          <br />
          OPEN TO: GOOD PEOPLE<span className="blink">_</span>
        </div>
      </div>
    </header>
  );
}
```

Note: the status block is rendered inside `.hero-content` so the mobile rule (`.hero-status { position: static }`) flows it under the copy. On desktop `.hero-status` is absolutely positioned to the hero.

- [ ] **Step 3: Wire the hero into the page**

Replace `app/page.tsx` with (adds `"use client"` and swaps the empty `<header>` for `<WireframeHero/>`):

```tsx
"use client";

import { Nav } from "./components/Nav";
import { WireframeHero } from "./components/WireframeHero";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <WireframeHero />
      <section className="p-section" id="work" />
      <section className="featured" />
      <section className="p-section" id="about" />
      <section className="p-section" id="experience" />
      <section className="p-section" id="skills" />
      <section className="p-section" id="contact" />
    </div>
  );
}
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: both pass.

- [ ] **Step 5: Browser check**

Run: `npm run dev`, open http://localhost:3000.
Expected: rotating blue dotted sphere fills the hero; moving the cursor tilts the sphere and shows a soft blue glow that follows the pointer; `REDMEN` / `ISHAB.` (blue) H1 bottom-left with a clip-reveal on load; status block top-right with a blinking `_`. Toggle OS "reduce motion" → sphere renders static, no glow follow jitter. Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add app/components/WireframeHero.tsx app/components/Reveal.tsx app/page.tsx
git commit -m "Add wireframe-sphere hero with cursor glow and status block"
```

---

## Task 4: Work & Experience index lists

**Files:**
- Create: `app/components/IndexRow.tsx`
- Create: `app/components/WorkIndex.tsx`
- Create: `app/components/ExperienceIndex.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `projects`, `experience` from `app/lib/content`; `Reveal` from `./Reveal`.
- Produces: `<WorkIndex />`, `<ExperienceIndex />` (no props).

- [ ] **Step 1: Create the shared index row**

Create `app/components/IndexRow.tsx`:

```tsx
import type { ReactNode } from "react";

export function IndexRow({
  num,
  title,
  meta,
  action,
  href,
}: {
  num: string;
  title: ReactNode;
  meta: string;
  action: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="index-num">{num}</span>
      <span className="index-title">{title}</span>
      <span className="index-meta">{meta}</span>
      <span className="index-action">{action}</span>
    </>
  );
  if (href) {
    return (
      <a className="index-row" href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return <div className="index-row">{inner}</div>;
}
```

- [ ] **Step 2: Create the work index**

Create `app/components/WorkIndex.tsx`:

```tsx
import { projects } from "../lib/content";
import { IndexRow } from "./IndexRow";
import { Reveal } from "./Reveal";

export function WorkIndex() {
  return (
    <section className="p-section" id="work">
      <div className="index-head">
        <span>~/work — THINGS I&apos;VE SHIPPED</span>
        <span>2019 — 2026</span>
      </div>
      {projects.map((p, i) => (
        <Reveal key={p.name} delay={i * 0.05}>
          <IndexRow num={p.index} title={p.name} meta={p.tag} action={p.action} href={p.url} />
        </Reveal>
      ))}
    </section>
  );
}
```

- [ ] **Step 3: Create the experience index**

Create `app/components/ExperienceIndex.tsx`:

```tsx
import { experience } from "../lib/content";
import { IndexRow } from "./IndexRow";
import { Reveal } from "./Reveal";

export function ExperienceIndex() {
  return (
    <section className="p-section" id="experience">
      <div className="about-grid">
        <div className="side-label">~/experience — WHERE I&apos;VE WORKED</div>
        <div>
          {experience.map((e, i) => (
            <Reveal key={`${e.company}-${e.role}`} delay={i * 0.05}>
              <IndexRow num="→" title={e.role} meta={e.company} action={e.period} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire both into the page**

In `app/page.tsx`, replace the empty `<section className="p-section" id="work" />` line with `<WorkIndex />` and the empty `<section className="p-section" id="experience" />` line with `<ExperienceIndex />`, and add the imports. The file becomes:

```tsx
"use client";

import { Nav } from "./components/Nav";
import { WireframeHero } from "./components/WireframeHero";
import { WorkIndex } from "./components/WorkIndex";
import { ExperienceIndex } from "./components/ExperienceIndex";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <WireframeHero />
      <WorkIndex />
      <section className="featured" />
      <section className="p-section" id="about" />
      <ExperienceIndex />
      <section className="p-section" id="skills" />
      <section className="p-section" id="contact" />
    </div>
  );
}
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: both pass.

- [ ] **Step 6: Browser check**

Run: `npm run dev`, open http://localhost:3000.
Expected: `~/work` header with `2019 — 2026`; 5 rows (Krane…Crypto Wallet) with tags and blue `OPEN ↗`; hovering a row shifts the title right + turns it blue, index turns blue, bg darkens, arrow nudges. `~/experience` shows 4 rows (role / company / period) with the last period `NOW`. Rows fade+rise on scroll into view. Clicking a work row opens its URL in a new tab. Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add app/components/IndexRow.tsx app/components/WorkIndex.tsx app/components/ExperienceIndex.tsx app/page.tsx
git commit -m "Add work and experience index lists with hover interactions"
```

---

## Task 5: Featured tile, About (count-up stats), Skills

**Files:**
- Create: `app/lib/useCountUp.ts`
- Create: `app/components/FeaturedTile.tsx`
- Create: `app/components/About.tsx`
- Create: `app/components/Skills.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `stats`, `skills`, `ABOUT_LEAD_PRE`, `ABOUT_LEAD_HIGHLIGHT`, `ABOUT_LEAD_POST` from `app/lib/content`; `Reveal`.
- Produces: `useCountUp(target, suffix?, durationMs?) → { ref, display }`; `<FeaturedTile />`, `<About />`, `<Skills />`.

- [ ] **Step 1: Create the count-up hook**

Create `app/lib/useCountUp.ts`:

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, suffix = "", durationMs = 1100) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState("0" + suffix);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target + suffix);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return;
          done.current = true;
          io.unobserve(el);
          const t0 = performance.now();
          const step = (t: number) => {
            const p = Math.min((t - t0) / durationMs, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(target * eased) + suffix);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, suffix, durationMs]);

  return { ref, display };
}
```

- [ ] **Step 2: Create the featured tile**

Create `app/components/FeaturedTile.tsx`:

```tsx
import { Reveal } from "./Reveal";

export function FeaturedTile() {
  return (
    <section className="featured">
      <Reveal>
        {/* Swap this striped placeholder for a real <img src="/featured.png" .../> when available. */}
        <div className="featured-ph">[ featured — product hero shot, 21:9 ]</div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Create the About section with count-up stats**

Create `app/components/About.tsx`:

```tsx
"use client";

import { stats, ABOUT_LEAD_PRE, ABOUT_LEAD_HIGHLIGHT, ABOUT_LEAD_POST } from "../lib/content";
import { useCountUp } from "../lib/useCountUp";
import { Reveal } from "./Reveal";

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, display } = useCountUp(value, suffix);
  return (
    <div>
      <div className="stat-num">
        <span ref={ref}>{display}</span>
      </div>
      <div className="stat-cap">{label}</div>
    </div>
  );
}

export function About() {
  return (
    <section className="p-section" id="about">
      <div className="about-grid">
        <div className="side-label">~/about — README.md</div>
        <Reveal>
          <p className="about-lead">
            {ABOUT_LEAD_PRE}
            <span className="hl">{ABOUT_LEAD_HIGHLIGHT}</span>
            {ABOUT_LEAD_POST}
          </p>
          <div className="stats">
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create the Skills section**

Create `app/components/Skills.tsx`:

```tsx
import { skills } from "../lib/content";
import { Reveal } from "./Reveal";

export function Skills() {
  return (
    <section className="p-section" id="skills">
      <div className="about-grid">
        <div className="side-label">~/skills — WHAT I DO</div>
        <div>
          {skills.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="skill-row">
                <span className="title">{s.title}</span>
                <span className="meta">{s.meta}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire into the page**

In `app/page.tsx`, replace the empty `featured`, `about`, and `skills` section lines with the components and add imports:

```tsx
"use client";

import { Nav } from "./components/Nav";
import { WireframeHero } from "./components/WireframeHero";
import { WorkIndex } from "./components/WorkIndex";
import { FeaturedTile } from "./components/FeaturedTile";
import { About } from "./components/About";
import { ExperienceIndex } from "./components/ExperienceIndex";
import { Skills } from "./components/Skills";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <WireframeHero />
      <WorkIndex />
      <FeaturedTile />
      <About />
      <ExperienceIndex />
      <Skills />
      <section className="p-section" id="contact" />
    </div>
  );
}
```

- [ ] **Step 6: Verify build + lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: both pass.

- [ ] **Step 7: Browser check**

Run: `npm run dev`, open http://localhost:3000.
Expected: 21:9 striped featured tile reveals on scroll; About shows the lead with the blue-highlighted phrase and three stats that count up from 0 (`6y+`, `5`, `20+`) when scrolled into view, once; Skills shows 6 rows (Language / Dev Ops / Database / Operations / Industry / Technology) with mono meta on the right. Under "reduce motion", stats show final values immediately. Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add app/lib/useCountUp.ts app/components/FeaturedTile.tsx app/components/About.tsx app/components/Skills.tsx app/page.tsx
git commit -m "Add featured tile, about with count-up stats, and skills"
```

---

## Task 6: Contact (magnetic email + footer) & final verification

**Files:**
- Create: `app/lib/useMagnetic.ts`
- Create: `app/components/Contact.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `EMAIL`, `socials` from `app/lib/content`; `Reveal`.
- Produces: `useMagnetic(maxX?, maxY?) → ref`; `<Contact />`.

- [ ] **Step 1: Create the magnetic hook**

Create `app/lib/useMagnetic.ts`:

```ts
"use client";

import { useEffect, useRef } from "react";

export function useMagnetic<T extends HTMLElement>(maxX = 16, maxY = 12) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `translate(${dx * maxX}px, ${dy * maxY}px)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [maxX, maxY]);
  return ref;
}
```

- [ ] **Step 2: Create the contact section**

Create `app/components/Contact.tsx`:

```tsx
"use client";

import { EMAIL, socials } from "../lib/content";
import { useMagnetic } from "../lib/useMagnetic";
import { Reveal } from "./Reveal";

export function Contact() {
  const emailRef = useMagnetic<HTMLAnchorElement>();
  return (
    <section className="p-section" id="contact">
      <Reveal>
        <p className="contact-kicker">$ echo &quot;let&apos;s talk&quot; — I actually reply</p>
        <a ref={emailRef} className="contact-email" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <div className="footer-row">
          <span>© 2026 — REDMEN ISHAB</span>
          <div className="footer-links">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Wire into the page (final composition)**

Replace the empty `<section className="p-section" id="contact" />` line in `app/page.tsx` with `<Contact />` and add its import. Final file:

```tsx
"use client";

import { Nav } from "./components/Nav";
import { WireframeHero } from "./components/WireframeHero";
import { WorkIndex } from "./components/WorkIndex";
import { FeaturedTile } from "./components/FeaturedTile";
import { About } from "./components/About";
import { ExperienceIndex } from "./components/ExperienceIndex";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <WireframeHero />
      <WorkIndex />
      <FeaturedTile />
      <About />
      <ExperienceIndex />
      <Skills />
      <Contact />
    </div>
  );
}
```

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors.

- [ ] **Step 5: Full-page browser check**

Run: `npm run dev`, open http://localhost:3000 and scroll top to bottom.
Expected: hero → work → featured → about → experience → skills → contact all styled per 1B; contact email is 80px uppercase, turns blue and is pulled toward the cursor on hover; footer shows `© 2026 — REDMEN ISHAB` and `LINKEDIN ↗ · GITHUB ↗ · MEDIUM ↗` with working links. Resize to ~375px wide: nav center hides, status block flows under hero copy, index rows collapse (tags hidden), grids stack. Toggle reduce-motion: no animations, everything readable. No console errors. Stop dev server.

- [ ] **Step 6: Confirm no dead theme references remain**

Run: `grep -rEn "warp|nebula|starfield|Orbitron|Be_Vietnam|Fira_Code|glass-panel" app/ || echo "clean"`
Expected: prints `clean` (all old-theme identifiers removed).

- [ ] **Step 7: Commit**

```bash
git add app/lib/useMagnetic.ts app/components/Contact.tsx app/page.tsx
git commit -m "Add magnetic contact section and finalize 1B redesign"
```

---

## Self-Review (completed during authoring)

- **Spec coverage:** Nav (T2), hero sphere+glow+status+H1 (T3), ~/work index (T4), featured tile (T5), ~/about lead+3 count-up stats (T5), ~/experience new section (T4), ~/skills (T5), contact magnetic email+footer (T6), tokens/fonts (T2), reveals via Framer Motion (`Reveal`, used T3–T6), responsive + reduced-motion (T2 CSS, verified T6). All spec sections map to a task.
- **Placeholder scan:** no TBD/TODO; every code step shows complete code; featured image intentionally a labelled placeholder per spec §9 (user supplies assets later).
- **Type consistency:** view-model type names (`ProjectVM`/`ExperienceVM`/`SkillVM`/`StatVM`/`SocialVM`) and exports (`projects`, `experience`, `skills`, `stats`, `socials`, `NAME_FIRST`, `NAME_LAST`, `EMAIL`, `HERO_INTRO`, `ABOUT_LEAD_*`) defined in T1 and consumed unchanged in T3–T6. Hook signatures `useCountUp(target, suffix?, durationMs?)` and `useMagnetic(maxX?, maxY?)` match their call sites. CSS class names produced in T2 match those used by all components.
```
