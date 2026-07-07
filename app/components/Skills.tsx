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
