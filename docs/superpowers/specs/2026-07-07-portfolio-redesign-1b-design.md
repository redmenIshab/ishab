# Portfolio Redesign — Direction 1B "Technical / README"

**Date:** 2026-07-07
**Owner:** Redmen Ishab
**Status:** Approved for planning

## 1. Goal

Replace the current "warp-speed starfield" portfolio with a redesign based on the
`design_handoff_portfolio` bundle, **Direction 1B — Technical / README**: a cool,
engineering-forward dark aesthetic with terminal/README framing, uppercase Space
Grotesk display type, monospace meta labels, a rotating wireframe-sphere hero, and
subtle pointer-reactive micro-interactions.

The site stays a single-page personal portfolio driven by real content from
`resumeData.js` (Redmen Ishab — Full Stack / Lead Engineer, Nepal).

## 2. Stack & Constraints

- Stay in the existing **Next.js 16 / React 19 / Tailwind 4** app.
- Reuse **Framer Motion** (already a dependency) for scroll reveals (`whileInView`).
- Use a `<canvas>` component for the wireframe sphere; plain pointer handlers for
  glow / magnetic / row-hover / count-up interactions.
- `resumeData.js` remains the single content source. No new data layer, no fetching.
- **Next.js note:** this Next version has breaking changes — consult
  `node_modules/next/dist/docs/` before writing framework-touching code (per `AGENTS.md`).
- All motion must respect `prefers-reduced-motion`.
- Keep existing SEO plumbing: `app/robots.ts`, `app/sitemap.ts`, and the
  `resumeData`-driven metadata in `app/layout.tsx`.

## 3. Design Tokens (1B)

- Background: `#08090b`
- Surface / placeholder base: `#0a0c10`, stripes `#0e1116`, border `#1a1e24`
- Row hover bg: `#0d0f13`
- Divider border: `#14161a`
- Text primary: `#e8ecf0`; secondary: `#8b93a1`; muted: `#5f6875`; faint `#4d5561`
- Accent (blue): `#7db4ff`
- Outer horizontal padding: 48px (fluid down on mobile)
- Section vertical rhythm: 100–140px
- Border radius: 3px (surfaces)
- Easing (default): `cubic-bezier(.2,.7,0,1)`

### Typography

- **Space Grotesk** (300/400/500/600/700) — display + body/UI.
- **JetBrains Mono** (400/500/600) — all meta labels, nav, tags, kickers, footer.
- Fonts loaded via `next/font/google` in `app/layout.tsx` (replacing the current
  Orbitron / Be Vietnam Pro / Fira Code set).
- Type scale (fluid via `clamp()`, values at 1280px design width):
  - Hero H1: Space Grotesk 700, 112px, uppercase, line-height .9, letter-spacing -.045em
  - Project/experience row title: Space Grotesk 500, 32px, letter-spacing -.02em
  - About lead: Space Grotesk 400, 34px, line-height 1.36
  - Stat numbers: Space Grotesk 600, 52px
  - Contact email: Space Grotesk 700, 80px, uppercase
  - Mono meta: JetBrains Mono, 11–12px, letter-spacing .1–.22em, often uppercase

## 4. File Structure

Replaces the warp theme.

```
app/page.tsx            composes sections from resumeData (client component)
app/globals.css         rewritten for 1B tokens
app/layout.tsx          fonts swapped to Space Grotesk + JetBrains Mono
app/components/
  Nav.tsx               fixed 3-part nav
  WireframeHero.tsx     canvas sphere + cursor glow + status block + kinetic H1
  WorkIndex.tsx         ~/work project index rows
  ExperienceIndex.tsx   ~/experience job-history rows (new section)
  FeaturedTile.tsx      21:9 placeholder with real <img> slot
  About.tsx             lead + 3 count-up stats
  Skills.tsx            ~/skills rows
  Contact.tsx           magnetic email + footer
app/lib/
  useMagnetic.ts        magnetic-pull pointer hook
  useCountUp.ts         count-up-on-scroll hook
```

The current `WarpCanvas` component and all warp/nebula/starfield/glass CSS are removed.
Each unit has one purpose, takes typed props derived from `resumeData`, and can be
understood/tested independently.

## 5. Sections & Content Mapping

### Nav (fixed, top, bottom border `#14161a`)
- Left: `REDMEN.ISHAB` (weight 600)
- Center: `LEAD ENGINEER · FULL STACK` (`#5f6875`)
- Right: `WORK / EXPERIENCE / CONTACT` (mono links)

### Hero (min-height 100vh)
- Layers: `<canvas>` wireframe sphere (z0) → vignette radial (z1) → pointer glow (z1)
  → content (z2).
- Bottom-left: mono kicker `$ whoami — full-stack engineer & technical leader`;
  H1 `REDMEN` / `ISHAB.` (2nd line blue `#7db4ff`); paragraph from about copy
  (a concise intro line, not the full multi-paragraph `aboutme`).
- Top-right mono status block:
  `STATUS: SHIPPING` / `LOCATION: NEPAL` / `ROLE: LEAD ENGINEER` /
  `OPEN TO: GOOD PEOPLE_` with a blinking blue `_` cursor.

### `~/work` — project index
- Header row (mono): `~/work — THINGS I'VE SHIPPED` / `2019 — 2026`.
- One row per `resumeData.portfolio` entry, grid `48px 1fr 180px 120px`:
  index (01–05), title (32px), tag (mono), action `OPEN ↗` (blue) linking to `webURL`
  in a new tab.
- Tags: Krane → `AI · LOGISTICS`, Venteur → `HEALTHCARE`, Memora Health → `AUTOMATION`,
  Restaurant POS → `HOSPITALITY`, Crypto Wallet → `BLOCKCHAIN`. (Tag copy lives in a
  small map in `page.tsx`; falls back to empty if a project is added later.)

### Featured tile
- Full-width 21:9 striped placeholder, mono label
  `[ featured — product hero shot, 21:9 ]`. Real `<img>` slot wired but pointing at a
  placeholder path the user swaps later. Clip-reveal on scroll.

### `~/about` — README.md (grid `200px 1fr`)
- Left: mono file label `~/about — README.md`.
- Right: lead paragraph (34px) with one phrase highlighted blue, sourced/condensed
  from `resumeData.aboutme`; then 3 stats that count up on scroll (once, threshold 0.6):
  - **6y+** — YEARS SHIPPING (suffix `y+`)
  - **5** — PRODUCTS BUILT
  - **20+** — ENGINEERS LED (suffix `+`)

### `~/experience` — job history (NEW, grid `200px 1fr`)
- Left: mono label `~/experience — WHERE I'VE WORKED`.
- Right: one index-style row per `resumeData.work` entry — role (title), company (mono),
  period (mono, right-aligned). Rows:
  - VP of IT & Communication · Nepal Music Festival · NOW
  - Full Stack / Senior Engineer · Leapfrog Technology · 2025
  - Assistant Lecturer · Nepal College of IT · 2022
  - CTO / Director · Software Factory · 2022
- Same hover treatment as the work index (bg shift, title translateX + blue).

### `~/skills` (grid `200px 1fr`)
- Left: mono label `~/skills — WHAT I DO`.
- Right: one row per `resumeData.skills` entry — the label part as title
  (Languages / DevOps / Database / Operations / Industry / Technology), the value list
  as mono meta on the right. (Split each `skillname` on the first `:`.)

### Contact
- Kicker (blue): `$ echo "let's talk" — I actually reply`.
- Magnetic email `redmenishab@gmail.com` (80px uppercase → blue on hover),
  `mailto:` link.
- Footer row (mono): `© 2026 — REDMEN ISHAB` /
  `GITHUB ↗ · LINKEDIN ↗ · MEDIUM ↗` (from `resumeData.socialLinks` + `website`).

## 6. Interactions

All easing `cubic-bezier(.2,.7,0,1)` unless noted; all gated on `prefers-reduced-motion`.

- **Wireframe hero:** 520-point Fibonacci sphere, orthographic projection,
  auto-rotate ~0.0045 rad/frame; point size + alpha scale by z-depth; sphere eases a
  tilt toward the cursor over the hero. DPR-capped at 2. Cleaned up on unmount.
- **Cursor glow:** soft ~560px radial circle follows the pointer inside the hero;
  fades in on enter, out on leave.
- **Index rows (work + experience):** on hover, row bg → `#0d0f13`, index → blue,
  title `translateX(14px)` + blue, action arrow `translateX(8px)`; 0.3s transitions.
- **Count-up stats:** animate 0 → target over ~1.1s (cubic ease-out) when scrolled into
  view (threshold 0.6), once; supports a suffix.
- **Magnetic email:** on pointer-move within the element, translate up to ~16px/12px
  toward the cursor; reset on leave; 0.15s ease-out.
- **Blinking cursor:** the `_` in the status block blinks at 1s step-end.
- **Scroll-reveal:** sections fade/slide up (opacity 0→1, translateY 48→0) or clip-reveal
  as they enter the viewport, via Framer Motion `whileInView` (`once: true`); stagger
  siblings ~50–80ms.

## 7. State

Minimal, mostly-static marketing page:
- Per-hero pointer target ref driving canvas parallax/tilt.
- In-view flags handled by Framer Motion.
- "Has counted" flag per stat so count-up runs once.
No data fetching.

## 8. Responsive

- Fluid type via `clamp()` (H1 112px → ~44px on mobile).
- Index grids collapse to stacked rows on narrow screens.
- Status block moves below the H1 on mobile.
- Nav center part hides under ~640px.
- Featured tile keeps 21:9 aspect ratio.

## 9. Assets

- Portrait / product screenshots are supplied later by the user. Wire real `<img>`/slot
  positions with striped placeholders and clear labels so they are trivially swappable.
- Fonts are Google Fonts via `next/font`. No icon library — arrows are literal glyphs
  (↗ ↓ ◆ —).

## 10. Out of Scope

- Real imagery (placeholders only until the user supplies assets).
- CMS / dynamic content (data stays in `resumeData.js`).
- The Direction 1A editorial variant.
- Testimonials section (not part of 1B; existing single testimonial left unused).
