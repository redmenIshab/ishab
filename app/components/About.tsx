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
