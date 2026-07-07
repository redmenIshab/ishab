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
