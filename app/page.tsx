'use client';

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import resumeData from '../resumeData';

type Star = {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  phase: number;
};

const STAR_COLORS = ["#ffffff", "#d8ecff", "#d9c7ff", "#ff9d8f"];

function createStar(width: number, height: number, maxDepth: number): Star {
  return {
    x: (Math.random() - 0.5) * width * 2,
    y: (Math.random() - 0.5) * height * 2,
    z: Math.random() * maxDepth + 1,
    size: Math.random() * 1.4 + 0.4,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  };
}

function WarpCanvas({
  reduceMotion,
  scope,
  hudLabel = "Warp",
}: {
  reduceMotion: boolean;
  scope?: "hero" | "work";
  hudLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hudSpeed, setHudSpeed] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    let frameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let targetWarp = 0;
    let currentWarp = 0;
    let hudTick = 0;
    const maxDepth = 1800;
    const isWorkScope = scope === "work";
    const maxWarp = isWorkScope ? 32 : 40;
    const scrollInfluence = isWorkScope ? 0.035 : 0.05;
    const baseWarp = reduceMotion ? 0.35 : isWorkScope ? 0.45 : 0.75;
    const decay = reduceMotion ? 0.85 : isWorkScope ? 0.95 : 0.92;
    const settle = reduceMotion ? 0.1 : isWorkScope ? 0.06 : 0.08;
    const streakThreshold = isWorkScope ? 8 : 6;
    const normalizeDenominator = isWorkScope ? 16 : 20;
    let stars: Star[] = [];
    let workObserver: IntersectionObserver | null = null;

    const spawn = (star?: Star) => {
      const target = star ?? ({} as Star);
      target.x = (Math.random() - 0.5) * width * 2;
      target.y = (Math.random() - 0.5) * height * 2;
      target.z = maxDepth;
      target.size = Math.random() * 1.4 + 0.4;
      target.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      target.phase = Math.random() * Math.PI * 2;
      return target;
    };

    const resetCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width || window.innerWidth));
      height = Math.max(1, Math.floor(rect.height || window.innerHeight));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.max(500, Math.floor((width * height) / 2400));
      stars = Array.from({ length: density }, () => createStar(width, height, maxDepth));
    };

    const onScroll = () => {
      const next = window.scrollY;
      const delta = next - lastScrollY;
      lastScrollY = next;
      targetWarp = Math.min(maxWarp, targetWarp + Math.abs(delta) * scrollInfluence);
    };

    const drawNebula = (time: number) => {
      const drift = reduceMotion ? 0 : time * 0.00004;
      const g1 = ctx.createRadialGradient(
        width * (0.22 + Math.sin(drift) * 0.03),
        height * (0.28 + Math.cos(drift) * 0.03),
        0,
        width * 0.24,
        height * 0.3,
        Math.max(width, height) * 0.65,
      );
      g1.addColorStop(0, "rgba(217, 199, 255, 0.09)");
      g1.addColorStop(1, "rgba(217, 199, 255, 0)");

      const g2 = ctx.createRadialGradient(
        width * (0.78 + Math.cos(drift * 1.6) * 0.02),
        height * (0.72 + Math.sin(drift * 1.2) * 0.03),
        0,
        width * 0.8,
        height * 0.72,
        Math.max(width, height) * 0.58,
      );
      g2.addColorStop(0, "rgba(216, 236, 255, 0.07)");
      g2.addColorStop(1, "rgba(216, 236, 255, 0)");

      const g3 = ctx.createRadialGradient(width * 0.58, height * 0.16, 0, width * 0.6, height * 0.2, Math.max(width, height) * 0.42);
      g3.addColorStop(0, "rgba(255, 157, 143, 0.06)");
      g3.addColorStop(1, "rgba(255, 157, 143, 0)");

      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);
    };

    const draw = (time: number) => {
      const dt = Math.min(40, time - lastTime);
      lastTime = time;

      targetWarp = Math.max(baseWarp, targetWarp * decay);
      currentWarp += (targetWarp - currentWarp) * settle;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#03010a";
      ctx.fillRect(0, 0, width, height);
      drawNebula(time);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const speed = (currentWarp * dt) / 16;
      const focal = Math.min(900, width * 0.75);

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        star.z -= speed;

        if (star.z <= 1) {
          spawn(star);
        }

        const perspective = focal / star.z;
        const sx = star.x * perspective + centerX;
        const sy = star.y * perspective + centerY;

        if (sx < -100 || sx > width + 100 || sy < -100 || sy > height + 100) {
          spawn(star);
          continue;
        }

        const prevZ = star.z + speed * 3.2;
        const prevPerspective = focal / prevZ;
        const px = star.x * prevPerspective + centerX;
        const py = star.y * prevPerspective + centerY;

        const depthAlpha = Math.min(1, (1 - star.z / maxDepth) * 1.25);
        const twinkle = 0.62 + Math.sin(time * 0.0018 + star.phase) * 0.38;
        const streakiness = Math.min(1, currentWarp / 18);

        ctx.globalAlpha = depthAlpha * twinkle;

        if (!reduceMotion && currentWarp > streakThreshold) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.size * (0.6 + streakiness * 1.5);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = star.color;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      const normalized = Math.max(0, Math.min(1, (currentWarp - baseWarp) / normalizeDenominator));
      if (time - hudTick > 40) {
        hudTick = time;
        setHudSpeed(normalized);
      }

      frameId = window.requestAnimationFrame(draw);
    };

    resetCanvas();

    if (isWorkScope) {
      const scopeRoot = canvas.parentElement;
      const cards = scopeRoot?.querySelectorAll(".work-card");

      if (cards && cards.length > 0) {
        workObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Boost warp as each work card appears to create a travel checkpoint effect.
                targetWarp = Math.min(maxWarp, targetWarp + 9);
              }
            });
          },
          { threshold: 0.55 },
        );

        cards.forEach((card) => workObserver?.observe(card));
      }
    }

    window.addEventListener("resize", resetCanvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    frameId = window.requestAnimationFrame(draw);

    return () => {
      workObserver?.disconnect();
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resetCanvas);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion, scope]);

  const speedValue = Math.max(1, Math.round(hudSpeed * 9));

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`warp-canvas${scope ? ` warp-canvas-${scope}` : ""}`}
        aria-hidden="true"
      />
      <div className={`warp-hud${scope ? ` warp-hud-${scope}` : ""}`} aria-hidden="true">
        <span className="warp-hud-label">{hudLabel}</span>
        <div className="warp-hud-track">
          <div className="warp-hud-fill" style={{ transform: `scaleX(${hudSpeed})` }} />
        </div>
        <span className="warp-hud-value">{speedValue.toString().padStart(2, "0")}</span>
      </div>
    </>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.32], [0, shouldReduceMotion ? 0 : -72]);
  const heroArrivalOpacity = useTransform(scrollYProgress, [0, 0.06, 0.16], [0.55, 1, 1]);
  const heroArrivalY = useTransform(scrollYProgress, [0, 0.12], [shouldReduceMotion ? 0 : 18, 0]);

  const projects = resumeData.portfolio.map((proj, idx) => ({
    name: proj.name,
    year: new Date().getFullYear().toString(),
    blurb: proj.description,
    stack: [],
    tone: idx % 3 === 0 ? "violet" : idx % 3 === 1 ? "amber" : "cyan",
    url: proj.webURL
  }));

  const skills = resumeData.skills.map((s) => s.skillname);
  const experiences = resumeData.work.map((workItem) => {
    const period = [workItem.MonthOfLeaving, workItem.YearOfLeaving]
      .filter(Boolean)
      .join(" ") || "Current";
    const highlights = workItem.Achievements.split("\n")
      .map((line) => line.replace(/^-\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 4);

    return {
      company: workItem.CompanyName,
      role: workItem.specialization,
      period,
      highlights,
    };
  });

  return (
    <div className="portfolio-root">
          <WarpCanvas reduceMotion={shouldReduceMotion ?? false} hudLabel="Transit" />

      <header className="top-shell">
        <a className="brand" href="#home">
          <span className="brand-orb" aria-hidden="true" />
          <span className="brand-text">{resumeData.name.split(' ')[1].toUpperCase()}</span>
        </a>
        <nav className="top-nav">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="page-shell" id="home">
        <motion.section
          className="hero-shell"
          style={{ y: heroY }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.2, 1] }}
        >
          <motion.div className="hero-content" style={{ opacity: heroArrivalOpacity, y: heroArrivalY }}>
            <p className="kicker">{resumeData.role}</p>
            <h1 className="hero-title">
              <span>{resumeData.name.split(' ')[0]}</span>
              <span>{resumeData.name.split(' ')[1]}</span>
            </h1>
            <p className="hero-copy">
              {resumeData.roleDescription ||
                "Full-stack engineer and technical leader passionate about building scalable products and mentoring teams to ship exceptional solutions."}
            </p>
            <div className="hero-actions">
              <a href="#projects" className="action-primary">
                View Projects
              </a>
              <a href="#contact" className="action-secondary">
                Start a Conversation
              </a>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className="glass-panel about-shell"
          id="about"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 34, filter: "blur(5px)" }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.2, 0.65, 0.2, 1] }}
        >
          <div>
            <p className="kicker">Philosophy</p>
            <h2>Technical Excellence + Human Impact</h2>
          </div>
          <p className="about-copy">
            {resumeData.aboutme}
          </p>
          <div className="facts-row">
            <article>
              <p className="fact-value">6+</p>
              <p className="fact-label">Years Experience</p>
            </article>
            <article>
              <p className="fact-value">{resumeData.portfolio.length}</p>
              <p className="fact-label">Projects Built</p>
            </article>
            <article>
              <p className="fact-value">20+</p>
              <p className="fact-label">Team Members Led</p>
            </article>
          </div>
        </motion.section>

        <motion.section
          className="work-shell"
          id="work"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.2, 1] }}
        >
          <div className="work-content">
            <div className="section-head">
              <p className="kicker">Career Log</p>
              <h2>Travel Through Work Experience</h2>
            </div>
            <div className="work-grid">
              {experiences.map((item, index) => (
                <motion.article
                  className="glass-panel work-card"
                  key={`${item.company}-${item.role}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 26, filter: "blur(4px)" }}
                  whileInView={
                    shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.52, delay: shouldReduceMotion ? 0 : index * 0.08 }}
                >
                  <div className="work-top">
                    <h3>{item.company}</h3>
                    <span>{item.period}</span>
                  </div>
                  <p className="work-role">{item.role}</p>
                  <ul className="work-highlights">
                    {item.highlights.map((line) => (
                      <li key={`${item.company}-${line}`}>{line}</li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="projects-shell"
          id="projects"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.2, 0.65, 0.2, 1] }}
        >
          <div className="section-head">
            <p className="kicker">Featured Work</p>
            <h2>Notable Projects</h2>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <motion.article
                className={`glass-panel project-card tone-${project.tone}`}
                key={project.name}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.05 }}
              >
                <a href={project.url} target="_blank" rel="noreferrer" className="project-link">
                <div className="project-top">
                  <h3>{project.name}</h3>
                  <span>{project.year}</span>
                </div>
                <p>{project.blurb}</p>
                {project.stack.length > 0 && (
                  <ul>
                    {project.stack.map((item) => (
                      <li key={`${project.name}-${item}`}>{item}</li>
                    ))}
                  </ul>
                )}
                </a>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="skills-shell"
          aria-label="skills"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.2, 0.65, 0.2, 1] }}
        >
          <div className="section-head">
            <p className="kicker">Skill Constellations</p>
            <h2>Core Modules</h2>
          </div>
          <div className="skills-grid">
            {skills.map((skill) => (
              <motion.article
                className="glass-chip"
                key={skill}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.4 }}
              >
                <p>{skill}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="glass-panel contact-shell"
          id="contact"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: [0.2, 0.65, 0.2, 1] }}
        >
          <div className="section-head">
            <p className="kicker">Signal Log</p>
            <h2>Let&apos;s Build Something Together</h2>
          </div>
          <p>
            I&apos;m always interested in solving complex problems, mentoring talented engineers,
            and building products that make an impact.
          </p>
          <div className="contact-actions">
            <a href={`mailto:${resumeData.gmailId}`} className="action-primary">
              {resumeData.gmailId}
            </a>
            {resumeData.socialLinks && resumeData.socialLinks.length > 0 && (
              <a 
                href={resumeData.socialLinks[0].url} 
                target="_blank" 
                rel="noreferrer" 
                className="action-secondary"
              >
                LinkedIn
              </a>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
