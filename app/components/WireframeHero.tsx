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
        const x = p.x * ca - p.z * sa;
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
