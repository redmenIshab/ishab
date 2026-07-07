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
